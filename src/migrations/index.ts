import * as migration_20261114_104245_initial from './20261114_104245_initial';

export const migrations = [
  {
    up: migration_20261114_104245_initial.up,
    down: migration_20261114_104245_initial.down,
    name: '20261114_104245_initial'
  },
];
