'use strict';

module.exports = {
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    databaseName: process.env.MONGO_DB_NAME || 'hcmi',
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
};
