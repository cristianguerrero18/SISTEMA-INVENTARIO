document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  try {
    const response = await fetch("http://localhost:7000/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, clave }),
      
    });
    const data = await response.json();
    if (data.success) {

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("rol", data.rol_id);
      sessionStorage.setItem("id_usuario", data.id_usuario); 

      if (Number(data.rol_id) === 1) {
        location.href = "admin.html";
      }
    } else {
      alert(data.mensaje);
    }
  } catch (error) {
    alert("error en el api" + error);
  }
});
