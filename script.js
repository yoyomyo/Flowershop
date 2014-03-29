

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
        flowers[row.flower].push({date:row.date, bottom:0, top:row.sold, sold:true});
        flowers[row.flower].push({date:row.date, bottom:row.sold, top:row.sold+row.unsold, unsold:true});
    }else if(sold){
        flowers[row.flower].push({date:row.date, bottom:0, top:row.sold, sold:true});
    }else if(unsold){
        flowers[row.flower].push({date:row.date, bottom:0, top:row.unsold, unsold:true});
    }


    if(!(row.date in dates)){ dates[row.date] = [] }

    if(sold && unsold){
        dates[row.date].push({flower:row.flower, bottom:0, top:row.sold, sold:true});
        dates[row.date].push({flower:row.flower, bottom:row.sold, top:row.sold+row.unsold, unsold:true});
    }else if(sold){
        dates[row.date].push({flower:row.flower, bottom:0, top:row.sold, sold:true});
    }else if(unsold){
        dates[row.date].push({flower:row.flower, bottom:0, top:row.unsold, unsold:true});
    }
}



var allDates = []
for (var key in dates) {
    allDates.push({date:key, value:dates[key]});
}

var allFlowers = []
for (var key in flowers) {
    allFlowers.push({flower:key, value:flowers[key]});
}

  var legendData = Object.keys(flowers).slice().map(function(d){return d+'(sold)'});
  Object.keys(flowers).slice().map(function(d){ legendData.push(d+'(unsold)')})

//user input
var dateArray = ['2/3/2012', '2/4/2012']
var flowerArray = ['tulip', 'dandelion']
var sold = true
var unsold = true


//domain of x axis, dates
//domain of xx axis, flowers
//domain of y axis, sold, unsold or sold+unsold
//domain of color, flower, either sold or unsold
function getDataSubset(dateArray, flowerArray, sold, unsold){
    for(var i in dateArray){
        dates[dateArray[i]]
    }
}



//set chart width and height
var chart = d3.select(".chart")
    .attr("height", height)
    .attr("width", width);

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//param: array of dates, array of flowers, boolean sold, boolean unsold

var x = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.date; }))
    .rangeBands([10, width-100]);

var xx = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.flower; }))
        .rangeRoundBands([30, x.rangeBand()-30]);

// var color = d3.scale.ordinal()
//     .domain(legendData)
//     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var color = {};
    colorCandidate = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
    for(var i in legendData){
        color[legendData[i]] = colorCandidate[i];
    }

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

  var group = chart.selectAll(".dates")
      .data(allDates)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { 
        return "translate(" + x(d.date) + ",0)"; 
    });
 

  // if(sold && unsold){
      var bar = group.selectAll("rect")
          .data(function(d) { return d.value })
          .enter().append("rect")
          .attr("width", xx.rangeBand())
          .attr("x", function(d) { return xx(d.flower); })
          .attr("y", function(d) { return y(d.top); })
          .attr("height", function(d) { return y(d.bottom) - y(d.top); })
          .style("fill", function(d,i) { 
                if(d.hasOwnProperty('sold')){
                    return color[d.flower+'(sold)']; 
                }else{
                    return color[d.flower+'(unsold)'];  
                }               
        })    
  // }


  var legend = chart.selectAll(".legend")
      .data(legendData)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width -24)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) {console.log(d); return color[d]});

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
