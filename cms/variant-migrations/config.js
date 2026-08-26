'use strict';
console.log(process.cwd());

module.exports = {
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    databaseName: process.env.MONGO_DB_NAME || 'hcmi',
  },
  migrationsDir: './cms/variant-migrations/migrations',
  changelogCollectionName: 'changelog',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
