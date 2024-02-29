// Create the Google Map…
var map = new google.maps.Map(d3.select("#map-container").node(), {
  zoom: 13,
  clickableIcons: false,
  center: new google.maps.LatLng(40.71576713378537, -73.9948450947766),
});

// Load the station data. When the data comes back, create an overlay.
d3.json("/get-stations", function (error, data) {
  console.log(data);
  if (error) throw error;
  var overlay = new google.maps.OverlayView();

  // Add the container when the overlay is added to the map.
  overlay.onAdd = function () {
    let layer = d3
      .select(this.getPanes().overlayMouseTarget)
      .append("div")
      .attr("class", "stations");

    // MIN y MAX
    colors_circles = ["#FFD324", "#E89C23", "#FF7600", "#FF422F", "#FF0000"];
    let label_legend = "";
    let min_value, max_value;
    if (
      data[79].hasOwnProperty("Nro. salidas") == true &&
      data[79].hasOwnProperty("Nro. llegadas") == true
    ) {
      // CASO 1
      let lista = d3.values(data).map(function (d) {
        return (Object.values(d)[3] + Object.values(d)[4]) / 2;
      });
      label_legend = "Todos los viajes";
      min_value = d3.min(lista);
      max_value = d3.max(lista);
    } else if (
      data[79].hasOwnProperty("Nro. salidas") == true &&
      data[79].hasOwnProperty("Nro. llegadas") == false
    ) {
      // CASO 2
      let lista = d3.values(data).map(function (d) {
        return Object.values(d)[3];
      });
      label_legend = "Sólo viajes de salida";
      min_value = d3.min(lista);
      max_value = d3.max(lista);
    } else if (
      data[79].hasOwnProperty("Nro. salidas") == false &&
      data[79].hasOwnProperty("Nro. llegadas") == true
    ) {
      // CASO 3
      let lista = d3.values(data).map(function (d) {
        return Object.values(d)[3];
      });
      label_legend = "Sólo viajes de llegada";
      min_value = d3.min(lista);
      max_value = d3.max(lista);
    }

    // LEYENDA
    const legendState = {};
    let sumador = (max_value - min_value) / 5;
    let minimo, maximo;
    let leyenda = d3.select("#legend");
    leyenda
      .append("p")
      .text(label_legend)
      .style("margin-left", 0)
      .style("margin-top", 0)
      .style("margin-bottom", "4px")
      .style("font-weight", "bold")
      .style("font-size", "12px");
    for (let i = 0; i < colors_circles.length; i++) {
      const color = colors_circles[i];
      let containerLegend = leyenda.append("div").style("display", "flex");
      containerLegend
        .append("svg")
        .attr("width", 31)
        .attr("height", 14)
        .append("rect")
        .attr("width", 30)
        .attr("height", 10)
        .style("fill", colors_circles[i]);
      containerLegend.on("click", function () {
          const selectedColor = color;
          toggleNodes(selectedColor);
      });
      if (i + 1 <= 4) {
        minimo = Math.round(min_value + sumador * i);
        maximo = Math.round(min_value + sumador * (i + 1));
        containerLegend
          .append("p")
          .text(minimo + " a " + maximo)
          .style("margin-top", 0)
          .style("margin-left", "2px")
          .style("margin-bottom", 0)
          .style("font-size", "12px");
      } else {
        minimo = Math.round(min_value + sumador * i);
        containerLegend
          .append("p")
          .text("> " + minimo)
          .style("margin-top", 0)
          .style("margin-left", "2px")
          .style("margin-bottom", 0)
          .style("font-size", "12px");
      }
      
    }
    function toggleNodes(selectedColor) {
      d3.selectAll(".marker").each(function (d) {
        const peso = getPesoValue(d); // Obtener el valor de peso del nodo
        let shouldShow = false;
    
        // Verificar si el color actual está en el objeto legendState
        if (legendState[selectedColor] === undefined) {
          legendState[selectedColor] = true; // Si no está, lo agregamos y lo configuramos como verdadero (mostrar)
        } else {
          // Si ya está, cambiamos el estado (mostrar/ocultar)
          legendState[selectedColor] = !legendState[selectedColor];
        }
    
        // Verificar si el nodo actual tiene el color seleccionado en la leyenda
        if (peso >= min_value && peso < min_value + sumador) {
          const colorIndex = 0;
          shouldShow = legendState[colors_circles[colorIndex]];
        } else if (peso >= min_value + sumador && peso < min_value + sumador * 2) {
          const colorIndex = 1;
          shouldShow = legendState[colors_circles[colorIndex]];
        } else if (peso >= min_value + sumador * 2 && peso < min_value + sumador * 3) {
          const colorIndex = 2;
          shouldShow = legendState[colors_circles[colorIndex]];
        } else if (peso >= min_value + sumador * 3 && peso < min_value + sumador * 4) {
          const colorIndex = 3;
          shouldShow = legendState[colors_circles[colorIndex]];
        } else if (peso >= min_value + sumador * 4) {
          const colorIndex = 4;
          shouldShow = legendState[colors_circles[colorIndex]];
        }
    
        d3.select(this).style("display", shouldShow ? "block" : "none");
      });
    }
    function getPesoValue(data) {
      let peso = 0;
      if (
        data.value.hasOwnProperty("Nro. llegadas") &&
        data.value.hasOwnProperty("Nro. salidas")
      ) {
        peso = (data.value["Nro. salidas"] + data.value["Nro. llegadas"]) / 2;
      } else if (data.value.hasOwnProperty("Nro. salidas")) {
        peso = data.value["Nro. salidas"];
      } else if (data.value.hasOwnProperty("Nro. llegadas")) {
        peso = data.value["Nro. llegadas"];
      }
      return peso;
    }
    // TOOLTIP
    overlay.draw = function () {
      let projection = this.getProjection(),
        padding = 11;

      let tooltip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([-10, 0])
        .html(function (d) {
          result =
            "<strong>Información</strong> <br><br>" +
            "<strong>Nombre:</strong> " +
            d.value["Nombre"];
          if (d.value.hasOwnProperty("Nro. salidas") == true) {
            result +=
              "<br><strong>Nro. salidas:</strong> " +
              d.value["Nro. salidas"] +
              " viajes";
          }
          if (d.value.hasOwnProperty("Nro. llegadas") == true) {
            result +=
              "<br><strong>Nro. llegadas:</strong> " +
              d.value["Nro. llegadas"] +
              " viajes";
          }
          if (
            d.value.hasOwnProperty("Nro. llegadas") == true &&
            d.value.hasOwnProperty("Nro. salidas") == true
          ) {
            result +=
              "<br><strong>Porcentaje de salidas:</strong> " +
              d.value["Porcentaje de salidas"] +
              "<br><strong>Porcentaje de llegadas:</strong> " +
              d.value["Porcentaje de llegadas"];
          }

          return result;
        });

      let marker = layer
        .selectAll("svg")
        .data(d3.entries(data))
        .each(transform) // update existing markers
        .enter()
        .append("svg")
        .each(transform)
        .attr("class", "marker")
        .on("mouseover", tooltip.show)
        .on("mouseout", tooltip.hide)
        .on("click",  ()=> {
          
          const mainContainer = document.getElementById("main-container");
          const cardMap = document.getElementById('card-map');
          cardMap.classList.add('slide-left');
          const graphContainer = document.getElementById('graph-container');
          graphContainer.style.display = 'inline-block';
          graphContainer.style.right = '0';
          graphContainer.style.width = '40rem';
          graphContainer.style.height = '40rem';
          if (mainContainer.style.flexDirection === "row") {
            mainContainer.style.flexDirection = "row-reverse";
            cardMap.style.order = "2";
            graphContainer.style.order = "1";
          } else {
            mainContainer.style.flexDirection = "row";
            cardMap.style.order = "1";
            graphContainer.style.order = "2";
          }
        });

      d3.select("svg").call(tooltip);

      // Add a circle.
      marker
        .append("circle")
        .attr("r", 9.5)
        .attr("cx", padding)
        .attr("cy", padding)
        .style("fill", function (d, i) {
          let peso = 0;
          if (
            d.value.hasOwnProperty("Nro. llegadas") == true &&
            d.value.hasOwnProperty("Nro. salidas") == true
          ) {
            peso = (d.value["Nro. salidas"] + d.value["Nro. llegadas"]) / 2;
          }
          if (d.value.hasOwnProperty("Nro. salidas") == true) {
            peso = d.value["Nro. salidas"];
          }
          if (d.value.hasOwnProperty("Nro. llegadas") == true) {
            peso = d.value["Nro. llegadas"];
          }

          if (peso >= min_value && peso < min_value + sumador) {
            color = colors_circles[0];
          } else if (
            peso >= min_value + sumador &&
            peso < min_value + sumador * 2
          ) {
            color = colors_circles[1];
          } else if (
            peso >= min_value + sumador * 2 &&
            peso < min_value + sumador * 3
          ) {
            color = colors_circles[2];
          } else if (
            peso >= min_value + sumador * 3 &&
            peso < min_value + sumador * 4
          ) {
            color = colors_circles[3];
          } else if (peso >= min_value + sumador * 4) {
            color = colors_circles[4];
          }
          return color;
        });

      // Add label id
      marker
        .append("text")
        .text(function (d) {
          return d.key;
        })
        .attr("class", "id-station")
        .attr("x", "48%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", 8.2)
        .on("click", function(event, d) {
          var dataForNode = d3.select(this).datum();
          onClickNode(dataForNode.key);
        });

      function transform(d) {
        d = new google.maps.LatLng(d.value["Latitude"], d.value["Longitude"]);
        d = projection.fromLatLngToDivPixel(d);
        return d3
          .select(this)
          .style("left", d.x - padding + "px")
          .style("top", d.y - padding + "px");
      }
    };
  };

  // Bind our overlay to the map…
  overlay.setMap(map);
});
let currentColor;
function onClickNode(d) {
  
  const nodeName = d; // Obtener el nombre del nodo clickeado
  console.log("Nombre del nodo:", nodeName);
  const textElement = d3.event.currentTarget; // Obtener el elemento del texto clickeado
  const svgElement = textElement.parentNode; // Obtener el elemento svg que contiene el círculo y el texto

  // Seleccionar el círculo dentro del svg
  const circleElement = d3.select(svgElement).select("circle");

  // Seleccionar el texto dentro del svg
  const textElement1 = d3.select(svgElement).select("text");

  console.log("Nombre del nodo:", textElement1);
  console.log("Elemento del círculo:", circleElement);
  const isNodeClicked = circleElement.attr("data-clicked") === "true";
  if (isNodeClicked) {
    circleElement
      .style("fill", currentColor); 
    textElement1
      .style("fill", "black");
    circleElement.attr("data-clicked", "false");
  }else{
    currentColor = circleElement.style("fill");
    circleElement
      .style("fill", "green"); // Nuevo color del círculo  
    textElement1
      .style("fill", "white");  
    circleElement.attr("data-clicked", "true");
  }
  // Llamar a la función para mostrar el gráfico correspondiente al nodo seleccionado
  showGraph(nodeName);
}
function showGraph(nodeName) {
  d3.select("#salidasChart").style("display", "none").html("");
  d3.select("#salidasChartdias").style("display", "none").html("");
  if(document.querySelector('#close-button') !== null){
    document.querySelector('#close-button').remove();
  }
  d3.select("#salidasChart").style("display", "block");
  d3.select("#salidasChartdias").style("display", "block");
  // Configuración del gráfico
  loadAndCreateCharts(nodeName);
  loadAndCreateCharts1(nodeName);
  d3.select("#graph-container")
    .append("button")
    .attr("id", "close-button")
    .text("Cerrar")
    .on("click", hideGraph);
}
function hideGraph() {
  // Ocultar el gráfico y borrar su contenido
  d3.select("#salidasChart").style("display", "none").html("");
  d3.select("#salidasChartdias").style("display", "none").html("");
}
function createBarChart(containerId, dataSalidas, dataEntradas, colorSalidas, colorEntradas) {
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const svg = d3.select(`#${containerId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scale.ordinal()
    .rangeRoundBands([margin.left, width - margin.right], 0.1)
    .domain(dataSalidas.map(d => d.hora));

  const y = d3.scale.linear()
    .range([height - margin.bottom, margin.top])
    .domain([0, d3.max([...dataSalidas, ...dataEntradas], d => d.equipos)]);

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickFormat(d3.format("d"));

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  const tooltip = d3.select(`#${containerId}`)
    .append("div")
    .style("position", "absolute")
    .style("padding", "5px")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Grupo para las barras de salidas
  const groupSalidas = svg.append("g")
    .attr("class", "groupSalidas")
    .attr("transform", `translate(0,0)`);

  groupSalidas.selectAll(".bar.salida")
    .data(dataSalidas)
    .enter().append("rect")
    .attr("class", "bar salida")
    .attr("x", d => x(d.hora))
    .attr("y", d => y(d.equipos))
    .attr("width", x.rangeBand() / 2)
    .attr("height", d => height - margin.bottom - y(d.equipos))
    .style("fill", colorSalidas)
    .style("opacity", 0.7) // Ajusta la opacidad según lo desees
    .on("mouseover", function(d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`Hora: ${d.hora}<br/>Salidas: ${d.equipos}`)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Grupo para las barras de entradas
  const groupEntradas = svg.append("g")
    .attr("class", "groupEntradas")
    .attr("transform", `translate(${x.rangeBand() / 2},0)`);

  groupEntradas.selectAll(".bar.entrada")
    .data(dataEntradas)
    .enter().append("rect")
    .attr("class", "bar entrada")
    .attr("x", d => x(d.hora))
    .attr("y", d => y(d.equipos))
    .attr("width", x.rangeBand() / 2)
    .attr("height", d => height - margin.bottom - y(d.equipos))
    .style("fill", colorEntradas)
    .style("opacity", 1.0) // Ajusta la opacidad según lo desees
    .on("mouseover", function(d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`Hora: ${d.hora}<br/>Entradas: ${d.equipos}`)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
      // Agregar leyenda con una sola imagen
  const legendWidth = 110;
  const legendHeight = 65;
  const legendX = width - margin.right - legendWidth;
  const legendY = margin.top;

  // Agregar un grupo para la leyenda
  const legendGroup = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${legendX},${legendY})`);

  // Agregar el cuadro que recubre la imagen
  legendGroup.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 1);

  // Agregar la imagen como elemento SVG con xlink:href
  const imageWidth = 100;
  const imageHeight = 60;

  // Ruta de la imagen que deseas mostrar
  const imagePath = "../static/js/leyenda.jpeg"; // Reemplaza con la ruta de tu imagen

  legendGroup.append("image")
    .attr("xlink:href", imagePath)
    .attr("width", imageWidth)
    .attr("height", imageHeight)
    .attr("x", (legendWidth - imageWidth) / 2)
    .attr("y", (legendHeight - imageHeight) / 2);
}

function createBarChart1(containerId, dataSalidas, dataEntradas, colorSalidas, colorEntradas) {
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const svg = d3.select(`#${containerId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scale.ordinal()
    .rangeRoundBands([margin.left, width - margin.right], 0.1)
    .domain(dataSalidas.map(d => d.hora));

  const y = d3.scale.linear()
    .range([height - margin.bottom, margin.top])
    .domain([0, d3.max([...dataSalidas, ...dataEntradas], d => d.equipos)]);

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickFormat(d3.format("d"));

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  const tooltip = d3.select(`#${containerId}`)
    .append("div")
    .style("position", "absolute")
    .style("padding", "5px")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Grupo para las barras de salidas
  const groupSalidas = svg.append("g")
    .attr("class", "groupSalidas")
    .attr("transform", `translate(0,0)`);

  groupSalidas.selectAll(".bar.salida")
    .data(dataSalidas)
    .enter().append("rect")
    .attr("class", "bar salida")
    .attr("x", d => x(d.hora))
    .attr("y", d => y(d.equipos))
    .attr("width", x.rangeBand() / 2)
    .attr("height", d => height - margin.bottom - y(d.equipos))
    .style("fill", colorSalidas)
    .style("opacity", 0.7) // Ajusta la opacidad según lo desees
    .on("mouseover", function(d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`Dia: ${d.hora}<br/>Salidas: ${d.equipos}`)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Grupo para las barras de entradas
  const groupEntradas = svg.append("g")
    .attr("class", "groupEntradas")
    .attr("transform", `translate(${x.rangeBand() / 2},0)`);

  groupEntradas.selectAll(".bar.entrada")
    .data(dataEntradas)
    .enter().append("rect")
    .attr("class", "bar entrada")
    .attr("x", d => x(d.hora))
    .attr("y", d => y(d.equipos))
    .attr("width", x.rangeBand() / 2)
    .attr("height", d => height - margin.bottom - y(d.equipos))
    .style("fill", colorEntradas)
    .style("opacity", 1.0) // Ajusta la opacidad según lo desees
    .on("mouseover", function(d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`Dia: ${d.hora}<br/>Entradas: ${d.equipos}`)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}
function loadAndCreateCharts(stationId) {
  const tituloGuardado = localStorage.getItem('tituloGuardado');
  let anio = 2018;
  let mes = null;
  
  if (tituloGuardado) {
    const yearMonth = tituloGuardado.split(' en el ')[1]; // La parte después de " en el " contiene el "2015-01"

    // Verificar si el formato del año y el mes es válido
    const yearMonthArr = yearMonth.split('-'); // Separar el "2015-01" en ["2015", "01"]

    // Convertir el año y el mes en números y almacenarlos en las variables locales
    if (yearMonthArr.length === 2) {
      anio = parseInt(yearMonthArr[0]);
      mes = parseInt(yearMonthArr[1]);
    }
  }
  console.log(tituloGuardado);
  let url = '';
  if(mes == null) {
    url = `../static/data/${anio}_hours.json`;
    console.log(url);
  }else if(mes < 10) {
    url = `../static/data/horas/${anio}_0${mes}_hours.json`;
  } else{
    url = `../static/data/horas/${anio}_${mes}_hours.json`;
  }
  
  const colorSalidas = "steelblue";
  const colorEntradas = "orange";
  d3.json(url, function(error, data) {
    if (error) {
      console.error("Error loading data:", error);
    } else {
      const stationData = data[stationId];

      if (stationData) {
        const stationName = stationData.Nombre;
        console.log("Hola mirame", stationName);
        updateStationName(stationName);

        const dataSalidas = Object.entries(stationData["Nro. salidas"]).map(([hora, equipos]) => ({ hora, equipos }));
        const dataEntradas = Object.entries(stationData["Nro. llegadas"]).map(([hora, equipos]) => ({ hora, equipos }));
        dataSalidas.sort((a, b) => parseInt(a.hora) - parseInt(b.hora));
        dataEntradas.sort((a, b) => parseInt(a.hora) - parseInt(b.hora));
        console.log(dataEntradas);
        //createBarChart("salidasChart", dataSalidas, colorSalidas);
        //createBarChart("entradasChart", dataEntradas, colorEntradas);
        createBarChart("salidasChart", dataSalidas, dataEntradas, colorSalidas, colorEntradas);
      }
    }
  });
}
function loadAndCreateCharts1(stationId) {
  console.log('entre');
  const tituloGuardado = localStorage.getItem('tituloGuardado');
  let anio = 2018;
  let mes = null;
  
  if (tituloGuardado) {
    const yearMonth = tituloGuardado.split(' en el ')[1]; // La parte después de " en el " contiene el "2015-01"

    // Verificar si el formato del año y el mes es válido
    const yearMonthArr = yearMonth.split('-'); // Separar el "2015-01" en ["2015", "01"]

    // Convertir el año y el mes en números y almacenarlos en las variables locales
    if (yearMonthArr.length === 2) {
      anio = parseInt(yearMonthArr[0]);
      mes = parseInt(yearMonthArr[1]);
    }
  }
  console.log(tituloGuardado);
  let url = '';
  if(mes == null) {
    url = `../static/data/${anio}_dia.json`;
    console.log(url);
  }else if(mes < 10) {
    url = `../static/data/dias/${anio}_0${mes}_dia.json`;
  } else{
    url = `../static/data/dias/${anio}_${mes}_dia.json`;
  }
  
  const colorSalidas = "steelblue";
  const colorEntradas = "orange";
  d3.json(url, function(error, data) {
    if (error) {
      console.error("Error loading data:", error);
    } else {
      const stationData = data[stationId];

      if (stationData) {
        const stationName = stationData.Nombre;
        updateStationName(stationName);

        const dataSalidas = Object.entries(stationData["Nro. salidas"]).map(([hora, equipos]) => ({ hora, equipos }));
        const dataEntradas = Object.entries(stationData["Nro. llegadas"]).map(([hora, equipos]) => ({ hora, equipos }));
        dataSalidas.sort((a, b) => parseInt(a.hora) - parseInt(b.hora));
        dataEntradas.sort((a, b) => parseInt(a.hora) - parseInt(b.hora));
        createBarChart("salidasChartdias", dataSalidas, dataEntradas, colorSalidas, colorEntradas);
      }
    }
  });
}
function updateStationName(stationName) {
  document.querySelector(".titulo_graph").innerText = `Estación: ${stationName}`;
}