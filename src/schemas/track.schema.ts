import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  })
  album: mongoose.Types.ObjectId;

  @Prop({ required: true })
  duration: string;

  @Prop({
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'Track number must be a positive integer!',
    },
  })
  trackNumber: number;

  @Prop({
    required: true,
    default: false,
  })
  isPublished: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);