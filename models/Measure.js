const mongoose = require('mongoose');

const medidaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  medidas: [
    {
      parte: String,
      valor: String
    }
  ]
});

module.exports = mongoose.model('Measure', medidaSchema, 'measures');
