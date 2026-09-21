import {
  BadRequestException, Body,
  Controller, Delete,
  Get, NotFoundException,
  Param, Post,
  Query, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema.js';
import { Model, Types } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema.js';
import { Track, TrackDocument } from '../schemas/track.schema.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create.album.dto.js';
import 'multer';
import { AuthGuard } from '../middlewares/auth.guard.js';
import { RolesGuard } from '../middlewares/roles.guard.js';
import { Roles } from '../decorators/roles.decorator.js';

@Controller('albums')
export class AlbumsController {

  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {
  }

  @Get()
  async getAll(@Query('artist') artist?: string) {
    const filter: Record<string, unknown> = {};

    if (artist) {
      if (!Types.ObjectId.isValid(artist)) {
        throw new BadRequestException('Invalid artist ID!');
      }

      filter.artist = artist;
    }

    const albums = await this.albumModel
      .find(filter)
      .sort({ releaseYear: -1 })
      .populate('artist', 'name');

    const validAlbums = albums.filter(
      (album) => album.artist,
    );

    const albumsWithTrackCount = await Promise.all(
      validAlbums.map(async (album) => {
        const count = await this.trackModel.countDocuments({ album: album._id });

        return Object.assign(album.toObject(), { tracksCount: count });
      }),
    );

    return albumsWithTrackCount;
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid album ID!');
    }

    const album = await this.albumModel
      .findById(id)
      .populate('artist', 'name');

    if (!album || !album.artist) {
      throw new NotFoundException('Album not found!');
    }

    return album;
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('coverImage', { dest: './public/images/albums' }),
  )
  async create(
    @UploadedFile()
    uploadedFile: Express.Multer.File,
    @Body()
    albumDto: CreateAlbumDto,
  ) {
    if (!albumDto.title.trim()) {
      throw new BadRequestException('Album title is required!');
    }

    if (!albumDto.artist.trim()) {
      throw new BadRequestException('Artist is required!');
    }

    if (!Types.ObjectId.isValid(albumDto.artist)) {
      throw new BadRequestException('Invalid artist ID!');
    }

    const artist = await this.artistModel.findById(albumDto.artist);

    if (!artist) {
      throw new NotFoundException('Artist not found!');
    }

    const parsedReleaseYear = Number(albumDto.releaseYear);

    if (!Number.isInteger(parsedReleaseYear) || parsedReleaseYear < 0) {
      throw new BadRequestException('Release year not be a negative integer!');
    }

    const album = new this.albumModel({
      title: albumDto.title.trim(),
      artist: albumDto.artist,
      releaseYear: parsedReleaseYear,

      coverImage: uploadedFile ? 'images/albums/' + uploadedFile.filename : null,
    });

    return album.save();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid album ID!');
    }

    const album = await this.albumModel.findById(id);

    if (!album) {
      throw new NotFoundException('Album not found!');
    }

    await this.trackModel.deleteMany({ album: id });
    await album.deleteOne();

    return { message: 'Album deleted!' };
  }
}