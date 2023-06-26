module.exports = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Retrieve auth0 user document',
      //   description: 'Login Admin And Returns Auth Tokens',
      security: [
        {
          cookieAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'number',
                    example: '200',
                  },
                  message: { type: 'string', example: 'Document fetched successfully' },
                  payload: {
                    type: 'object',
                    properties: {
                      result: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string', example: 'mongo id' },
                          email: { type: 'string', example: 'sahil@gmail.com' },
                          nickname: { type: 'string', example: 'sahil' },
                          picture: { type: 'string', example: 'image link' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
