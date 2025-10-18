const mongoose = require('mongoose');

const ejercicioSchema = new mongoose.Schema({
  nombre: String,
  musculo: String,
  descripcion: String,
  link: String
});

module.exports = mongoose.model('Ejercicio', ejercicioSchema);
