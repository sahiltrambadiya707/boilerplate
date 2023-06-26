const mongoose = require('mongoose');

module.exports = (connection, collectionName) => {
  const schema = mongoose.Schema(
    {
      icon: {
        type: String,
        trim: true,
        default: '',
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      code: {
        type: String,
        required: true,
        trim: true,
      },
      route: {
        type: String,
        trim: true,
      },
      activeOn: {
        type: Array,
        default: [],
      },
      parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        default: null,
      },
      isForAdmin: {
        type: Boolean,
        default: false,
      },
      sortOrder: {
        type: Number,
        default: 1,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
      autoCreate: true,
    }
  );

  /**
   * Check if code exists or not
   * @param {string} code - Module identifier
   * @param {ObjectId} [excludeModuleId] - The id of the module to be excluded
   * @returns {Promise<boolean>}
   */
  schema.statics.isCodeExists = async function (code, excludeModuleId) {
    const module = await this.findOne({ code, _id: { $ne: excludeModuleId } });
    return !!module;
  };

  return connection.model(collectionName, schema, collectionName);
};
