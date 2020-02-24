function loademissionCSV() {

  return new Promise(function (resolve, reject) {

    var emissionList = [];

    let eType = identifySelectorValue();

    d3.csv("GHG.csv", function (data) {

      var i;

      for (i = 0; i < data.length; i++) {
        let list = [data[i].Country, data[i].Year, data[i][eType]]

        emissionList.push(list)
      }
    });
    resolve(emissionList)
  })
}

function loadWaveCSV() {

  return new Promise(function (resolve, reject) {

    d3.queue()
      .defer(d3.csv, "wave2.csv")
      .defer(d3.csv, "wave3.csv")
      .defer(d3.csv, "wave4.csv")
      .defer(d3.csv, "wave5.csv")
      .defer(d3.csv, "wave6.csv")
      .await(function (error, file1, file2, file3, file4, file5) {
        if (error) {
          console.error('Oh dear, something went wrong: ' + error);
        }
        else {

          let waveObject = combineWaveCsvs(file1, file2, file3, file4, file5);

          resolve(waveObject)
        }
      });

    function combineWaveCsvs(file1, file2, file3, file4, file5) {

      let waves = { "wave2": file1, "wave3": file2, "wave4": file3, "wave5": file4, "wave6": file5 };
      return waves;
    }


  })
}

function identifySelectorValue() {
  //let emissionType = document.getElementById("emissionSelector").value

  //if (emissionType == "ghg") { emissionString = "Total GHG Emissions Including LUCF (MtCO2e)" }

  //if (emissionType == "ch4") { emissionString = "Total CH4 (MtCO2e)" }

  //if (emissionType == "ind") { emissionString = " Manufacturing Industries and Construction (MtCO2e)" }
  let emissionString = document.getElementById("emissionSelector").value

  return emissionString
}

function buildDetailView() {
  let components = [];
  let countryList = [];
  let selectorValue = identifySelectorValue();
  let sliderValue = document.getElementById("sliderValue").innerHTML;
  let selectedCountries = document.getElementById("selectedCountries").children;

  for (let i = 0; i < selectedCountries.length; i++) {
    let Child = selectedCountries[i];
    if (Child != "") {
      countryList.push(Child.getAttribute("name"))
    }

  }

  //Build component list [[list of countries selected], year on slider, selected emission type]
  components.push(countryList)
  components.push(sliderValue)
  components.push(selectorValue)
  //combineData(components).then(function (selection) { buildBubbleChart(selection) })
  //buildBubbleChart(components)
  loadWaveCSV().then(function (waves) { buildBubbleChart(waves, components) })

}


function buildBubbleChart(dataset, selection) {

  //dataset is the entire waves dataset
  //selection is a list [[list of countries selected], wave on slider, selected attribute for worldmap]


  let selectedData = [];
  let selectedCountries = selection[0];
  let selectedWave = dataset["wave" + selection[1]];


  for (let i = 0; i < selectedWave.length; i++) {
    for (let j = 0; j < selectedCountries.length; j++) {


      if (selectedWave[i].country == selectedCountries[j]) {
        selectedData.push(selectedWave[i])

      }

    }

  }


  let svgExists = document.getElementById("bubbleChart");

  if (svgExists) {
    d3.select("#bubbleChart").remove();
  }

  const keys = ["abortion",
    "suicide",
    "bribe",
    "prost",
    "homo",
    "taxes",
    "gov",
    "divorce",
    "transport"];

  const margin = { top: 20, right: 50, bottom: 30, left: 20 }
  const width = 960 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom

  const x = d3.scaleBand()
    .rangeRound([0, width])

  const y = d3.scaleLinear()
    .rangeRound([height, 0])

  const z = d3.scaleOrdinal(d3.schemeCategory10)

  const xAxis = d3.axisBottom()
    .scale(x)
    //.tickFormat(d3.timeFormat('%b'))

  const yAxis = d3.axisRight()
    .scale(y)

  const svg = d3.select('#detailView')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("id", "bubbleChart")
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  /*

  const type = (d) => {
    //d.date = parseDate(d.date)
    keys.forEach(c => {
      d[c] = +d[c]
      
    })
    return d
  }  
  */

  function populateSVG(data, keys, wave) {

    for (let i = 0; i < data.length; ++i) {

      let d = data[i];
      let yCord = 0;
     
      keys.forEach(c => {
        d[c] = parseFloat(d[c])
      })
     

      const layers = d3.stack()
        .keys(keys)
        (data)
    
      x.domain(layers[0].map(d => d.data.country))

      y.domain([0, d3.max(layers[layers.length - 1], d => (d[0] + d[1]))]).nice()

      const layer = svg.selectAll('layer')
        .data(layers)
        .enter()
        .append('g')
        .attr('class', 'layer')
        .style('fill', (d, i) => (z(i)))


      layer.selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('x', d => x(d.data.country))
        .attr('y', d => y(d[0] + d[1]))
        //.attr('test', d => console.log(d))
        .attr('height', d => y(d[0]) - y(d[1] + d[0]))
        .attr('width', x.bandwidth() - 1)
        .attr('name', d => d[0])

      svg.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

      svg.append('g')
        .attr('class', 'axis axis--y')
        .attr('transform', `translate(${width},0)`)
        .call(yAxis)
    }


  }

  populateSVG(selectedData, keys, selectedWave)


}



function slider() {
  var slider = document.getElementById("yearSlider");
  var output = document.getElementById("sliderValue");
  output.innerHTML = slider.value;

  slider.oninput = function () {
    output.innerHTML = this.value;
  }
}

function main(waves) {

  // The svg
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Map and projection
  var path = d3.geoPath();
  var projection = d3.geoMercator()
    .scale(160)
    .center([0, 20])
    .translate([width / 2, height / 2]);

  // Data and color scale
  var data = d3.map();
  var colorScale = d3.scaleThreshold()
    .domain([1, 2, 3, 4, 5, 6])
    .range(d3.schemeReds[7]);

  //Load external data and boot
  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function (d) { data.set(d.code, +d.pop); })
    .await(ready);


  function showTooltip(countryName) {
    let tooltip = document.getElementById("tooltip");
    tooltip.style.opacity = "1";
    tooltip.innerHTML = countryName;

    let x = event.clientX, y = event.clientY;
    tooltip.style.top = (y + 1) + 'px';
    tooltip.style.left = (x + 5) + 'px';
  }

  function hideTooltip() {
    let tooltip = document.getElementById("tooltip");
    tooltip.style.opacity = "0";
    tooltip.innerHTML = "";
  }

  function selectCountry(countryName) {

    if (document.getElementById("IN" + countryName) == null) {
      let countries = document.getElementById("selectedCountries");
      countryNameId = "IN" + countryName;
      html = '<div ><img src="https://img.icons8.com/ios-filled/50/000000/x.png" id="' + countryNameId + '" alt="nounX" height="15" width="15" class="mr-1" onclick="document.getElementById(this.id).parentNode.parentNode.remove();mount()"><label " for="customControlAutosizing">' + countryName + '</label></div>';
      let div = document.createElement("DIV");
      div.innerHTML = html;
      div.setAttribute("name", countryName);
      countries.appendChild(div);
    }
  }



  function ready(error, topo) {

    let mouseOver = function (d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
      //.style("stroke", "black")
      let country = d3.select(this).attr("code");

      showTooltip(country)

    }

    let mouseLeave = function (d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")

      hideTooltip()
    }

    let mouseClick = function (d) {
      let code = d3.select(this).attr("code");
      updateCountry(code)
      selectCountry(code)
    }

    // Draw the map
    var map = svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      .attr("code", function (d) {
        return d.properties.name
      })
      // set the color of each country
      .attr("fill", function (d) {
        let waveData = getAttrValue(d.properties.name, getSliderValue(), waves, identifySelectorValue());
        return colorScale(waveData);
      })
      .attr("ghg", function (d) {
        return getAttrValue(d.properties.name, getSliderValue(), waves, identifySelectorValue());;
      })
      .style("stroke", "transparent")
      .attr("class", function (d) { return "Country" })
      .style("opacity", .8)
      .on("mouseover", mouseOver)
      .on("click", mouseClick)
      .on("mouseleave", mouseLeave)


    function updateCountry(country_name) {

      //document.getElementById("chart_1").innerHTML = "";

      d3.csv("GHG.csv", function (data) {
        var TotalGHG = [];
        var i;

        for (i = 0; i < data.length; i++) {

          if (data[i].Country == country_name) {
            //Make list of emissions per country

            var countryGHG = data[i]["Total GHG Emissions Including LUCF (MtCO2e)"];

            TotalGHG.push(countryGHG)
          }
        }

        /*
                d3.select(".chart_1")
                  .selectAll("div")
                  .data(TotalGHG)
                  .enter()
                  .append("div")
                  .style("width", function (d) { return d + "px"; })
                  .style("height", "20px")
                  .style("background-color", "teal")
                  .attr("class", "border-bottom")
                  .text(function (d) { return d; });*/

      });
    }

    function getGHG(country_name, emissionList) {
      //emissionList[Countryname,year,GHG]
      let i;
      for (i = 0; i < emissionList.length; i++) {
        if (emissionList[i][0] == country_name && emissionList[i][1] == getSliderValue()) {
          return emissionList[i][2]
        }
      }
    }

    function getAttrValue(country_name, wave, waveObject, selectedAttr) {

      let key = "wave" + wave;

      for (let i = 0; i < waveObject[key].length; i++) {
        if (waveObject[key][i].country == country_name && wave == getSliderValue()) {

          return waveObject[key][i][selectedAttr]
        }
      }
    }


    function getSliderValue() {

      var slider = document.getElementById("yearSlider");
      return slider.value

    }
    //Zoom limits
    var dims = {
      width: 1600,
      height: 960,
      svg_dx: 100,
      svg_dy: 100
    };
    //create zoom handler 
    var zoom_handler = d3.zoom()
      .extent([[dims.svg_dx, dims.svg_dy], [dims.width - (dims.svg_dx * 2), dims.height - dims.svg_dy]])
      .scaleExtent([1, 10])
      .translateExtent([[dims.svg_dx, dims.svg_dy], [dims.width - (dims.svg_dx * 2), dims.height - dims.svg_dy]])
      .on("zoom", zoom_actions);

    // Scale
    var xScale = d3.scaleLinear()
      .domain([0, 5000])
      .range([dims.svg_dx, dims.width - (dims.svg_dx * 2)]);


    //specify what to do when zoom event listener is triggered 
    function zoom_actions() {
      map.attr("transform", d3.event.transform);

      let e = d3.event,
        // now, constrain the x and y components of the translation by the
        // dimensions of the viewport
        tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
        ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));

      // then, update the zoom behavior's internal translation, so that
      // it knows how to properly manipulate it on the next movement
      zoom.translate([tx, ty]);
      // and finally, update the <g> element's transform attribute with the
      // correct translation and scale (in reverse order)
      map.attr("transform", [
        "translate(" + [tx, ty] + ")",
        "scale(" + e.scale + ")"
      ].join(" "));
    }

    //add zoom behaviour to the svg element 
    //same as svg.call(zoom_handler); 
    zoom_handler(svg);

    //Populates the detail view
    buildDetailView()

  }

}

function mount() {

  if (document.getElementById("theWorld")) {
    document.getElementById("theWorld").innerHTML = "";
  }

  if (document.getElementById("slidecontainer")) {
    document.getElementById("slidecontainer").innerHTML = "";
  }

  slider()
  loadWaveCSV().then(function (waves) { main(waves) })
}

mount()




