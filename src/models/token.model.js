const mongoose = require('mongoose');

module.exports = (connection, collectionName) => {
  const schema = mongoose.Schema(
    {
      auth0Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth0',
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      auth0: {
        token: {
          type: String,
        },
        expires: {
          type: Number,
        },
        blacklisted: {
          type: Boolean,
          default: false,
        },
      },
      local: {
        token: {
          type: String,
        },
        expires: {
          type: Number,
        },
        blacklisted: {
          type: Boolean,
          default: false,
        },
      },
    },
    {
      timestamps: true,
      autoCreate: true,
    }
  );

  return connection.model(collectionName, schema, collectionName);
};
