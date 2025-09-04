document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#table-prove tbody");
  const guardar = document.getElementById("btn-guardar");
  const searchInput = document.getElementById("searchUser");
  const token = sessionStorage.getItem("token");

  const editModal = document.getElementById("editUserModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const btnActualizar = document.getElementById("btn-actualizar");

  let proveData = []; // almacenamiento en memoria

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
    data.forEach((pro) => {
      const row = `
        <tr>
          <td>${pro.id_proveedor}</td>
          <td>${pro.nombre}</td>
          <td>${pro.telefono}</td>
          <td>${pro.email}</td>
          <td>${pro.direccion}</td>
          <td>
            <button class="btn-editar" data-id="${pro.id_proveedor}" 
              style="padding: 8px 12px; background: #ff6200; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.3s ease, transform 0.2s ease;">Editar</button>
            <button class="btn-eliminar" data-id="${pro.id_proveedor}" 
              style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.3s ease, transform 0.2s ease;">Eliminar</button>
          </td>
        </tr>
      `;
      table.insertAdjacentHTML("beforeend", row);
    });
  }

  // ==========================
  // 🔹 Cargar Proveedores
  // ==========================
  async function loadProveedores() {
    try {
      proveData = await apiRequest("http://localhost:7000/api/proveedores/");
      renderTable(proveData);
    } catch (err) {
      Swal.fire("Error", "Error al cargar proveedores.", "error");
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
        const pro = await apiRequest(`http://localhost:7000/api/proveedores/${id}`);
        document.getElementById("edit-id").value = pro.id_proveedor;
        document.getElementById("edit-nombre").value = pro.nombre;
        document.getElementById("edit-tel").value = pro.telefono;
        document.getElementById("edit-email").value = pro.email;
        document.getElementById("edit-direc").value = pro.direccion;
        editModal.style.display = "flex";
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo cargar el proveedor.", "error");
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
            await apiRequest(`http://localhost:7000/api/proveedores/${id}`, "DELETE");
            proveData = proveData.filter((pro) => pro.id_proveedor != id);
            renderTable(proveData);

            Swal.fire("Eliminado", "El proveedor ha sido eliminado.", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo eliminar el proveedor.", "error");
          }
        }
      });
    }
  });

  // ==========================
  // 🔹 Guardar nuevo proveedor
  // ==========================
  guardar.addEventListener("click", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (!nombre || !telefono || !email || !direccion) {
      Swal.fire("Atención", "Complete todos los campos.", "warning");
      return;
    }

    try {
      await apiRequest("http://localhost:7000/api/proveedores/", "POST", { nombre, telefono, email, direccion });
      Swal.fire({
        icon: "success",
        title: "Proveedor creado",
        text: "Proveedor creado exitosamente.",
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        location.reload();
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear el proveedor.", "error");
    }
  });

  // ==========================
  // 🔹 Guardar cambios (PUT)
  // ==========================
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const nombre = document.getElementById("edit-nombre").value.trim();
    const telefono = document.getElementById("edit-tel").value.trim();
    const email = document.getElementById("edit-email").value.trim();
    const direccion = document.getElementById("edit-direc").value.trim();

    try {
      await apiRequest(`http://localhost:7000/api/proveedores/${id}`, "PUT", { nombre, telefono, email, direccion });
      editModal.style.display = "none";

      // actualizar en memoria
      const index = proveData.findIndex((pro) => pro.id_proveedor == id);
      if (index !== -1) {
        proveData[index].nombre = nombre;
        proveData[index].telefono = telefono;
        proveData[index].email = email;
        proveData[index].direccion = direccion;
        renderTable(proveData);
      }

      Swal.fire("Éxito", "Proveedor editado correctamente.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo editar el proveedor.", "error");
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
    const filtered = proveData.filter(
      (pro) =>
        pro.nombre.toLowerCase().includes(search) ||
        pro.direccion.toLowerCase().includes(search) ||
        String(pro.id_proveedor).includes(search)
    );
    renderTable(filtered);
  });

  // ==========================
  // 🚀 Inicializar
  // ==========================
  loadProveedores();
});
