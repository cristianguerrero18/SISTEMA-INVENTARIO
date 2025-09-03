document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#table-cat tbody");
  const guardar = document.getElementById("btn-guardar");
  const searchInput = document.getElementById("searchUser");
  const token = sessionStorage.getItem("token");
  const notification = document.getElementById("notification");

  const editModal = document.getElementById("editUserModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const btnActualizar = document.getElementById("btn-actualizar");

  let catData = []; // almacenamiento en memoria

  // ==========================
  // 🔹 Función para mostrar notificaciones
  // ==========================
  function showNotification(message, type = "success") {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 3500);
  }

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
    data.forEach((c) => {
      const row = `
        <tr>
          <td>${c.id_categoria}</td>
          <td>${c.nombre}</td>
          <td>${c.descripcion}</td>
          <td>
          <button class="btn-editar" data-id="${c.id_categoria}" style="padding: 8px 12px; background: #ff6200; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.3s ease, transform 0.2s ease;">Editar</button>
          <button class="btn-eliminar" data-id="${c.id_categoria}" style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.3s ease, transform 0.2s ease;">Eliminar</button>
        </td>
        </tr>
      `;
      table.insertAdjacentHTML("beforeend", row);
    });
  }

  // ==========================
  // 🔹 Cargar Categorías
  // ==========================
  async function loadCategorias() {
    try {
      catData = await apiRequest("http://localhost:7000/api/categorias/");
      renderTable(catData);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      showNotification("Error al cargar categorías.", "error");
    }
  }

  // ==========================
  // 🔹 Delegación de eventos tabla
  // ==========================
  table.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // Editar
    if (e.target.classList.contains("btn-editar")) {
      try {
        const cat = await apiRequest(`http://localhost:7000/api/categorias/${id}`);
        document.getElementById("edit-id").value = cat.id_categoria;
        document.getElementById("edit-nombre").value = cat.nombre;
        document.getElementById("edit-desc").value = cat.descripcion;
        editModal.style.display = "flex";
      } catch (err) {
        console.error(err);
        showNotification("No se pudo cargar la categoría.", "error");
      }
    }

    // Eliminar
    if (e.target.classList.contains("btn-eliminar")) {
      if (confirm("¿Seguro que desea eliminar?")) {
        try {
          await apiRequest(`http://localhost:7000/api/categorias/${id}`, "DELETE");
          showNotification("Categoría eliminada correctamente.", "success");
          catData = catData.filter((c) => c.id_categoria != id);
          renderTable(catData);
        } catch (err) {
          console.error(err);
          showNotification("Error al eliminar la categoría.", "error");
        }
      }
    }
  });

  // ==========================
  // 🔹 Guardar nueva categoría
  // ==========================
  guardar.addEventListener("click", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!nombre || !descripcion) {
      showNotification("Complete todos los campos.", "warning");
      return;
    }

    try {
      const nueva = await apiRequest("http://localhost:7000/api/categorias/", "POST", { nombre, descripcion });
      showNotification("Categoría creada exitosamente.", "success");
      catData.push(nueva);
      renderTable(catData);
      location.reload();
    } catch (err) {
      console.error(err);
      showNotification("Error al crear categoría.", "error");
    }
  });

  // ==========================
  // 🔹 Guardar cambios (PUT)
  // ==========================
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const nombre = document.getElementById("edit-nombre").value.trim();
    const descripcion = document.getElementById("edit-desc").value.trim();

    try {
      await apiRequest(`http://localhost:7000/api/categorias/${id}`, "PUT", { nombre, descripcion });
      showNotification("Categoría editada correctamente.", "success");
      editModal.style.display = "none";

      // actualizar en memoria
      const index = catData.findIndex((c) => c.id_categoria == id);
      if (index !== -1) {
        catData[index].nombre = nombre;
        catData[index].descripcion = descripcion;
        renderTable(catData);
      }
    } catch (err) {
      console.error(err);
      showNotification("Error al editar categoría.", "error");
    }
  });

  // ==========================
  // 🔹 Modal cerrar
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
    const filtered = catData.filter(
      (c) =>
        c.nombre.toLowerCase().includes(search) ||
        c.descripcion.toLowerCase().includes(search) ||
        String(c.id_categoria).includes(search)
    );
    renderTable(filtered);
  });

  // ==========================
  // 🚀 Inicializar
  // ==========================
  loadCategorias();
});