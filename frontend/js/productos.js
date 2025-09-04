document.addEventListener("DOMContentLoaded", () => {
  const lista = document.querySelector("#table-produ tbody");
  const token = sessionStorage.getItem("token");

  const selectorCategoria = document.getElementById("categoria");
  const selectorProveedor = document.getElementById("proveedor");
  const guardar = document.getElementById("btn-guardar");
  const searchInput = document.getElementById("searchProd");

  const editModal = document.getElementById("editUserModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const btnActualizar = document.getElementById("btn-actualizar");
  const editCategoria = document.getElementById("edit-categoria");
  const editProveedor = document.getElementById("edit-proveedor");

  let proData = [];

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
    data.forEach((p) => {
      lista.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${p.id_producto}</td>
          <td>${p.nombre}</td>
          <td>${p.descripcion}</td>
          <td>${p.stock}</td>
          <td>${p.unidad_medida}</td>
          <td>$${p.precio_unitario}</td>
          <td>${p.categoria_nombre}</td>
          <td>${p.proveedor_nombre}</td>
           <td>
          <button class="btn-editar" data-id="${p.id_producto}" style="padding: 8px 12px; background: #ff6200; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 8px; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.3s ease, transform 0.2s ease;">Editar</button>
          <button class="btn-eliminar" data-id="${p.id_producto}" style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; transition: background 0.3s ease, transform 0.2s ease;">Eliminar</button>
        </td>
        </tr>`
      );
    });
  }

  // ==========================
  // 🔹 Cargar productos
  // ==========================
  async function loadProductos() {
    try {
      proData = await apiRequest("http://localhost:7000/api/productos/");
      renderTable(proData);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      lista.innerHTML = `<tr><td colspan="8">Error al cargar productos</td></tr>`;
    }
  }

  // ==========================
  // 🔹 Cargar categorías y proveedores
  // ==========================
  async function loadOptions(url, select) {
    try {
      const data = await apiRequest(url);
      select.innerHTML = `<option value="">Seleccione</option>`;
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id_categoria || item.id_proveedor;
        option.textContent = `${option.value} - ${item.nombre}`;
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
        title: "¿Está seguro?",
        text: "No podrá revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await apiRequest(`http://localhost:7000/api/productos/${id}`, "DELETE");
            proData = proData.filter((p) => p.id_producto != id);
            renderTable(proData);
            Swal.fire("Eliminado", "El producto fue eliminado correctamente", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo eliminar el producto", "error");
          }
        }
      });
    }

    // Editar
    if (e.target.classList.contains("btn-editar")) {
      try {
        await loadOptions("http://localhost:7000/api/categorias/nombre/categoria", editCategoria);
        await loadOptions("http://localhost:7000/api/proveedores/nombre/proveedor", editProveedor);

        const producto = await apiRequest(`http://localhost:7000/api/productos/${id}`);
        document.getElementById("edit-id").value = producto.id_producto;
        document.getElementById("edit-nombre").value = producto.nombre;
        document.getElementById("edit-desc").value = producto.descripcion;
        document.getElementById("edit-stock").value = producto.stock;
        document.getElementById("edit-und_medida").value = producto.unidad_medida;
        document.getElementById("edit-precio").value = producto.precio_unitario;
        editCategoria.value = producto.id_categoria;
        editProveedor.value = producto.id_proveedor;

        editModal.style.display = "flex";
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo cargar el producto", "error");
      }
    }
  });

  // ==========================
  // 🔹 Guardar nuevo producto
  // ==========================
  guardar.addEventListener("click", async (e) => {
    e.preventDefault();
    const nuevo = {
      nombre: document.getElementById("nombre").value.trim(),
      descripcion: document.getElementById("descripcion").value.trim(),
      stock: document.getElementById("stock").value.trim() || "0.00",
      unidad_medida: document.getElementById("und_medida").value.trim(),
      precio_unitario: document.getElementById("precio").value.trim(),
      id_categoria: parseInt(selectorCategoria.value),
      id_proveedor: parseInt(selectorProveedor.value),
    };

    try {
      const creado = await apiRequest("http://localhost:7000/api/productos/", "POST", nuevo);
      proData.push(creado);
      renderTable(proData);
      Swal.fire("Éxito", "Producto creado exitosamente", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear el producto", "error");
    }
  });

  // ==========================
  // 🔹 Actualizar producto (PUT)
  // ==========================
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const actualizado = {
      nombre: document.getElementById("edit-nombre").value.trim(),
      descripcion: document.getElementById("edit-desc").value.trim(),
      stock: document.getElementById("edit-stock").value.trim() || "0.00",
      unidad_medida: document.getElementById("edit-und_medida").value.trim(),
      precio_unitario: document.getElementById("edit-precio").value.trim(),
      id_categoria: parseInt(editCategoria.value),
      id_proveedor: parseInt(editProveedor.value),
    };

    try {
      await apiRequest(`http://localhost:7000/api/productos/${id}`, "PUT", actualizado);
      const index = proData.findIndex((p) => p.id_producto == id);
      if (index !== -1) proData[index] = { ...proData[index], ...actualizado };
      renderTable(proData);
      editModal.style.display = "none";
      Swal.fire("Éxito", "Producto actualizado correctamente", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
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
    const filtered = proData.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search) ||
        String(p.id_producto).includes(search) ||
        p.categoria_nombre.toLowerCase().includes(search) ||
        p.proveedor_nombre.toLowerCase().includes(search)
    );
    renderTable(filtered);
  });

  // ==========================
  // 🚀 Inicializar
  // ==========================
  loadProductos();
  loadOptions("http://localhost:7000/api/categorias/nombre/categoria", selectorCategoria);
  loadOptions("http://localhost:7000/api/proveedores/nombre/proveedor", selectorProveedor);
});
