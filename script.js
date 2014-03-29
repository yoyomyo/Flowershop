

var jsonData = [
{"flower": "tulip", "date": "2/3/2012", "quantity-sold": "20", "quantity-unsold": "10"},
{"flower": "tulip", "date": "2/4/2012", "quantity-sold": "18", "quantity-unsold": "12"},
{"flower": "tulip", "date": "2/5/2012", "quantity-sold": "23", "quantity-unsold": "7"},
{"flower": "tulip", "date": "2/6/2012", "quantity-sold": "15", "quantity-unsold": "20"},
{"flower": "tulip", "date": "2/7/2012", "quantity-sold": "12", "quantity-unsold": "23"},
{"flower": "rose", "date": "2/3/2012", "quantity-sold": "50", "quantity-unsold": "40"},
{"flower": "rose", "date": "2/4/2012", "quantity-sold": "43", "quantity-unsold": "47"},
{"flower": "rose", "date": "2/5/2012", "quantity-sold": "55", "quantity-unsold": "35"},
{"flower": "rose", "date": "2/6/2012", "quantity-sold": "70", "quantity-unsold": "20"},
{"flower": "rose", "date": "2/7/2012", "quantity-sold": "30", "quantity-unsold": "70"},
{"flower": "rose", "date": "2/8/2012", "quantity-sold": "40", "quantity-unsold": "60"},
{"flower": "dandelion", "date": "2/3/2012", "quantity-sold": "10", "quantity-unsold": "0"},
{"flower": "dandelion", "date": "2/4/2012", "quantity-sold": "9", "quantity-unsold": "11"},
{"flower": "dandelion", "date": "2/5/2012", "quantity-sold": "3", "quantity-unsold": "17"},
{"flower": "dandelion", "date": "2/6/2012", "quantity-sold": "4", "quantity-unsold": "16"},
{"flower": "dandelion", "date": "2/7/2012", "quantity-sold": "7", "quantity-unsold": "8"}
]


//checkbox values
var sold = true
var unsold = true


//convert json data to a group of objects
var data = []
var flowers = {};           //key data by flower names
var dates = {};             //key data by dates
for(var d in jsonData){
    var row = {};
    row.flower = jsonData[d]["flower"]
    row.date = jsonData[d]["date"]
    row.sold = +jsonData[d]["quantity-sold"]
    row.unsold = +jsonData[d]["quantity-unsold"]
    data.push(row)

    if(!(row.flower in flowers)){ flowers[row.flower] = []}

    if(sold && unsold){
        flowers[row.flower].push({date:row.date, begin: 0, end:row.sold});
        flowers[row.flower].push({date:row.date, begin: row.sold, end:row.sold + row.unsold});
    }else if(sold){
        flowers[row.flower].push({date:row.date, sold:row.sold});
    }else if(unsold){
        flowers[row.flower].push({date:row.date, unsold:row.unsold});
    }


    if(!(row.date in dates)){ dates[row.date] = [] }

    if(sold && unsold){
        dates[row.date].push({flower:row.flower, bottom:0, top:row.sold});
        dates[row.date].push({flower:row.flower, bottom:row.sold, top:row.sold+row.unsold});
    }else if(sold){
        dates[row.date].push({flower:row.flower, sold:row.sold});
    }else if(unsold){
        dates[row.date] = [{flower:row.flower, unsold:row.unsold}];
    }
}



var datesArray = []
for (var key in dates) {
    datesArray.push({date:key, value:dates[key]});
}

var flowersArray = []
for (var key in flowers) {
    flowersArray.push({flower:key, value:flowers[key]});
}



// var format = d3.time.format("%m/%d/%Y")
// var amountFn = function(d) { return d.sold }
// var dateFn = function(d) { return format.parse(d.date) }

var width = 960,
    height = 500;

var barWidth = width / data.length;

//set chart width and height
var chart = d3.select(".chart")
    .attr("height", height)
    .attr("width", width);


var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//param: array of dates, array of flowers, boolean sold, boolean unsold

// // var x = d3.scale.ordinal()
// //     .rangeRoundBands([0, width], .1);
// var y = d3.scale.linear()
//     .domain([0, d3.max(data, function(d) { return d.sold; })])
//     .range([height, 0]);

var x = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.date; }))
    .rangeBands([10, width]);

var xx = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.flower; }))
        .rangeRoundBands([10, x.rangeBand()]);

  // x0.domain(data.map(function(d) { return d.State; }));
  //x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
var soldColor = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.flower; }))
    .range(["#98abc5", "#8a89a6", "#7b6888"]);

var unsoldColor = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.flower; }))
    .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.sold+d.unsold; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var state = chart.selectAll(".dates")
      .data(datesArray)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { 
        return "translate(" + x(d.date) + ",0)"; 
    });
 

  if(sold && unsold){
      var bar = state.selectAll("rect")
          .data(function(d) { return d.value })
          .enter().append("rect")
          .attr("width", xx.rangeBand())
          .attr("x", function(d) { return xx(d.flower); })
          .attr("y", function(d) { return y(d.top); })
          .attr("height", function(d) { return y(d.bottom) - y(d.top); })
          .style("fill", function(d,i) { 
                if(d.bottom ==0){
                    console.log("sold " + d.flower + ":"+soldColor(d.flower))
                    return soldColor(d.flower); 
                }else{
                    console.log("unsold " + d.flower + ":"+unsoldColor(d.flower))
                    return unsoldColor(d.flower);  
                }               
        })    
  }


  var legend = chart.selectAll(".legend")
      .data(Object.keys(flowers).slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", soldColor);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
