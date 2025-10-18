const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Measure = require('../../models/Measure');

// Obtener medidas por usuario
router.get('/measures/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let medidas = await Measure.findOne({ userId });

    if (!medidas) medidas = { userId, medidas: [] }; // Si no hay documento, devolvemos vacío

    res.json(medidas);
  } catch (err) {
    console.error('Error al obtener medidas:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Agregar nueva medida
router.post('/measures/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { parte, valor } = req.body;

    let registro = await Measure.findOne({ userId });

    if (!registro) {
      registro = new Measure({ userId, medidas: [{ parte, valor }] });
    } else {
      registro.medidas.push({ parte, valor });
    }

    await registro.save();
    res.status(201).json({ message: 'Medida agregada correctamente' });
  } catch (err) {
    console.error('Error al agregar medida:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Eliminar una medida por índice
router.delete('/measures/:userId/delete/:index', async (req, res) => {
  try {
    const { userId, index } = req.params;
    const registro = await Measure.findOne({ userId });

    if (!registro || !registro.medidas[index]) {
      return res.status(404).json({ message: 'Medida no encontrada' });
    }

    registro.medidas.splice(index, 1);
    await registro.save();

    res.json({ message: 'Medida eliminada' });
  } catch (err) {
    console.error('Error al eliminar medida:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
