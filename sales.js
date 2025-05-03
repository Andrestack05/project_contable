// ✅ Script corregido con reporte semanal en tabla y total del día bien calculado (sin PDF)

document.addEventListener("DOMContentLoaded", () => {
  const cantidadInput = document.getElementById("cantidad");
  const precioInput = document.getElementById("precio");
  const totalInput = document.getElementById("total");
  const formulario = document.getElementById("form-sale");
  const mensajeDiv = document.getElementById("message-sale");
  const ventasTable = document.getElementById("sales-table").getElementsByTagName("tbody")[0];
  const filterDateInput = document.getElementById("filter-date");
  const filterBtn = document.getElementById("filter-btn");

  function calcularTotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const precio = parseFloat(precioInput.value) || 0;
    const total = cantidad * precio;
    totalInput.value = total.toFixed(2);
  }

  cantidadInput.addEventListener("input", calcularTotal);
  precioInput.addEventListener("input", calcularTotal);

  function guardarVentaLocal(venta) {
    const ventasGuardadas = JSON.parse(localStorage.getItem("sales")) || [];
    ventasGuardadas.push(venta);
    localStorage.setItem("sales", JSON.stringify(ventasGuardadas));
  }

  function mostrarVentas() {
    const ventasGuardadas = JSON.parse(localStorage.getItem("sales")) || [];
    ventasTable.innerHTML = "";

    ventasGuardadas.forEach((venta) => {
      const row = ventasTable.insertRow();
      row.insertCell(0).textContent = venta.fecha;
      row.insertCell(1).textContent = venta.producto;
      row.insertCell(2).textContent = venta.cantidad;
      row.insertCell(3).textContent = `$${venta.precio.toFixed(0)}`;
      row.insertCell(4).textContent = `$${venta.total.toFixed(0)}`;

      const cellAcciones = row.insertCell(5);
      const eliminarBtn = document.createElement("button");
      eliminarBtn.classList.add("history__delete-btn");
      eliminarBtn.innerHTML = `<img src="./images/papelera.svg" alt="Eliminar" width="20" height="20" />`;
      eliminarBtn.addEventListener("click", () => eliminarVenta(venta.id));
      cellAcciones.appendChild(eliminarBtn);
    });
  }

  function eliminarVenta(id) {
    const ventasGuardadas = JSON.parse(localStorage.getItem("sales")) || [];
    const nuevasVentas = ventasGuardadas.filter((venta) => venta.id !== id);
    localStorage.setItem("sales", JSON.stringify(nuevasVentas));
    mostrarVentas();
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const venta = {
      id: Date.now(),
      fecha: document.getElementById("fecha").value,
      producto: document.getElementById("producto").value,
      cantidad: parseInt(cantidadInput.value),
      precio: parseFloat(precioInput.value),
      total: parseFloat(totalInput.value),
    };
    guardarVentaLocal(venta);
    mensajeDiv.textContent = "✅ Venta registrada correctamente.";
    mensajeDiv.classList.add("sales__message--exito");
    setTimeout(() => {
      mensajeDiv.textContent = "";
      mensajeDiv.classList.remove("sales__message--exito");
    }, 4000);
    mostrarVentas();
    formulario.reset();
  });

  filterBtn.addEventListener("click", () => {
    const fechaFiltro = filterDateInput.value;
    const ventasGuardadas = JSON.parse(localStorage.getItem("sales")) || [];
    const ventasFiltradas = ventasGuardadas.filter((venta) => venta.fecha === fechaFiltro);
    ventasTable.innerHTML = "";
    ventasFiltradas.forEach((venta) => {
      const row = ventasTable.insertRow();
      row.insertCell(0).textContent = venta.fecha;
      row.insertCell(1).textContent = venta.producto;
      row.insertCell(2).textContent = venta.cantidad;
      row.insertCell(3).textContent = `$${venta.precio.toFixed(0)}`;
      row.insertCell(4).textContent = `$${venta.total.toFixed(0)}`;

      const cellAcciones = row.insertCell(5);
      const eliminarBtn = document.createElement("button");
      eliminarBtn.classList.add("history__delete-btn");
      eliminarBtn.innerHTML = `<img src="./images/papelera.svg" alt="Eliminar" width="20" height="20" />`;
      eliminarBtn.addEventListener("click", () => eliminarVenta(venta.id));
      cellAcciones.appendChild(eliminarBtn);
    });
  });

  document.getElementById("report-day-btn").addEventListener("click", () => {
    const ventasGuardadas = JSON.parse(localStorage.getItem("sales")) || [];

    // ✅ Obtener fecha local correctamente sin usar UTC
    const hoy = new Date();
    const fechaLocal = hoy.toISOString().split("T")[0];
    const offset = hoy.getTimezoneOffset() * 60000;
    const fechaHoy = new Date(hoy.getTime() - offset).toISOString().split("T")[0];

    const ventasDia = ventasGuardadas.filter((venta) => venta.fecha === fechaHoy);
    if (ventasDia.length === 0) return alert("No hay ventas para el día de hoy.");

    const totalDia = ventasDia.reduce((sum, v) => sum + v.total, 0);
    // mostrarReporte(`<p style='font-weight:bold'>Ventas del Día (${fechaHoy}): $${totalDia.toFixed(0)}</p>`);
    const tablaBonita = `
  <table style="margin-top: 1rem; width: 300px; border-collapse: collapse; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; font-family: sans-serif;">
    <thead style="background-color: #cceeff;">
      <tr>
        <th colspan="2" style="padding: 10px; text-align: center; font-size: 16px;">Ventas del Día</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 10px; border-top: 1px solid #ccc;">Fecha</td>
        <td style="padding: 10px; border-top: 1px solid #ccc;">${fechaHoy}</td>
      </tr>
      <tr style="background-color: #f7faff;">
        <td style="padding: 10px; border-top: 1px solid #ccc;">Total</td>
        <td style="padding: 10px; border-top: 1px solid #ccc; font-weight: bold;">$${totalDia.toFixed(0)}</td>
      </tr>
    </tbody>
  </table>`;
mostrarReporte(tablaBonita);
  });

  document.getElementById("report-week-btn").addEventListener("click", () => {
    const ventas = JSON.parse(localStorage.getItem("sales")) || [];
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7)); // lunes

    const ventasSemana = ventas.filter((v) => new Date(v.fecha) >= lunes);
    if (ventasSemana.length === 0) return alert("No hay ventas esta semana.");

    const totalSemana = ventasSemana.reduce((sum, v) => sum + v.total, 0);
    let tablaHTML = generarTablaBonita(ventasSemana);
    tablaHTML += `<p style='font-weight:bold'>Total de la Semana: $${totalSemana.toFixed(0)}</p>`;
    mostrarReporte(tablaHTML);
  });

  document.getElementById("report-month-btn").addEventListener("click", () => {
    const ventas = JSON.parse(localStorage.getItem("sales")) || [];
    const mesActual = new Date().toISOString().slice(0, 7);
    const ventasMes = ventas.filter((v) => v.fecha.slice(0, 7) === mesActual);
    if (ventasMes.length === 0) return alert("No hay ventas este mes.");

    const totalMes = ventasMes.reduce((s, v) => s + v.total, 0);
    let tablaHTML = generarTablaBonita(ventasMes);
    tablaHTML += `<p style='font-weight:bold'>Total del Mes: $${totalMes.toFixed(0)}</p>`;
    mostrarReporte(tablaHTML);
  });

  function generarTablaBonita(ventas) {
    let html = `<table style='border-collapse: collapse; width: 100%; margin-top: 1rem;'>
      <thead style='background: #f0f8ff;'>
        <tr>
          <th style='padding: 8px; border: 1px solid #ccc;'>Fecha</th>
          <th style='padding: 8px; border: 1px solid #ccc;'>Producto</th>
          <th style='padding: 8px; border: 1px solid #ccc;'>Cantidad</th>
          <th style='padding: 8px; border: 1px solid #ccc;'>Precio</th>
          <th style='padding: 8px; border: 1px solid #ccc;'>Total</th>
        </tr>
      </thead>
      <tbody>`;
    ventas.forEach((v) => {
      html += `<tr>
        <td style='padding: 8px; border: 1px solid #ccc;'>${v.fecha}</td>
        <td style='padding: 8px; border: 1px solid #ccc;'>${v.producto}</td>
        <td style='padding: 8px; border: 1px solid #ccc;'>${v.cantidad}</td>
        <td style='padding: 8px; border: 1px solid #ccc;'>$${v.precio.toFixed(0)}</td>
        <td style='padding: 8px; border: 1px solid #ccc;'>$${v.total.toFixed(0)}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    return html;
  }

  function mostrarReporte(html) {
    const reportContainer = document.getElementById("report-container");
    const div = document.createElement("div");
    div.innerHTML = html;
    div.style.margin = "2rem"; // Controlar el espacio con margen
    reportContainer.appendChild(div);
}

  mostrarVentas();
});


