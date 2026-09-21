import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Artist, ArtistSchema } from './schemas/artist.schema.js';
import { Album, AlbumSchema } from './schemas/album.schema.js';
import { Track, TrackSchema } from './schemas/track.schema.js';
import { User, UserSchema } from './schemas/user.schema.js';

const mongoDbUrl = 'mongodb://localhost/tune';

const run = async () => {
  await mongoose.connect(mongoDbUrl);

  const ArtistModel = mongoose.model<Artist>(
    Artist.name,
    ArtistSchema,
  );

  const AlbumModel = mongoose.model<Album>(
    Album.name,
    AlbumSchema,
  );

  const TrackModel = mongoose.model<Track>(
    Track.name,
    TrackSchema,
  );

  const UserModel = mongoose.model<User>(
    User.name,
    UserSchema,
  );

  try {
    await TrackModel.deleteMany({});
    await AlbumModel.deleteMany({});
    await ArtistModel.deleteMany({});
    await UserModel.deleteMany({});

    console.log('Old fixtures deleted!');

    const artist1 = await new ArtistModel({
      name: 'Taylor Swift',
      information: 'American singer-songwriter',
      image: null,
      isPublished: true,
    }).save();

    const artist2 = await new ArtistModel({
      name: 'The Weeknd',
      information: 'Canadian singer-songwriter',
      image: null,
      isPublished: true,
    }).save();

    const artist3 = await new ArtistModel({
      name: 'Test Artist',
      information: 'Test Artist information',
      image: null,
      isPublished: false,
    }).save();

    const album1 = await new AlbumModel({
      title: '1989 (Taylor\'s Version)',
      artist: artist1._id,
      releaseYear: 2023,
      coverImage: null,
      isPublished: true,
    }).save();

    const album2 = await new AlbumModel({
      title: 'Midnights',
      artist: artist1._id,
      releaseYear: 2022,
      coverImage: null,
      isPublished: true,
    }).save();

    const album3 = await new AlbumModel({
      title: 'After Hours',
      artist: artist2._id,
      releaseYear: 2020,
      coverImage: null,
      isPublished: true,
    }).save();

    const album4 = await new AlbumModel({
      title: 'Starboy',
      artist: artist2._id,
      releaseYear: 2016,
      coverImage: null,
      isPublished: true,
    }).save();

    const unpublishedAlbum = await new AlbumModel({
      title: 'Unpublished Album',
      artist: artist3._id,
      releaseYear: 2026,
      coverImage: null,
      isPublished: false,
    }).save();

    await TrackModel.insertMany([
      {
        title: 'Welcome to New York',
        album: album1._id,
        duration: '3:32',
        trackNumber: 1,
        isPublished: true,
      },
      {
        title: 'Blank Space',
        album: album1._id,
        duration: '3:51',
        trackNumber: 2,
        isPublished: true,
      },
      {
        title: 'Style',
        album: album1._id,
        duration: '3:51',
        trackNumber: 3,
        isPublished: true,
      },
      {
        title: 'Out of the Woods',
        album: album1._id,
        duration: '3:55',
        trackNumber: 4,
        isPublished: true,
      },
      {
        title: 'Shake It Off',
        album: album1._id,
        duration: '3:39',
        trackNumber: 5,
        isPublished: true,
      },

      {
        title: 'Lavender Haze',
        album: album2._id,
        duration: '3:22',
        trackNumber: 1,
        isPublished: true,
      },
      {
        title: 'Maroon',
        album: album2._id,
        duration: '3:38',
        trackNumber: 2,
        isPublished: true,
      },
      {
        title: 'Anti-Hero',
        album: album2._id,
        duration: '3:20',
        trackNumber: 3,
        isPublished: true,
      },
      {
        title: 'Snow on the Beach',
        album: album2._id,
        duration: '4:16',
        trackNumber: 4,
        isPublished: true,
      },
      {
        title: 'You are on Your Own, Kid',
        album: album2._id,
        duration: '3:14',
        trackNumber: 5,
        isPublished: true,
      },

      {
        title: 'Alone Again',
        album: album3._id,
        duration: '4:10',
        trackNumber: 1,
        isPublished: true,
      },
      {
        title: 'Too Late',
        album: album3._id,
        duration: '3:59',
        trackNumber: 2,
        isPublished: true,
      },
      {
        title: 'Hardest to Love',
        album: album3._id,
        duration: '3:31',
        trackNumber: 3,
        isPublished: true,
      },
      {
        title: 'Scared to Live',
        album: album3._id,
        duration: '3:11',
        trackNumber: 4,
        isPublished: true,
      },
      {
        title: 'Blinding Lights',
        album: album3._id,
        duration: '3:20',
        trackNumber: 5,
        isPublished: true,
      },

      {
        title: 'Starboy',
        album: album4._id,
        duration: '3:50',
        trackNumber: 1,
        isPublished: true,
      },
      {
        title: 'Party Monster',
        album: album4._id,
        duration: '4:09',
        trackNumber: 2,
        isPublished: true,
      },
      {
        title: 'False Alarm',
        album: album4._id,
        duration: '3:40',
        trackNumber: 3,
        isPublished: true,
      },
      {
        title: 'Reminder',
        album: album4._id,
        duration: '3:51',
        trackNumber: 4,
        isPublished: true,
      },
      {
        title: 'Rockin’',
        album: album4._id,
        duration: '3:52',
        trackNumber: 5,
        isPublished: true,
      },

      {
        title: 'Unpublished 1',
        album: unpublishedAlbum._id,
        duration: '3:20',
        trackNumber: 1,
        isPublished: false,
      },
      {
        title: 'Unpublished 2',
        album: unpublishedAlbum._id,
        duration: '3:30',
        trackNumber: 2,
        isPublished: false,
      },
      {
        title: 'Unpublished 3',
        album: unpublishedAlbum._id,
        duration: '3:40',
        trackNumber: 3,
        isPublished: false,
      },
    ]);

    await new UserModel({
      username: 'admin',
      password: '1234',
      role: 'admin',
      token: randomUUID(),
    }).save();

    await new UserModel({
      username: 'user',
      password: '1234',
      role: 'user',
      token: randomUUID(),
    }).save();

    console.log('Fixtures populated!');
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});