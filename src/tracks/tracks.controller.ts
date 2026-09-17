import {
  BadRequestException, Body,
  Controller, Delete,
  Get, NotFoundException, Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema.js';
import { Model, Types } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema.js';
import { CreateTrackDto } from './create.track.dto.js';

@Controller('tracks')
export class TracksController {

  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {
  }

  @Get()
  async getAll(@Query('album') album?: string) {
    const filter: Record<string, unknown> = {};

    if (album) {
      if (!Types.ObjectId.isValid(album)) {
        throw new BadRequestException('Invalid album ID!');
      }

      filter.album = album;
    }

    return this.trackModel
      .find(filter)
      .sort({ trackNumber: 1 })
      .populate('album', 'title');
  }

  @Post()
  async create(@Body() trackDto: CreateTrackDto) {
    if (!trackDto.title.trim()) {
      throw new BadRequestException('Track title is required!');
    }

    if (!trackDto.album.trim()) {
      throw new BadRequestException('Album is required!');
    }

    if (!Types.ObjectId.isValid(trackDto.album)) {
      throw new BadRequestException('Invalid album ID!');
    }

    const album =
      await this.albumModel.findById(trackDto.album);

    if (!album) {
      throw new NotFoundException('Album not found!');
    }

    if (!trackDto.duration.trim()) {
      throw new BadRequestException('Duration is required!');
    }

    const parsedTrackNumber = Number(trackDto.trackNumber);

    if (!Number.isInteger(parsedTrackNumber) || parsedTrackNumber < 1) {
      throw new BadRequestException('Track number must be a positive integer!');
    }

    const track = new this.trackModel({
      title: trackDto.title.trim(),
      album: trackDto.album,
      duration: trackDto.duration.trim(),
      trackNumber: parsedTrackNumber,
    });

    try {
      return await track.save();
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === 11000) {
        throw new BadRequestException('This track number is already used in the album!');
      }

      throw e;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid track ID!');
    }

    const track = await this.trackModel.findById(id);

    if (!track) {
      throw new NotFoundException('Track not found!');
    }

    await track.deleteOne();

    return { message: 'Track deleted!' };
  }
}