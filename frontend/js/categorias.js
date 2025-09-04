document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#table-cat tbody");
  const guardar = document.getElementById("btn-guardar");
  const searchInput = document.getElementById("searchUser");
  const token = sessionStorage.getItem("token");

  const editModal = document.getElementById("editUserModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const btnActualizar = document.getElementById("btn-actualizar");

  let catData = []; // almacenamiento en memoria

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
            <button class="btn-editar" data-id="${c.id_categoria}" 
              style="padding: 8px 12px; background: #ff6200; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.3s ease, transform 0.2s ease;">Editar</button>
            <button class="btn-eliminar" data-id="${c.id_categoria}" 
              style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.3s ease, transform 0.2s ease;">Eliminar</button>
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
      Swal.fire("Error", "Error al cargar categorías.", "error");
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
        Swal.fire("Error", "No se pudo cargar la categoría.", "error");
      }
    }

    // Eliminar con Swal
    if (e.target.classList.contains("btn-eliminar")) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás deshacer esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await apiRequest(`http://localhost:7000/api/categorias/${id}`, "DELETE");
            catData = catData.filter((c) => c.id_categoria != id);
            renderTable(catData);

            Swal.fire("Eliminada", "La categoría ha sido eliminada.", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo eliminar la categoría.", "error");
          }
        }
      });
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
      Swal.fire("Atención", "Complete todos los campos.", "warning");
      return;
    }

    try {
      const nueva = await apiRequest("http://localhost:7000/api/categorias/", "POST", { nombre, descripcion });
      catData.push(nueva);
      renderTable(catData);

      Swal.fire({
        icon: "success",
        title: "Categoría creada",
        text: "Categoría creada exitosamente.",
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        location.reload();
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear la categoría.", "error");
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
      editModal.style.display = "none";

      // actualizar en memoria
      const index = catData.findIndex((c) => c.id_categoria == id);
      if (index !== -1) {
        catData[index].nombre = nombre;
        catData[index].descripcion = descripcion;
        renderTable(catData);
      }

      Swal.fire("Éxito", "Categoría editada correctamente.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo editar la categoría.", "error");
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
