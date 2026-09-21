import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema.js';
import { Album, AlbumSchema } from './schemas/album.schema.js';
import { Track, TrackSchema } from './schemas/track.schema.js';
import { AlbumsController } from './albums/albums.controller.js';
import { TracksController } from './tracks/tracks.controller.js';
import { ArtistsController } from './artists/artists.controller.js';
import { User, UserSchema } from './schemas/user.schema.js';
import { UsersController } from './users/users.controller.js';
import { AuthGuard } from './middlewares/auth.guard.js';
import { RolesGuard } from './middlewares/roles.guard.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/tune'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],

  controllers: [
    ArtistsController,
    AlbumsController,
    TracksController,
    UsersController],

  providers: [AppService, AuthGuard, RolesGuard],
})
export class AppModule {
}
