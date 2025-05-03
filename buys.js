document.addEventListener("DOMContentLoaded", () => {
    const cantidadBuyInput = document.getElementById("cantidad-compra");
    const precioBuyInput = document.getElementById("precio-compra");
    const totalBuyInput = document.getElementById("total-compra");
    const formBuy = document.getElementById("form-buy");
    const messageBuy = document.getElementById("message-buy");
    const buysTable = document.getElementById("buys-table").getElementsByTagName("tbody")[0];
    const filterDateBuyInput = document.getElementById("filter-date-buy");
    const filterBuyBtn = document.getElementById("filter-btn-buy");
  
    function calcularTotalCompra() {
      const cantidad = parseFloat(cantidadBuyInput.value) || 0;
      const precio = parseFloat(precioBuyInput.value) || 0;
      const total = cantidad * precio;
      totalBuyInput.value = total.toFixed(2);
    }
  
    cantidadBuyInput.addEventListener("input", calcularTotalCompra);
    precioBuyInput.addEventListener("input", calcularTotalCompra);
  
    function guardarCompraLocal(compra) {
      const comprasGuardadas = JSON.parse(localStorage.getItem("buys")) || [];
      comprasGuardadas.push(compra);
      localStorage.setItem("buys", JSON.stringify(comprasGuardadas));
    }
  
    function mostrarCompras() {
      const comprasGuardadas = JSON.parse(localStorage.getItem("buys")) || [];
      buysTable.innerHTML = "";
  
      comprasGuardadas.forEach((compra) => {
        const row = buysTable.insertRow();
        row.insertCell(0).textContent = compra.fecha;
        row.insertCell(1).textContent = compra.producto;
        row.insertCell(2).textContent = compra.cantidad;
        row.insertCell(3).textContent = `$${compra.precio.toFixed(0)}`;
        row.insertCell(4).textContent = `$${compra.total.toFixed(0)}`;
  
        const cellAcciones = row.insertCell(5);
        const eliminarBtn = document.createElement("button");
        eliminarBtn.classList.add("buys__delete-btn");
        eliminarBtn.innerHTML = `<img src="./images/papelera.svg" alt="Eliminar" width="20" height="20" />`;
        eliminarBtn.addEventListener("click", () => eliminarCompra(compra.id));
        cellAcciones.appendChild(eliminarBtn);
      });
    }
  
    function eliminarCompra(id) {
      const comprasGuardadas = JSON.parse(localStorage.getItem("buys")) || [];
      const nuevasCompras = comprasGuardadas.filter((compra) => compra.id !== id);
      localStorage.setItem("buys", JSON.stringify(nuevasCompras));
      mostrarCompras();
    }
  
    formBuy.addEventListener("submit", (e) => {
      e.preventDefault();
      const compra = {
        id: Date.now(),
        fecha: document.getElementById("fecha-compra").value,
        producto: document.getElementById("producto-compra").value,
        cantidad: parseInt(cantidadBuyInput.value),
        precio: parseFloat(precioBuyInput.value),
        total: parseFloat(totalBuyInput.value),
      };
      guardarCompraLocal(compra);
      messageBuy.textContent = "✅ Compra registrada correctamente.";
      messageBuy.classList.add("buys__message--exito");
      setTimeout(() => {
        messageBuy.textContent = "";
        messageBuy.classList.remove("buys__message--exito");
      }, 4000);
      mostrarCompras();
      formBuy.reset();
    });
  
    filterBuyBtn.addEventListener("click", () => {
      const fechaFiltro = filterDateBuyInput.value;
      const comprasGuardadas = JSON.parse(localStorage.getItem("buys")) || [];
      const comprasFiltradas = comprasGuardadas.filter((compra) => compra.fecha === fechaFiltro);
      buysTable.innerHTML = "";
      comprasFiltradas.forEach((compra) => {
        const row = buysTable.insertRow();
        row.insertCell(0).textContent = compra.fecha;
        row.insertCell(1).textContent = compra.producto;
        row.insertCell(2).textContent = compra.cantidad;
        row.insertCell(3).textContent = `$${compra.precio.toFixed(0)}`;
        row.insertCell(4).textContent = `$${compra.total.toFixed(0)}`;
  
        const cellAcciones = row.insertCell(5);
        const eliminarBtn = document.createElement("button");
        eliminarBtn.classList.add("buys__delete-btn");
        eliminarBtn.innerHTML = `<img src="./images/papelera.svg" alt="Eliminar" width="20" height="20" />`;
        eliminarBtn.addEventListener("click", () => eliminarCompra(compra.id));
        cellAcciones.appendChild(eliminarBtn);
      });
    });
  
    document.getElementById("report-day-btn-buy").addEventListener("click", () => {
      const compras = JSON.parse(localStorage.getItem("buys")) || [];
      const hoy = new Date();
      const fechaHoy = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
  
      const comprasDia = compras.filter((compra) => compra.fecha === fechaHoy);
      if (comprasDia.length === 0) return alert("No hay compras para el día de hoy.");
  
      const totalDia = comprasDia.reduce((sum, c) => sum + c.total, 0);
  
      // Generamos la tabla bonita para el reporte del día
      let tablaHTML = `
        <section style="max-width: 900px; margin: 2rem auto; padding: 1rem; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #2c3e50;">🧾 Reporte de Compras del Día (${fechaHoy})</h2>
          <p style="font-size: 1.2rem; color: #2c3e50; text-align: center;">Total: $${totalDia.toFixed(0)}</p>
          <table style="border-collapse: collapse; width: 100%; margin-top: 1rem;">
            <thead style="background: #f0f8ff;">
              <tr>
                <th style="padding: 8px; border: 1px solid #ccc;">Fecha</th>
                <th style="padding: 8px; border: 1px solid #ccc;">Producto</th>
                <th style="padding: 8px; border: 1px solid #ccc;">Cantidad</th>
                <th style="padding: 8px; border: 1px solid #ccc;">Precio</th>
                <th style="padding: 8px; border: 1px solid #ccc;">Total</th>
              </tr>
            </thead>
            <tbody>`;
  
      comprasDia.forEach((c) => {
        tablaHTML += `
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">${c.fecha}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${c.producto}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${c.cantidad}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">$${c.precio.toFixed(0)}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">$${c.total.toFixed(0)}</td>
          </tr>`;
      });
  
      tablaHTML += `</tbody></table></section>`;
  
      // Insertamos el reporte bonito en el DOM
      mostrarReporteCompras(tablaHTML);
    });
  
    document.getElementById("report-week-btn-buy").addEventListener("click", () => {
      const compras = JSON.parse(localStorage.getItem("buys")) || [];
      const hoy = new Date();
      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
      
      const comprasSemana = compras.filter((c) => new Date(c.fecha) >= lunes);
      if (comprasSemana.length === 0) return alert("No hay compras esta semana.");
  
      let tablaHTML = generarTablaBonitaCompras(comprasSemana);
      mostrarReporteCompras(tablaHTML);
    });
  
    document.getElementById("report-month-btn-buy").addEventListener("click", () => {
      const compras = JSON.parse(localStorage.getItem("buys")) || [];
      const mesActual = new Date().toISOString().slice(0, 7);
      const comprasMes = compras.filter((c) => c.fecha.slice(0, 7) === mesActual);
      if (comprasMes.length === 0) return alert("No hay compras este mes.");
  
      let tablaHTML = generarTablaBonitaCompras(comprasMes);
      const totalMes = comprasMes.reduce((s, c) => s + c.total, 0);
      tablaHTML += `<p style='font-weight:bold'>Total del Mes: $${totalMes.toFixed(0)}</p>`;
      
      mostrarReporteCompras(tablaHTML);
    });
  
    function generarTablaBonitaCompras(compras) {
      let html = `<table style='border-collapse: collapse; width: 100%; margin-top: 1rem;'>
        <thead style='background: #f0f8ff;'>
          <tr>
            <th style='padding: 8px; border: 1px solid #ccc;'>Fecha</th>
            <th style='padding: 8px; border: 1px solid #ccc;'>Producto</th>
            <th style='padding: 8px; border: 1px solid #ccc;'>Cantidad</th>
            <th style='padding: 8px; border: 1px solid #ccc;'>Precio</th>
            <th style='padding: 8px; border: 1px solid #ccc;'>Total</th>
          </tr>
        </thead><tbody>`;
  
      compras.forEach((c) => {
        html += `
          <tr>
            <td style='padding: 8px; border: 1px solid #ccc;'>${c.fecha}</td>
            <td style='padding: 8px; border: 1px solid #ccc;'>${c.producto}</td>
            <td style='padding: 8px; border: 1px solid #ccc;'>${c.cantidad}</td>
            <td style='padding: 8px; border: 1px solid #ccc;'>$${c.precio.toFixed(0)}</td>
            <td style='padding: 8px; border: 1px solid #ccc;'>$${c.total.toFixed(0)}</td>
          </tr>`;
      });
  
      html += `</tbody></table>`;
      return html;
    }

    function mostrarReporteCompras(html) {
        // Obtén el contenedor de reportes
        const reportsContainer = document.getElementById("reports-buys");
      
        if (reportsContainer) {
          // Crea un nuevo contenedor para el reporte
          const div = document.createElement("div");
          div.innerHTML = html;
          div.style.margin = "2rem";
      
          // Agrega el reporte al contenedor de reportes
          reportsContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar el nuevo reporte
          reportsContainer.appendChild(div);
        }
      }
  
    // function mostrarReporteCompras(html) {
    //   const div = document.createElement("div");
    //   div.innerHTML = html;
    //   div.style.margin = "2rem";
    //   document.body.appendChild(div);
    // }
  
    mostrarCompras();
  });
  
  
  