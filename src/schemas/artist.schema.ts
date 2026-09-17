import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({ default: null })
  image: string;

  @Prop({ default: null })
  information: string;

  @Prop({
    required: true,
    default: false,
  })
  isPublished: boolean;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);