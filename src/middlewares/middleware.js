const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { jwtStrategy } = require('../config/passport');
const configuration = require('../config/config');
const { errorConverter, errorHandler } = require('./error');
const multipartFormParser = require('express-fileupload');

const { NODE_ENV = 'development' } = process.env;
const isRemote = NODE_ENV !== 'development';

module.exports = (app, logger) => {
  /* All middleware */
  const corsOpts = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  };
  app.use(cors(corsOpts));
  app.use(cookieParser());

  app.use(express.json({ limit: '10mb' })); // support parsing of application/json type post data
  app.use(express.urlencoded({ extended: true })); // support parsing of application/x-www-form-urlencoded post data
  app.use(helmet());

  // sanitize request data
  app.use(xss());
  app.use(mongoSanitize());

  // gzip compression
  app.use(compression());

  const path2data = path.join(__dirname, '../data');
  logger.info('Path to data: ' + path2data);
  app.use('/data', express.static(path2data));

  const path2images = path.join(__dirname, '../assets/img');
  logger.info('Path to images: ' + path2images);
  app.use('/images', express.static(path2images));

  const path2styles = path.join(__dirname, '../assets/css');
  logger.info('Path to styles: ' + path2styles);
  app.use('/styles', express.static(path2styles));

  //file size limit in bytes
  const maxFileSizeLimit = 20000000; // 20 mb

  // parse multipart form
  app.use(
    multipartFormParser({
      limits: {
        fieldSize: maxFileSizeLimit,
      },
      parseNested: true,
      defParamCharset: 'utf8',
    })
  );

  /* Middleware - PassportJS */
  // app.use(passport.initialize());
  // passport.use('jwt', jwtStrategy);

  const logIncomingRequest = require('../middlewares/log-incoming-request');

  app.use(logIncomingRequest);
};
