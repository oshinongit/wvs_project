// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 360 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
// append the svg object to the body of the page
var chart_2 = d3.select("#chart_2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
//Read the data
d3.csv("GDP.csv",
  // When reading the csv, I must format variables:
  function(d){
    if (d.LOCATION == "SWE" && d.TIME >= "1990" && d.MEASURE == "USD_CAP"){
      //console.log(d.TIME, d.Value);
    
    return { date : d3.timeParse("%m/%d/%Y")("1/1/" + d.TIME), value : d.Value }
  }
  },
  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain([new Date("1990-01-01"), new Date("2011-01-01")])
      .range([ 0, width ]);
    chart_2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, 90000])
      .range([ height, 0 ]);
    chart_2.append("g")
      .call(d3.axisLeft(y));
    // Add the line
    chart_2.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
    // Add the points
    // detailView
    //   .append("g")
    //   .selectAll("dot")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //     .attr("cx", function(d) { return x(d.date) } )
    //     .attr("cy", function(d) { return y(d.value) } )
    //     .attr("r", 5)
    //     .attr("fill", "#69b3a2")
})
d3.csv("GHG.csv",
  // When reading the csv, I must format variables:
  function(d){
    //console.log("GHG: ", d.Year, d["Total GHG Emissions Including LUCF (MtCO2e)"]);
    if (d.Country == "Sweden" && d.Year >= "1990"){
      console.log("GHG: ", d.Year, d["Total GHG Emissions Including LUCF (MtCO2e)"]);
    
    return { date : d3.timeParse("%m/%d/%Y")("1/1/" + d.Year), value : d["Total GHG Emissions Including LUCF (MtCO2e)"] }
  }
  },
  // Now I can use this dataset:
  function(data) {
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain([new Date("1990-01-01"), new Date("2011-01-01")])
      .range([ 0, width ]);
    chart_2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, 100])
      .range([ height, 0 ]);

    chart_2.append("g")
      .call(d3.axisLeft(y));
    
    // Add the line
    chart_2.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
    // Add the points
    // detailView
    //   .append("g")
    //   .selectAll("dot")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //     .attr("cx", function(d) { return x(d.date) } )
    //     .attr("cy", function(d) { return y(d.value) } )
    //     .attr("r", 5)
    //     .attr("fill", "#69b3a2")
})


//Chart 3 - Population & GDP

var chart_3 = d3.select("#chart_3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
//Read the data
d3.csv("GDP.csv",
  // When reading the csv, I must format variables:
  function(d){
    if (d.LOCATION == "SWE" && d.TIME >= "1990" && d.MEASURE == "MLN_USD"){
      //console.log(d.TIME, d.Value);
    
    return { date : d3.timeParse("%m/%d/%Y")("1/1/" + d.TIME), value : d.Value }
  }
  },
  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain([new Date("1990-01-01"), new Date("2011-01-01")])
      .range([ 0, width ]);
    chart_3.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, 600000])
      .range([ height, 0 ]);
    chart_3.append("g")
      .call(d3.axisLeft(y));
    // Add the line
    chart_3.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
    // Add the points
    // detailView
    //   .append("g")
    //   .selectAll("dot")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //     .attr("cx", function(d) { return x(d.date) } )
    //     .attr("cy", function(d) { return y(d.value) } )
    //     .attr("r", 5)
    //     .attr("fill", "#69b3a2")
})

//Read the data
d3.csv("Population.csv",
  // When reading the csv, I must format variables:
  function(d){
    //console.log(d["Country Name"]);

    for (i = 1990; i < 2012; i++){
      //console.log(i, d[i])
      //console.log(i);
      if (d["Country Name"] == "Sweden" && d["Indicator Name"] == "Population, total") {
        console.log(d3.timeParse("%m/%d/%Y")("1/1/" + i), d[i])
        return {date : d3.timeParse("%m/%d/%Y")("1/1/" + i), value: d[i]}

      }
    }
    // if (d[Country Name] == "Sweden" && d.TIME >= "1990" && d.MEASURE == "MLN_USD"){
    //   //console.log(d.TIME, d.Value);
    
    //   return { date : d3.timeParse("%m/%d/%Y")("1/1/" + d.TIME), value : d.Value }
    // }
  },
  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain([new Date("1990-01-01"), new Date("2011-01-01")])
      .range([ 0, width ]);
    chart_3.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, 10000000])
      .range([ height, 0 ]);
    chart_3.append("g")
      .call(d3.axisLeft(y));
    // Add the line
    chart_3.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
    //Add the points
    chart_3
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 5)
        .attr("fill", "red")
})