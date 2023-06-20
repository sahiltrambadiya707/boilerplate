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

    /* All the (mongoose) models to be defined here */
    models = {
      GLOBAL: {
        TOKEN: require('../models/token.model')(connection_IN_DB_NAME),
        LOG: require('../models/log')(mongooseConnections.GLOBAL.DB_NAME),
      },
    };

    return models;
  } catch (error) {
    logger.error('Error encountered while trying to create database connections and models:\n' + error.stack);
    return null;
  }
};
