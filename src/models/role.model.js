const mongoose = require('mongoose');

module.exports = (connection, collectionName) => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      isActive: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    {
      timestamps: true,
      autoCreate: true,
    }
  );

  return connection.model(collectionName, schema, collectionName);
};
