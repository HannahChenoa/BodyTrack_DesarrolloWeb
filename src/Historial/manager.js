const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Esquema del historial (o conéctalo a tu modelo real si ya lo tienes)
const historySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  nombreRutina: String,
  fecha: String,
  ejercicios: [
    {
      nombre: String,
      series: [
        {
          repeticiones: String,
          peso: String,
          unidad: String
        }
      ]
    }
  ]
});


const History = mongoose.model('History', historySchema, 'history'); // 'history' = nombre de la colección en MongoDB

// GET /api/history/:userId
router.get('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await History.find({ userId: new mongoose.Types.ObjectId(userId) });
    res.json(data);
  } catch (err) {
    console.error('Error al obtener historial:', err);
    res.status(500).json({ message: 'Error al consultar historial' });
  }
});

// POST /api/history
router.post('/api/history', async (req, res) => {
    try {
      const { userId, nombreRutina, fecha, ejercicios } = req.body;
  
      if (!userId || !nombreRutina || !fecha || !Array.isArray(ejercicios)) {
        return res.status(400).json({ message: 'Datos incompletos' });
      }
  
      const nuevaRutina = new History({
        userId: new mongoose.Types.ObjectId(userId),
        nombreRutina,
        fecha,
        ejercicios
      });
  
      await nuevaRutina.save();
  
      res.status(201).json({ message: 'Rutina guardada exitosamente' });
    } catch (err) {
      console.error('Error al guardar rutina:', err);
      res.status(500).json({ message: 'Error al guardar rutina' });
    }
  });

  router.delete('/api/history/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await History.findByIdAndDelete(id);
      res.json({ message: 'Rutina eliminada correctamente' });
    } catch (err) {
      console.error('Error al eliminar rutina:', err);
      res.status(500).json({ message: 'Error al eliminar rutina' });
    }
  });
  
  

module.exports = router;
