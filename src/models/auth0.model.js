const mongoose = require('mongoose');

module.exports = (connection) => {
  const schema = new mongoose.Schema({}, { autoCreate: true, strict: false });

  return connection.model('auth0', schema, 'auth0');
};
