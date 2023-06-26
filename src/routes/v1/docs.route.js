const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs/swaggerDef');
const docs = require('./docs/index.doc');
const router = express.Router();

const specs = {
  ...swaggerDefinition,
  paths: {
    ...docs,
  },
  components: {
    schemas: {
      Success: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
          },
          message: {
            type: 'string',
          },
          payload: {
            type: 'object',
            properties: {
              result: {
                type: 'any',
              },
            },
          },
        },
        example: {
          code: 200,
          message: 'Successfully',
          payload: {
            result: { test: 'test' },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
          },
          message: {
            type: 'string',
          },
          payload: {
            type: 'object',
            properties: {
              error: {
                type: 'any',
              },
            },
          },
          example: {
            code: 400,
            message: 'Error message',
            payload: {
              error: 'Error description',
            },
          },
        },
      },
    },
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
      },
    },
  },
};

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

module.exports = router;
