/**
 * MongoDB / Mongoose
 */
const mongoose = require('mongoose');
const logger = require('../config/logger');
const ConnectionFactory = require('./connection-factory');
const config = require('../../databaseConfig.json');

module.exports = async () => {
  mongoose.pluralize(null); // So that mongoose doesn't try to pluralize the schema and map accordingly.
  let models;
  try {
    const connectionFactory = new ConnectionFactory(config);
    // GLOBAL Connections
    const connection_IN_DB_NAME = await connectionFactory.getConnection('GLOBAL', config.MONGODB.GLOBAL.DATABASE.DB_NAME);

    const mongooseConnections = {
      GLOBAL: {
        DB_NAME: connection_IN_DB_NAME,
      },
    };

    const DB_COLLECTION = config.MONGODB.GLOBAL.DATABASE.DB_NAME.COLLECTION;

    /* All the (mongoose) models to be defined here */
    models = {
      GLOBAL: {
        TOKEN: require('../models/token.model')(mongooseConnections.GLOBAL.DB_NAME, DB_COLLECTION.TOKEN),
        LOG: require('../models/log.model')(mongooseConnections.GLOBAL.DB_NAME, DB_COLLECTION.LOG),
        AUTH0: require('../models/auth0.model')(mongooseConnections.GLOBAL.DB_NAME, DB_COLLECTION.AUTH0),
        MODULE: require('../models/module.model')(mongooseConnections.GLOBAL.DB_NAME, DB_COLLECTION.MODULE),
        PERMISSION: require('../models/permission.model')(mongooseConnections.GLOBAL.DB_NAME, DB_COLLECTION.PERMISSION),
        ROLE: require('../models/role.model')(mongooseConnections.GLOBAL.DB_NAME, DB_COLLECTION.ROLE),
        USER: require('../models/user.model')(mongooseConnections.GLOBAL.DB_NAME, DB_COLLECTION.USER),
      },
    };

    return models;
  } catch (error) {
    logger.error('Error encountered while trying to create database connections and models:\n' + error.stack);
    return null;
  }
};
