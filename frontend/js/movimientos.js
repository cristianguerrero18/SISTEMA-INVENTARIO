document.addEventListener("DOMContentLoaded", () => {
  const lista = document.querySelector("#table-mov tbody");
  const token = sessionStorage.getItem("token");
  const idUsuario = sessionStorage.getItem("id_usuario"); // 🔹 Recuperar usuario logueado

  if (!idUsuario) {
    Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "⚠️ No se encontró el usuario en la sesión. Vuelve a iniciar sesión.",
      confirmButtonText: "Aceptar",
    }).then(() => {
      location.href = "index.html";
    });
    return;
  }

  const selectorProducto = document.getElementById("producto");
  const guardar = document.getElementById("btn-guardar");
  const searchInput = document.getElementById("searchUser");

  const editModal = document.getElementById("editUserModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const btnActualizar = document.getElementById("btn-actualizar");
  const editProducto = document.getElementById("edit-producto");

  let movData = [];

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
    lista.innerHTML = "";
    data.forEach((m) => {
      lista.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${m.id_movimiento}</td>
          <td>${m.id_producto}</td>
          <td>${m.tipo}</td>
          <td>${m.cantidad}</td>
          <td>${m.fecha}</td>
          <td>${m.observacion}</td>
          <td>${m.id_usuario}</td>
          <td>
            <button class="btn-editar" data-id="${m.id_movimiento}" style="padding: 8px 12px; background: #ff6200; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px;">Editar</button>
            <button class="btn-eliminar" data-id="${m.id_movimiento}" style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">Eliminar</button>
          </td>
        </tr>`
      );
    });
  }

  // ==========================
  // 🔹 Cargar movimientos
  // ==========================
  async function loadMovimientos() {
    try {
      movData = await apiRequest("http://localhost:7000/api/movimientos/");
      renderTable(movData);
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
      lista.innerHTML = `<tr><td colspan="8">Error al cargar movimientos</td></tr>`;
    }
  }

  // ==========================
  // 🔹 Cargar productos
  // ==========================
  async function loadOptions(url, select) {
    try {
      const data = await apiRequest(url);
      select.innerHTML = `<option value="">Seleccione</option>`;
      data.forEach((item) => {
        const option = document.createElement("option");
        if (item.id_producto) {
          option.value = item.id_producto;
          option.textContent = `${item.id_producto} - ${item.nombre}`;
        }
        select.appendChild(option);
      });
    } catch (err) {
      console.error("Error al cargar opciones:", err);
    }
  }

  // ==========================
  // 🔹 Delegación de eventos tabla
  // ==========================
  lista.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // Eliminar
    if (e.target.classList.contains("btn-eliminar")) {
      Swal.fire({
        title: "¿Seguro que desea eliminar este movimiento?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await apiRequest(`http://localhost:7000/api/movimientos/${id}`, "DELETE");
            movData = movData.filter((m) => m.id_movimiento != id);
            renderTable(movData);
            Swal.fire("Eliminado", "Movimiento eliminado correctamente", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo eliminar el movimiento", "error");
          }
        }
      });
    }

    // Editar
    if (e.target.classList.contains("btn-editar")) {
      try {
        await loadOptions("http://localhost:7000/api/productos/producto/nombre", editProducto);

        const movimiento = await apiRequest(`http://localhost:7000/api/movimientos/${id}`);
        document.getElementById("edit-id").value = movimiento.id_movimiento;
        document.getElementById("edit-tipo").value = movimiento.tipo;
        document.getElementById("edit-cantidad").value = movimiento.cantidad;
        document.getElementById("edit-observacion").value = movimiento.observacion;
        editProducto.value = movimiento.id_producto;

        editModal.style.display = "flex";
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo cargar el movimiento", "error");
      }
    }
  });

  // ==========================
  // 🔹 Guardar nuevo movimiento
  // ==========================
  guardar.addEventListener("click", async (e) => {
    e.preventDefault();
    const hoy = new Date().toISOString().split("T")[0]; 
    const nuevo = {
      id_producto: parseInt(selectorProducto.value),
      tipo: document.getElementById("tipo").value.trim(),
      cantidad: document.getElementById("cantidad").value.trim() || "0.00",
      fecha: hoy,
      observacion: document.getElementById("observacion").value.trim(),
      id_usuario: parseInt(idUsuario),
    };

    try {
      const creado = await apiRequest("http://localhost:7000/api/movimientos/", "POST", nuevo);
      movData.push(creado);
      renderTable(movData);

      Swal.fire({
        icon: "success",
        title: "Movimiento creado",
        text: "El movimiento fue registrado exitosamente",
        timer: 2000,
        showConfirmButton: false,
        
      });
      location.reload();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear el movimiento", "error");
    }
  });

  // ==========================
  // 🔹 Actualizar movimiento (PUT)
  // ==========================
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const actualizado = {
      id_producto: parseInt(editProducto.value),
      tipo: document.getElementById("edit-tipo").value.trim(),
      cantidad: document.getElementById("edit-cantidad").value.trim() || "0.00",
      observacion: document.getElementById("edit-observacion").value.trim(),
      id_usuario: parseInt(idUsuario),
    };

    try {
      await apiRequest(`http://localhost:7000/api/movimientos/${id}`, "PUT", actualizado);
      const index = movData.findIndex((m) => m.id_movimiento == id);
      if (index !== -1) movData[index] = { ...movData[index], ...actualizado };
      renderTable(movData);
      editModal.style.display = "none";

      Swal.fire({
        icon: "success",
        title: "Movimiento actualizado",
        text: "El movimiento fue editado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar el movimiento", "error");
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
    const filtered = movData.filter(
      (m) =>
        m.observacion.toLowerCase().includes(search) ||
        String(m.id_movimiento).includes(search) ||
        String(m.id_producto).includes(search) ||
        String(m.id_usuario).includes(search) ||
        String(m.fecha).includes(search)
    );
    renderTable(filtered);
  });

  // ==========================
  // 🚀 Inicializar
  // ==========================
  loadMovimientos();
  loadOptions("http://localhost:7000/api/productos/producto/nombre", selectorProducto);
});
