const express = require('express');
const router = express.Router();
const Ejercicio = require('../../models/Ejercicio'); // Asegúrate que este archivo exista

// GET /api/ejercicios → Obtener todos los ejercicios
router.get('/api/ejercicios', async (req, res) => {
  try {
    const data = await Ejercicio.find();
    res.json(data);
  } catch (err) {
    console.error('Error al obtener ejercicios:', err);
    res.status(500).json({ message: 'Error al cargar ejercicios' });
  }
});

// POST /api/ejercicios → Crear nuevo ejercicio
router.post('/api/ejercicios', async (req, res) => {
  try {
    const { nombre, musculo, descripcion, link } = req.body;

    if (!nombre || !musculo || !descripcion) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const nuevo = new Ejercicio({ nombre, musculo, descripcion, link });
    await nuevo.save();

    res.status(201).json({ message: 'Ejercicio guardado exitosamente', insertado: nuevo });
  } catch (err) {
    console.error('Error al guardar ejercicio:', err);
    res.status(500).json({ message: 'Error al guardar ejercicio' });
  }
});

router.delete('/api/ejercicios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Ejercicio.findByIdAndDelete(id);
    res.json({ message: 'Ejercicio eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar ejercicio:', err);
    res.status(500).json({ message: 'Error al eliminar ejercicio' });
  }
});

// PUT /api/ejercicios/:id
router.put('/api/ejercicios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, musculo, descripcion, link } = req.body;

    const actualizado = await Ejercicio.findByIdAndUpdate(
      id,
      { nombre, musculo, descripcion, link },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    res.json({ message: 'Ejercicio actualizado', ejercicio: actualizado });
  } catch (err) {
    console.error('Error al actualizar ejercicio:', err);
    res.status(500).json({ message: 'Error al actualizar ejercicio' });
  }
});


module.exports = router;
