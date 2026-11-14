import * as migration_20261114_105846_initial from './20261114_105846_initial';
import * as migration_20261114_154600_storage_columns_and_simpler_admin from './20261114_154600_storage_columns_and_simpler_admin';

export const migrations = [
  {
    up: migration_20261114_105846_initial.up,
    down: migration_20261114_105846_initial.down,
    name: '20261114_105846_initial',
  },
  {
    up: migration_20261114_154600_storage_columns_and_simpler_admin.up,
    down: migration_20261114_154600_storage_columns_and_simpler_admin.down,
    name: '20261114_154600_storage_columns_and_simpler_admin'
  },
];
