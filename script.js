
// (function(){


    var jsonData = [
    {"flower": "tulip", "date": "2/3/2012", "quantity-sold": "20", "quantity-unsold": "10"},
    {"flower": "tulip", "date": "2/4/2012", "quantity-sold": "18", "quantity-unsold": "12"},
    {"flower": "tulip", "date": "2/5/2012", "quantity-sold": "23", "quantity-unsold": "7"},
    {"flower": "tulip", "date": "2/6/2012", "quantity-sold": "15", "quantity-unsold": "20"},
    {"flower": "tulip", "date": "2/7/2012", "quantity-sold": "12", "quantity-unsold": "23"},

    {"flower": "rose", "date": "2/5/2012", "quantity-sold": "55", "quantity-unsold": "35"},
    {"flower": "rose", "date": "2/6/2012", "quantity-sold": "70", "quantity-unsold": "20"},
    {"flower": "rose", "date": "2/7/2012", "quantity-sold": "30", "quantity-unsold": "70"},
    {"flower": "dandelion", "date": "2/3/2012", "quantity-sold": "10", "quantity-unsold": "0"},
    {"flower": "dandelion", "date": "2/4/2012", "quantity-sold": "9", "quantity-unsold": "11"},
    {"flower": "dandelion", "date": "2/5/2012", "quantity-sold": "3", "quantity-unsold": "17"},
    {"flower": "dandelion", "date": "2/6/2012", "quantity-sold": "4", "quantity-unsold": "16"},
    {"flower": "dandelion", "date": "2/7/2012", "quantity-sold": "7", "quantity-unsold": "8"},

    {"flower": "rose", "date": "2/3/2012", "quantity-sold": "50", "quantity-unsold": "40"},
    {"flower": "rose", "date": "2/4/2012", "quantity-sold": "43", "quantity-unsold": "47"}
    ]

    //convert json data to a group of objects
    var data = []

    //for checkbox values
    var allDates = {}
    var allFlowers = {}

    for(var d in jsonData){
        var row = {};
        row.flower = jsonData[d]["flower"]
        row.date = jsonData[d]["date"]
        row.sold = +jsonData[d]["quantity-sold"]
        row.unsold = +jsonData[d]["quantity-unsold"]
        data.push(row)
        if(!(row.flower in allFlowers)) { allFlowers[row.flower] = 1; }
        if(!(row.date in allDates)) { allDates[row.date] = 1; }
    }

    var dates = Object.keys(allDates);
    var flowers = Object.keys(allFlowers);
    

    function getList(data){
        return '<li><label class="checkbox"><input type="checkbox" checked id = "' + data +'" value="'+ data +'">' + data + '</label></li>'
    }
    for(var i in dates){
        var li = getList(dates[i]);
        $('#dates').append(li);
    }
    for(var i in flowers){
        var li = getList(flowers[i]);
        $('#flowers').append(li);
    }
    $('#soldOrUnsold').append((function(){return getList('sold')})());
    $('#soldOrUnsold').append((function(){return getList('unsold')})());

    var chosenDates = allDates;
    var chosenFlowers = allFlowers;
    var sold = true;
    var unsold = true;    

    $('#dates').change(function() {
        //get all checked dates
        var vals = {};
        $('#dates').find('input:checked').each(function() {
            vals[$(this).val()] = 1;
        });
        chosenDates = vals;

        drawGraph();
    });

    $('#flowers').change(function() {
        //get all checked flowers
        var vals = {};
        $('#flowers').find('input:checked').each(function() {
            vals[$(this).val()] = 1;
        });
        chosenFlowers = vals;

        drawGraph();
    });

    $('#soldOrUnsold').change(function() {
        //get sold or unsold
        if($( "#sold:checked" ).length === 0){
            sold = false;
        }else{
            sold = true;
        }
        if($( "#unsold:checked" ).length === 0){
            unsold = false;
        }else{
            unsold = true;
        }

        drawGraph();
    });

    //user input
    // var chosenDates = {'2/3/2012':1, '2/4/2012':1, '2/5/2012':1};
    // var chosenFlowers = {'rose':1, 'dandelion':1};
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(e) {
                console.log(e)
                //return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
            })
    //domain of x axis, dates
    //domain of xx axis, flowers
    //domain of y axis, sold, unsold or sold+unsold
    //domain of color, flower, either sold or unsold
    function drawGraph(){

        $('.chart').html("");

        var displayData = getDisplayData(chosenDates,chosenFlowers,sold,unsold);

        var displayDataArray = []
        for(var date in displayData){
            if(date != "height"){
                displayDataArray.push({date: date, value: displayData[date]});
            }       
        }

        var legendData = []
        Object.keys(allFlowers).slice().map(function(d){ legendData.push(d+'(sold)') });
        Object.keys(allFlowers).slice().map(function(d){ legendData.push(d+'(unsold)')});

        var color = {};
        var colorCandidates = ["#98abc5", "#dd4488", "#8a89a6", "#ffddee", "#7b6888", "#eebbdd", "#bb3377"];
        for(var i in legendData){
            color[legendData[i]] = colorCandidates[i];
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
            .domain(Object.keys(chosenDates))
            .rangeBands([10, width-100]);

        var xx = d3.scale.ordinal()
                .domain(Object.keys(chosenFlowers))
                .rangeRoundBands([30, x.rangeBand()-30]);

        var y = d3.scale.linear()
            .domain([0, displayData.height])
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
            .data(displayDataArray)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { 
            return "translate(" + x(d.date) + ",0)"; 
        });

        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("a simple tooltip");

        var bars = group.selectAll(".bar")
            .data(function(d) { return  convertToArray(d.value);})
            .enter().append("rect")
            .attr("class", "bar")
            .attr("width", xx.rangeBand())
            .attr("x", function(d) { return xx(d['flower']); })
            .attr("y", function(d) { return y(d.top); })
            .attr("height", function(d) { return y(d.bottom) - y(d.top); })
            .style("fill", function(d,i) { 
                if(d.hasOwnProperty('sold')){
                    return color[d.flower+'(sold)']; 
                }else{
                    return color[d.flower+'(unsold)'];  
                }               
            }) 
            .on("mouseover", function(){
                var bar = d3.select(this).style({opacity:0.8});
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(d){
                tooltip.text((d.sold? ("sold "+d.flower+": "+d.sold) : ("unsold " +d.flower+ ": " +d.unsold)));
                return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function(){
                var bar = d3.select(this).style({opacity:1.0});
                return tooltip.style("visibility", "hidden");
            });
            // .on('mouseover', function(d) {tip.show()})
            // .on('mouseout', function(d) {tip.hide()})   

        var legend = chart.selectAll(".legend")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width -24)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) {return color[d]});

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    }

    function getDisplayData(chosenDates, chosenFlowers, sold, unsold){
        var result = {}
        var maxHeight = 0
        for(var i in data){
            var row = data[i];
            // console.log(row.date+': ' + (row.date in chosenDates))
            // console.log(row.flower+': ' + (row.flower in chosenFlowers))
            if(row.date in chosenDates && row.flower in chosenFlowers){
                if(!(row.date in result)){ result[row.date] = {}; }
                if(!(row.flower in result[row.date])){ result[row.date][row.flower] = []; }
                
                if(sold && unsold){            
                    result[row.date][row.flower].push({bottom:0, top:row.sold, sold:row.sold});
                    result[row.date][row.flower].push({bottom:row.sold, top:row.sold+row.unsold, unsold:row.unsold});
                    if(row.sold+row.unsold > maxHeight){ maxHeight = row.sold+row.unsold;}
                }else if(sold){
                    result[row.date][row.flower].push({bottom:0, top:row.sold, sold:row.sold});
                    if(row.sold > maxHeight){ maxHeight = row.sold;}
                }else if(unsold){
                    result[row.date][row.flower].push({bottom:0, top:row.unsold, unsold:row.unsold});
                    if(row.unsold > maxHeight){ maxHeight = row.unsold;}
                }
            }
        }
        result.height = maxHeight;
        return result;
    }

    //convert a nested object to an array of key-value pairs
    function convertToArray(O){
        var result = []
        for(var key1 in O){
            for(var i in O[key1]){
                var kv = {};
                kv.flower = key1;   
                var obj = O[key1][i];
                for(var key2 in obj){
                    //console.log(key2);
                    kv[key2+''] = obj[key2]
                }
                result.push(kv);             
            }
        }
        //console.log(result);
        return result;
    }


    drawGraph();
// })();
