import * as migration_20261015_015347_initial from './20261015_015347_initial';
import * as migration_20261015_043528_profile_masonry from './20261015_043528_profile_masonry';
import * as migration_20261015_060303_add_galleries from './20261015_060303_add_galleries';
import * as migration_20261015_231143_add_settings_and_photos from './20261015_231143_add_settings_and_photos';
import * as migration_20261015_235856_add_uploadthing_storage from './20261015_235856_add_uploadthing_storage';

export const migrations = [
  {
    up: migration_20261015_015347_initial.up,
    down: migration_20261015_015347_initial.down,
    name: '20261015_015347_initial',
  },
  {
    up: migration_20261015_043528_profile_masonry.up,
    down: migration_20261015_043528_profile_masonry.down,
    name: '20261015_043528_profile_masonry',
  },
  {
    up: migration_20261015_060303_add_galleries.up,
    down: migration_20261015_060303_add_galleries.down,
    name: '20261015_060303_add_galleries',
  },
  {
    up: migration_20261015_231143_add_settings_and_photos.up,
    down: migration_20261015_231143_add_settings_and_photos.down,
    name: '20261015_231143_add_settings_and_photos',
  },
  {
    up: migration_20261015_235856_add_uploadthing_storage.up,
    down: migration_20261015_235856_add_uploadthing_storage.down,
    name: '20261015_235856_add_uploadthing_storage'
  },
];
