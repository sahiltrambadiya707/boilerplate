const express = require('express');
const initDataBase = require('./db/database');
const os = require('os');
const initMiddleware = require('./middlewares/middleware');
const initRouter = require('./routes/v1/index');
const http = require('http');
const configuration = require('./config/config');

global.config = {};
global.limits = {};
global.models = {};

const runServer = async () => {
  const app = express();
  /* Logger */
  const logger = require('./config/logger');
  logger.info('Logger Initialized!');

  // Init Database connection
  await initDataBase(logger);

  logger.info(`
    APP_ENVIRONMENT: ${configuration.APP_ENVIRONMENT}
    APP_NAME: ${configuration.APP_NAME}
    APP_PORT: ${configuration.port}
    APP_RELEASE: ${configuration.APP_RELEASE}
    APP_VERSION: ${configuration.APP_VERSION}`);

  initMiddleware(app, logger);
  initRouter(app, logger);

  const server = http.createServer(app);

  server.listen(configuration.port, async () => {
    logger.info(`${configuration.APP_RELEASE} server STARTED on port: ${configuration.port}\n`);
    // await global.models.GLOBAL.LOG({
    //   description: `${configuration.APP_RELEASE} server STARTED on port: ${configuration.port}`,
    //   time: Date.now(),
    //   parameters: {},
    // }).save();
  });

  server.timeout = 120000;

  // process.setMaxListeners(30); // or set to Infinity
  process.on('SIGINT', () => {
    server.close(async () => {
      const convertToMB = (data) => Math.round((data / 1024 / 1024) * 100) / 100;
      const formatMemoryUsage = (data) => `${convertToMB(data)} MB`;
      const memoryData = process.memoryUsage();
      const memoryUsage = {
        rss: `Total memory allocated: ${formatMemoryUsage(memoryData.rss)}, `,
        heapTotal: `Total heap size: ${formatMemoryUsage(memoryData.heapTotal)}, `,
        heapUsed: `Actual memory used during the execution: ${formatMemoryUsage(memoryData.heapUsed)}, `,
        external: `V8 external memory: ${formatMemoryUsage(memoryData.external)}`,
      };
      const usageInPercent = Number((convertToMB(memoryData.heapUsed) * 100) / convertToMB(memoryData.heapTotal)).toFixed(2);
      const usageText = `${memoryUsage.rss}\n${memoryUsage.heapTotal}\n${memoryUsage.heapUsed}\n${memoryUsage.external}\nHeap usage is: ${usageInPercent}%`;
      const msg = `\`${configuration.APP_ENVIRONMENT}\` \`${
        configuration.APP_RELEASE
      }\` \`${os.hostname()}\` server *STOPPED* on *SIGINT*\`\`\`${usageText}\`\`\``;
      logger.error(msg.replace(/\//g, '').replace(/`/g, ''));
    });
  });
  process.on('SIGTERM', () => {
    server.close(async () => {
      const convertToMb = (data) => Math.round((data / 1024 / 1024) * 100) / 100;
      const formatMemoryUsage = (data) => `${convertToMb(data)} MB`;
      const memoryData = process.memoryUsage();
      const memoryUsage = {
        rss: `Total memory allocated: ${formatMemoryUsage(memoryData.rss)}, `,
        heapTotal: `Total heap size: ${formatMemoryUsage(memoryData.heapTotal)}, `,
        heapUsed: `Actual memory used during the execution: ${formatMemoryUsage(memoryData.heapUsed)}, `,
        external: `V8 external memory: ${formatMemoryUsage(memoryData.external)}`,
      };
      const usageInPercent = Number((convertToMb(memoryData.heapUsed) * 100) / convertToMb(memoryData.heapTotal)).toFixed(2);
      const usageText = `${memoryUsage.rss}\n${memoryUsage.heapTotal}\n${memoryUsage.heapUsed}\n${memoryUsage.external}\nHeap usage is: ${usageInPercent}%`;
      const msg = `\`${configuration.APP_ENVIRONMENT}\` \`${
        configuration.APP_RELEASE
      }\` \`${os.hostname()}\` server *STOPPED* on *SIGINT*\`\`\`${usageText}\`\`\``;
      logger.error(msg.replace(/\//g, '').replace(/`/g, ''));
    });
  });
};

module.exports = runServer;
