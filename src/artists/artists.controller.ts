import {
  BadRequestException, Body,
  Controller, Delete,
  Get,
  NotFoundException,
  Param, Post, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema.js';
import { Album, AlbumDocument } from '../schemas/album.schema.js';
import { Model, Types } from 'mongoose';
import { Track, TrackDocument } from '../schemas/track.schema.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create.artist.dto.js';
import 'multer';
import { AuthGuard } from '../middlewares/auth.guard.js';
import { RolesGuard } from '../middlewares/roles.guard.js';
import { Roles } from '../decorators/roles.decorator.js';

@Controller('artists')
export class ArtistsController {

  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {
  }


  @Get()
  async getAll() {
    return this.artistModel.find();
  }


  @Get(':id')
  async getOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid artist ID!');
    }

    const artist = await this.artistModel.findById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found!');
    }

    return artist;
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/images/artists' }),
  )
  async create(
    @UploadedFile() uploadedFile: Express.Multer.File,
    @Body() artistDto: CreateArtistDto,
  ) {
    if (!artistDto.name.trim()) {
      throw new BadRequestException('Artist name is required!');
    }

    const artist = new this.artistModel({
      name: artistDto.name.trim(),
      information: artistDto.information.trim() ? artistDto.information.trim() : null,

      image: uploadedFile ? 'images/artists/' + uploadedFile.filename : null,
    });

    try {
      return await artist.save();
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === 11000) {
        throw new BadRequestException('Artist with this name already exists!');
      }
      throw e;
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid artist ID!');
    }

    const artist = await this.artistModel.findById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found!');
    }

    const albums = await this.albumModel
      .find({ artist: id })
      .select('_id');

    const albumIds = albums.map((album) => album._id);

    if (albumIds.length) {
      await this.trackModel.deleteMany({
        album: { $in: albumIds },
      });

      await this.albumModel.deleteMany({ artist: id });
    }

    await artist.deleteOne();

    return { message: 'Artist deleted!' };
  }
}