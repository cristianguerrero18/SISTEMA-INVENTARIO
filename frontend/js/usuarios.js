document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#table-users tbody");
  const selectorRol = document.getElementById("roles"); // formulario crear
  const selectorRolEdit = document.getElementById("edit-roles"); // formulario editar
  const guardar = document.getElementById("btn-guardar");
  const searchInput = document.getElementById("searchUser");

  const editModal = document.getElementById("editUserModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const btnActualizar = document.getElementById("btn-actualizar");

  const token = sessionStorage.getItem("token");
  let usuariosData = [];

  // ==========================
  // 🔹 Función API Fetch genérica
  // ==========================
  async function apiRequest(url, method = "GET", body = null) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Error API: ${res.status}`);
    return res.status === 204 ? null : await res.json();
  }

  // ==========================
  // 🔹 Renderizar tabla
  // ==========================
  function renderTable(data) {
    table.innerHTML = "";
    data.forEach((u) => {
      table.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${u.id_usuario}</td>
          <td>${u.nombre}</td>
          <td>${u.rol_id}</td>
          <td>${u.usuario}</td>
          <td>${u.clave}</td>
          <td>
            <button class="btn-editar" data-id="${u.id_usuario}" style="padding:8px 12px; background:#ff6200; color:white; border:none; border-radius:6px; cursor:pointer; margin-right:8px; font-family:'Inter',sans-serif; font-weight:600;">Editar</button>
            <button class="btn-eliminar" data-id="${u.id_usuario}" style="padding:8px 12px; background:#dc3545; color:white; border:none; border-radius:6px; cursor:pointer; font-family:'Inter',sans-serif; font-weight:600;">Eliminar</button>
          </td>
        </tr>`
      );
    });
  }

  // ==========================
  // 🔹 Cargar usuarios
  // ==========================
  async function loadUsuarios() {
    try {
      usuariosData = await apiRequest("http://localhost:7000/api/usuarios/");
      renderTable(usuariosData);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      table.innerHTML = `<tr><td colspan="6">Error al cargar usuarios</td></tr>`;
    }
  }

  // ==========================
  // 🔹 Cargar roles en selects
  // ==========================
  async function loadRoles() {
    try {
      const roles = await apiRequest("http://localhost:7000/api/roles/");

      // limpiar y cargar roles en formulario CREAR
      selectorRol.innerHTML = `<option value="">Seleccione</option>`;
      roles.forEach((rol) => {
        selectorRol.insertAdjacentHTML(
          "beforeend",
          `<option value="${rol.id_rol}">${rol.id_rol} - ${rol.nombre}</option>`
        );
      });

      // limpiar y cargar roles en formulario EDITAR
      selectorRolEdit.innerHTML = `<option value="">Seleccione</option>`;
      roles.forEach((rol) => {
        selectorRolEdit.insertAdjacentHTML(
          "beforeend",
          `<option value="${rol.id_rol}">${rol.id_rol} - ${rol.nombre}</option>`
        );
      });
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  }

  // ==========================
  // 🔹 Delegación de eventos tabla
  // ==========================
  table.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // Eliminar usuario
    if (e.target.classList.contains("btn-eliminar")) {
      if (confirm("¿Seguro que desea eliminar?")) {
        try {
          await apiRequest(`http://localhost:7000/api/usuarios/${id}`, "DELETE");
          usuariosData = usuariosData.filter((u) => u.id_usuario != id);
          renderTable(usuariosData);
          alert("Usuario eliminado correctamente");
        } catch (err) {
          console.error(err);
          alert("Error al eliminar usuario");
        }
      }
    }

    // Editar usuario
    if (e.target.classList.contains("btn-editar")) {
      try {
        const usuario = await apiRequest(`http://localhost:7000/api/usuarios/${id}`);
        document.getElementById("edit-id").value = usuario.id_usuario;
        document.getElementById("edit-nombre").value = usuario.nombre;
        document.getElementById("edit-roles").value = usuario.rol_id; // 👈 ahora sí selecciona
        document.getElementById("edit-usuario").value = usuario.usuario;
        document.getElementById("edit-password").value = usuario.clave;
        editModal.style.display = "flex";
      } catch (err) {
        console.error(err);
        alert("Error al cargar usuario.");
      }
    }
  });

  // ==========================
  // 🔹 Guardar nuevo usuario (POST)
  // ==========================
  guardar.addEventListener("click", async (e) => {
    e.preventDefault();
    const nuevo = {
      nombre: document.getElementById("nombre").value,
      rol_id: document.getElementById("roles").value,
      usuario: document.getElementById("usuario").value,
      clave: document.getElementById("password").value,
    };

    try {
      const creado = await apiRequest("http://localhost:7000/api/usuarios/", "POST", nuevo);
      usuariosData.push(creado);
      renderTable(usuariosData);
      alert("Usuario creado exitosamente");
      location.reload(); // 👈 opcional, si tu backend no devuelve el objeto completo
    } catch (err) {
      console.error(err);
      alert("Error al crear usuario.");
    }
  });

  // ==========================
  // 🔹 Actualizar usuario (PUT)
  // ==========================
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const actualizado = {
      nombre: document.getElementById("edit-nombre").value,
      rol_id: document.getElementById("edit-roles").value,
      usuario: document.getElementById("edit-usuario").value,
      clave: document.getElementById("edit-password").value,
    };

    try {
      await apiRequest(`http://localhost:7000/api/usuarios/${id}`, "PUT", actualizado);
      const index = usuariosData.findIndex((u) => u.id_usuario == id);
      if (index !== -1) usuariosData[index] = { ...usuariosData[index], ...actualizado };
      renderTable(usuariosData);
      editModal.style.display = "none";
      alert("Usuario editado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al editar usuario.");
    }
  });

  // ==========================
  // 🔹 Cerrar modal
  // ==========================
  closeEditModal.addEventListener("click", () => (editModal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === editModal) editModal.style.display = "none";
  });

  // ==========================
  // 🔹 Filtro en tiempo real
  // ==========================
  searchInput.addEventListener("keyup", () => {
    const search = searchInput.value.toLowerCase();
    const filtered = usuariosData.filter(
      (u) =>
        u.nombre.toLowerCase().includes(search) ||
        u.usuario.toLowerCase().includes(search) ||
        String(u.id_usuario).includes(search)
    );
    renderTable(filtered);
  });

  // ==========================
  // 🚀 Inicializar
  // ==========================
  loadUsuarios();
  loadRoles();
});
