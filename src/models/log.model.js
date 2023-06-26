const mongoose = require('mongoose');

module.exports = (connection, collectionName) => {
  const schema = new mongoose.Schema(
    {
      description: { type: String, required: true },
      request: {
        id: String,
        body: Object,
        headers: Object,
        ip: String,
        method: String,
        path: String,
        protocol: String,
        userAgent: String,
      },
      server: {
        hostname: String,
        networkInterfaces: Array,
      },
      time: { type: Date, required: true },
    },
    {
      autoCreate: true,
    }
  );

  return connection.model(collectionName, schema, collectionName);
};
