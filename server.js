const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const historyRoutes = require('./src/Historial/manager');
const ejerciciosRoutes = require('./src/Perfil_Ejercicios/manager'); // <- Mover esta línea aquí
const app = express();
const path = require('path');
const medidasRoutes = require('./src/Perfil/manager'); 



app.use(cors());
app.use(express.json());
app.use(historyRoutes);
app.use(ejerciciosRoutes);
app.use(express.static(path.join(__dirname)));
app.use(medidasRoutes);


const User = require(__dirname + '/models/User');
const profileController = require('./src/Perfil/profile_controller');



app.post('/register', async (req, res) => {
  try {
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});
app.get('/profile/:email', profileController.getUserByEmail);
app.put('/profile/:id', profileController.updateUser);
app.delete('/profile/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica que se reciban ambos campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    // Busca al usuario por correo
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Compara contraseñas (por ahora sin encriptar)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Inicio de sesión exitoso
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});



// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://BodyTrack:Hpuente7Mila@myapp.zta05mu.mongodb.net/MyAppDB?retryWrites=true&w=majority&appName=MyApp')
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
