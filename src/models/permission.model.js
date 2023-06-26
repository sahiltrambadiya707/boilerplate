const mongoose = require('mongoose');

module.exports = (connection, collectionName) => {
  const schema = mongoose.Schema(
    {
      role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
      module: {
        type: Object,
        required: true,
      },
      canRead: {
        type: Boolean,
        default: false,
      },
      canAdd: {
        type: Boolean,
        default: false,
      },
      canUpdate: {
        type: Boolean,
        default: false,
      },
      canDelete: {
        type: Boolean,
        default: false,
      },
      canUpload: {
        type: Boolean,
        default: false,
      },
      canDownload: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
      autoCreate: true,
    }
  );

  return connection.model(collectionName, schema, collectionName);
};
