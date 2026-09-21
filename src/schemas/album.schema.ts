import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  })
  artist: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Release year must be an integer!',
    },
  })
  releaseYear: number;

  @Prop({ default: null })
  coverImage: string;

  @Prop({
    required: true,
    default: false,
  })
  isPublished: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);