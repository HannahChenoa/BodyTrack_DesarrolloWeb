document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    alert('No hay sesión activa');
    window.location.href = './login.html';
    return;
  }

  const inputName = document.getElementById('nameInput');
  const inputEmail = document.getElementById('emailInput');
  const genderInput = document.getElementById('genderInput');
  const editButton = document.getElementById('btnEditar');
  const saveButton = document.getElementById('editProfileBtn');
  const addBtn = document.getElementById('addMeasureBtn');
  const listaMedidas = document.getElementById('listaMedidas');

  // Cargar datos del usuario
  try {
    const res = await fetch(`http://localhost:3000/profile/${user.email}`);
    const data = await res.json();
    inputName.value = data.name;
    inputEmail.value = data.email;
    genderInput.value = data.genero || 'Hombre';
  } catch (err) {
    console.error('Error al cargar perfil:', err);
    alert('No se pudo cargar el perfil');
  }

  // Cargar medidas
  async function cargarMedidas() {
    listaMedidas.innerHTML = '';
    try {
      const res = await fetch(`http://localhost:3000/measures/${user.id}`);
      const data = await res.json();
      data.medidas.forEach((medida, index) => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
          <span>${medida.parte}: ${medida.valor}</span>
          <button class="btn btn-sm btn-danger" onclick="eliminarMedida(${index})">✖</button>
        `;
        listaMedidas.appendChild(item);
      });
    } catch (err) {
      console.error('Error al cargar medidas:', err);
    }
  }

  window.eliminarMedida = async (index) => {
    try {
      const res = await fetch(`http://localhost:3000/measures/${user.id}/delete/${index}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        cargarMedidas();
      } else {
        alert(data.message || 'No se pudo eliminar');
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  // Guardar perfil
  saveButton.addEventListener('click', async () => {
    const newName = inputName.value;
    const newEmail = inputEmail.value;
    const newGenero = genderInput.value;

    try {
      const res = await fetch(`http://localhost:3000/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName, email: newEmail, genero: newGenero })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Perfil actualizado correctamente');
        localStorage.setItem('user', JSON.stringify({ ...user, name: newName, email: newEmail, genero: newGenero }));
        window.location.reload();
      } else {
        alert(data.message || 'Error al actualizar');
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  });


  // Habilitar edición
  editButton.addEventListener('click', () => {
    inputName.removeAttribute('readonly');
    inputEmail.removeAttribute('readonly');
    genderInput.removeAttribute('disabled');
    saveButton.style.display = 'inline-block';
    editButton.style.display = 'none';
  });

  const deleteButton = document.getElementById('deleteUserBtn');

  deleteButton.addEventListener('click', async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;

    try {
      const res = await fetch(`http://localhost:3000/profile/${user.id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        alert('Cuenta eliminada correctamente');
        localStorage.clear(); // limpia sesión
        window.location.href = './login.html';
      } else {
        alert(data.message || 'Error al eliminar cuenta');
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('Error al conectar con el servidor');
    }
  });


  // Agregar medida corporal
  addBtn.addEventListener('click', async () => {
    const parte = document.getElementById('parteCuerpo').value.trim();
    const medida = document.getElementById('medida').value.trim();

    if (!parte || !medida) {
      alert('Completa ambos campos');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/measures/${user.id}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ parte, valor: `${medida} cm` })
      });

      const data = await res.json();
      if (res.ok) {
        document.getElementById('parteCuerpo').value = '';
        document.getElementById('medida').value = '';
        cargarMedidas();
      } else {
        alert(data.message || 'Error al guardar medida');
      }
    } catch (err) {
      console.error('Error al guardar medida:', err);
    }
  });

  // Inicial
  cargarMedidas();
});
