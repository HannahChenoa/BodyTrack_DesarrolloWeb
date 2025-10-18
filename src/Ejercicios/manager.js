const express = require('express');
const router = express.Router();
const Ejercicio = require('../../models/Ejercicio'); // ← Importa el modelo

// POST /api/ejercicios → Crear un ejercicio nuevo
router.post('/api/ejercicios', async (req, res) => {
  try {
    const { nombre, musculo, descripcion, link } = req.body;
    if (!nombre || !musculo || !descripcion) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const nuevo = new Ejercicio({ nombre, musculo, descripcion, link });
    await nuevo.save();

    res.status(201).json({ message: 'Ejercicio guardado correctamente' });
  } catch (err) {
    console.error('Error al guardar ejercicio:', err);
    res.status(500).json({ message: 'Error al guardar ejercicio' });
  }
});

// GET /api/ejercicios → Obtener todos los ejercicios
router.get('/api/ejercicios', async (req, res) => {
  try {
    const ejercicios = await Ejercicio.find();
    res.json(ejercicios);
  } catch (err) {
    console.error('Error al obtener ejercicios:', err);
    res.status(500).json({ message: 'Error al obtener ejercicios' });
  }
});

module.exports = router;
