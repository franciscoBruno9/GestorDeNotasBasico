document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");
  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido");
  const materia = document.getElementById("materia");
  const nota = document.getElementById("nota");
  const listaEstudiantes = document.getElementById("listaEstudiantes");
  const filtrarNombre = document.getElementById("filtrarNombre");
  const filtrarMateria = document.getElementById("filtrarMateria");
  const buscar = document.getElementById("buscar");
  const limpiar = document.getElementById("limpiar");

  // Carga desde localStorage al iniciar la página
  cargarAlumnos();

  // Agregar un estudiante
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    const nom = nombre.value.trim();
    const ape = apellido.value.trim();
    const mat = materia.value;
    const notInput = nota.value.trim();

    // Convertir la nota a número
    const not = parseFloat(notInput.replace(",", "."));

    // Validar que la nota esté entre 0 y 10
    if (nom && ape && mat && !isNaN(not) && not >= 0 && not <= 10) {
      const fecha = new Date().toLocaleDateString(); // Obtener la fecha actual
      agregarAlumno(nom, ape, mat, not, fecha);
      nombre.value = "";
      apellido.value = "";
      materia.value = "";
      nota.value = "";
    } else {
      alert(
        "Por favor, ingrese una nota válida entre 0 y 10 (puede usar coma como separador decimal)."
      );
    }
  });

  function cargarAlumnos() {
    const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
    alumnos.forEach((alumno) => agregarAlumnoEnTabla(alumno));
  }

  function agregarAlumno(nom, ape, materia, not, fecha) {
    const alumno = {
      nom,
      ape,
      materia,
      not: not.toString().replace(".", ","),
      fecha, // Asegúrate de que la fecha se almacene correctamentee
    };
    const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
    alumnos.push(alumno);
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    agregarAlumnoEnTabla(alumno);
  }

  function agregarAlumnoEnTabla(alumno) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
              <td>${alumno.nom}</td>
              <td>${alumno.ape}</td>
              <td>${alumno.materia}</td>
              <td>${alumno.not}</td>
              <td>${alumno.fecha}</td> <!-- Mostrar la fecha -->
              <td><button class="delete">Eliminar</button></td>
          `;
    listaEstudiantes.appendChild(tr);

    tr.querySelector(".delete").addEventListener("click", function () {
      tr.remove();
      borrarAlumno(alumno);
    });
  }

  function borrarAlumno(alumnoABorrar) {
    let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
    alumnos = alumnos.filter(
      (alumno) =>
        alumno.nom !== alumnoABorrar.nom ||
        alumno.ape !== alumnoABorrar.ape ||
        alumno.materia !== alumnoABorrar.materia ||
        alumno.not !== alumnoABorrar.not ||
        alumno.fecha !== alumnoABorrar.fecha // Incluir fecha en la comparación
    );
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    recargarAlumnos();
  }

  buscar.addEventListener("click", () => {
    const nomFiltro = filtrarNombre.value.trim().toLowerCase();
    const materiaFiltro = filtrarMateria.value;
    filtrarAlumnos(nomFiltro, materiaFiltro);
  });

  limpiar.addEventListener("click", () => {
    filtrarNombre.value = "";
    filtrarMateria.value = "";
    cargarAlumnos();
  });

  function filtrarAlumnos(nomFiltro, materiaFiltro) {
    const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
    listaEstudiantes.innerHTML = ""; // Limpiar la tabla
    const alumnosFiltrados = alumnos.filter((alumno) => {
      const coincide =
        alumno.nom.toLowerCase().includes(nomFiltro) ||
        alumno.ape.toLowerCase().includes(nomFiltro);
      const coincideMateria =
        !materiaFiltro || alumno.materia === materiaFiltro;
      return coincide && coincideMateria;
    });
    alumnosFiltrados.forEach((alumno) => agregarAlumnoEnTabla(alumno));
  }

  function recargarAlumnos() {
    const nomFiltro = filtrarNombre.value.trim().toLowerCase();
    const materiaFiltro = filtrarMateria.value;
    filtrarAlumnos(nomFiltro, materiaFiltro);
  }
});
