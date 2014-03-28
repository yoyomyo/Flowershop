

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

//convert data to a group of objects
//render data by datetime
//render data by flowername
var data = []
for(var d in jsonData){
    var row = {};
    row.flower = jsonData[d]["flower"] 
    row.date = jsonData[d]["date"]
    row.sold = +jsonData[d]["quantity-sold"]
    row.unsold = +jsonData[d]["quantity-unsold"]
    data.push(row)
}

var format = d3.time.format("%m/%d/%Y")
var amountFn = function(d) { return d.sold }
var dateFn = function(d) { return format.parse(d.date) }

var width = 960,
    height = 500;

var barWidth = width / data.length;

//set chart width and height
var chart = d3.select(".chart")
    .attr("height", height)
    .attr("width", width);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.sold; })])
    .range([height, 0]);
  
var x = d3.time.scale()
    .domain(d3.extent(data, dateFn))
    .range([0, width])

// var y = d3.scale.linear()
//     .range([height, 0])
//     .domain(d3.extent(data, amountFn))

//chart is composed of multiple bars
var bar = chart.selectAll("g")
    .data(data)         //The data join, used to create, update or destroy elements whenever data changes.
    .enter()            //data join returns nothing, enter selection returns the new set of data
    .append("g")        //instantiate the missing element g by appending to the enter selection
    .attr("transform", function(d, i) { return "translate("+ i * barWidth + ",0)"; });

//each bar is made of a rect and text
bar.append("rect")
    .attr("y", function(d){return y(d.sold)})
    .attr("height", function(d) { return height - y(d.sold); })
    .attr("width", barWidth - 1);

bar.append("text")
    .attr("y", function(d) { return y(d.sold) + 3; })
    .attr("x", barWidth / 2)
    .attr("dy", ".75em")
    .text(function(d) { return d.sold; });



var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, 500)")
    .call(xAxis);
