/**
 * Log incoming requests
 */
const flatten = require('flat');
const os = require('os');
const shortid = require('shortid');
const { isEmpty } = require('lodash');

const logger = require('../config/logger');
const utils = require('../utils/utils');

module.exports = exports = async (req, res, next) => {
  if (req.originalUrl === '/') {
    res.status(200).send('OK');
    return;
  }

  req.requestId = shortid.generate(); // assign a short id to the request so that can be correlated with the response

  let messageToLog = `REQ [${req.requestId}] [${req.method}] ${req.originalUrl}`;
  if (req.user) {
    messageToLog += `\nfrom: ${req.user._id} (type: ${req.user.type})`;
  }

  if (!isEmpty(req.body)) {
    if (req.originalUrl !== '/user/kyc') {
      let body = { ...req.body };
      body = flatten(body); // flattening the body for logging
      messageToLog += '\nbody: ' + JSON.stringify(body, null, 4);
    }
  }

  if (!isEmpty(req.headers)) {
    let headers = { ...req.headers };
    delete headers.authorization;
    headers = utils.sortByKeys(headers);
    messageToLog += '\nheaders: ' + JSON.stringify(headers);
  }

  if (/about(\??(.*)$|$)/i.test(req.originalUrl)) {
    // logger.info("----------------------------------------------------------------------------------------------------");
    logger.info(messageToLog);
    return next();
  } else {
    // logger.info("----------------------------------------------------------------------------------------------------");
    logger.info(messageToLog);

    /* log the request in database */
    const networkInterfaces = os.networkInterfaces();
    const entry = {
      description: 'Incoming request logged',
      request: {
        id: req.requestId,
        body: req.body,
        headers: req.headers,
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
        protocol: req.protocol,
        userAgent: req.get('user-agent'),
      },
      server: {
        hostname: os.hostname(),
        networkInterfaces: networkInterfaces,
      },
      time: Date.now(),
    };

    // try {
    //   await global.models.GLOBAL.LOG(entry).save({ checkKeys: false });
    // } catch (error) {
    //   if (error) {
    //     logger.error('Error encountered while trying to log the incoming request:\n' + error);
    //   }
    // }

    next();
  }
};
