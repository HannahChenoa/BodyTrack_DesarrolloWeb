const User = require('../../models/User');

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ name: user.name, email: user.email, genero: user.genero });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, genero } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, genero },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Perfil actualizado', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

