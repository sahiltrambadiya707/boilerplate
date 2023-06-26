const mongoose = require('mongoose');

module.exports = (connection, collectionName) => {
  const schema = mongoose.Schema(
    {
      auth0Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth0',
      },
      voornaam: {
        type: String,
      },
      tussenvoegsel: {
        type: String,
      },
      achternaam: {
        type: String,
      },
      geslacht: {
        type: String,
      },
      postcode: {
        type: String,
      },
      huisnr: {
        type: String,
      },
      straat: {
        type: String,
      },
      woonplaats: {
        type: String,
      },
      telefoonnummer: {
        type: Number,
      },
      website: {
        type: String,
      },
    },
    {
      timestamps: true,
      autoCreate: true,
    }
  );

  return connection.model(collectionName, schema, collectionName);
};
