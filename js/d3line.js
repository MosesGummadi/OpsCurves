var obj_arr=[];
var tooltip="";

$(document).ready(function(e) {

	
	$("#submit_btn").on("click",function(){
		
		var rb_rate=Number($("#rb_rate").val());
		var to_p_time=Number($("#to_p_time").val());
		var Throughput=Number($("#Throughput").val());
		var flow_time=Number($("#flow_time").val());
		var wo_wip=Number($("#wo_wip").val());
		var wip_prog=Number($("#wip_prog").val());
		var chart_range=Number($("#chart_range").val());
		
		if(rb_rate&&to_p_time&&Throughput&&flow_time&&wo_wip&&wip_prog&&chart_range){
			
			var th_pwc,th,ct_pwc,ct;
			
			obj_arr=[];
			
			for(var w=1;w<=chart_range;w++){
			
				th_pwc=((rb_rate*w)/(w+wo_wip-1)).toFixed(8);
				th=Math.min(w/to_p_time,rb_rate).toFixed(8);
				ct=Math.max(to_p_time,w/rb_rate).toFixed(1);
				ct_pwc=(w/th_pwc).toFixed(1);
				
				obj_arr.push({"w":Number(w), "th_pwc":Number(th_pwc), "th":Number(th), "ct_pwc":Number(ct_pwc), "ct":Number(ct)});
			
			}
			
			
			draw_1st_chart();
			draw_2nd_chart();
			
		}
		
		else{
			alert("Please enter the required values");
		}
	});
	
	$("#rb_rate,#to_p_time").on("keyup change",function(){
		
		var rb_rate=$("#rb_rate").val();
		var to_p_time=$("#to_p_time").val();
		
		if(rb_rate&&to_p_time){
			
			$("#wo_wip").val(rb_rate*to_p_time);
		}
		else{
			
			$("#wo_wip").val("");
		}
		
		
	});
	
	
	$("#Throughput,#wip_prog").on("keyup change",function(){
		
		var Throughput=$("#Throughput").val();
		var wip_prog=$("#wip_prog").val();
		
		if(Throughput&&flow_time){
			
			$("#flow_time").val(wip_prog/Throughput);
		}
		else{
			
			$("#flow_time").val("");
		}
		
		
	});
	
	$("#flow_time").on("keyup change",function(){
		
		var Throughput=$("#Throughput").val();
		var flow_time=$("#flow_time").val();
		
		if(Throughput&&flow_time){
			
			$("#wip_prog").val(flow_time*Throughput);
		}
		else{
			
			$("#wip_prog").val("");
		}
	});
	
	
	
	$("#to_p_time,#Throughput").trigger("change");
	$("#submit_btn").trigger("click");

	
	
	 // append the tooltip DOM element
	 tooltip = d3.select("body").append("div")
		.attr("id", "tooltip")
		.attr("class", "tooltip")
		.style("position", "absolute")
		.style("opacity", 0);
	
});



	
function draw_1st_chart(){	
	

	var dataset=[];
	var dataset2=[];
	
	$.map(obj_arr,function(element,index){
		dataset.push({"x":element.w,"y":element.th_pwc});
		dataset2.push({"x":element.w,"y":element.th});
	});
	
	var th_pwc=d3.max(obj_arr,function(d){return d.th_pwc;});
	var th=d3.max(obj_arr,function(d){return d.th;});
		
	var max_y=th_pwc>th?th_pwc:th;
	
	var throughput=Number($("#Throughput").val());
	var wip_prog=Number($("#wip_prog").val());
	var n = Number($("#chart_range").val());
	
	if(max_y<throughput){
		max_y=throughput;
	}
	
	if(wip_prog>n){
		n=wip_prog;
	}
	
	
	// 2. Use the margin convention practice 
var margin = {top: 50, right: 50, bottom: 60, left: 50}
  , width = 800 - margin.left - margin.right // Use the window's width 
  , height = 500 - margin.top - margin.bottom; // Use the window's height


var xScale = d3.scaleLinear()
    .domain([1, n])
    .range([0, width]); 


var yScale = d3.scaleLinear()
    .domain([0, (Number(max_y)+1)]) 
    .range([height, 0]);  
	
	
// define the area
var area = d3.area()
    .x(function(d) { return xScale(d.x); })
    .y0(height)
    .y1(function(d) { return yScale(d.y); });	


var line = d3.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); }) 
    .curve(d3.curveMonotoneX) 

$(".placeSvg1").empty();

var svg = d3.select(".placeSvg1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 svg.append("g")
        .attr("transform", "translate(" + 360 + "," + (-20) + ")")
        .append("text")
        .style("font-size", "22px")
        .attr("text-anchor", "middle")
        .text("Throughput vs WIP");
		
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); 

	svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); 

	// add the area #c4e4fe (light blue) #fecfc4 (light red)
    svg.append("path")
       .datum(dataset2)
       .attr("class", "area")
       .attr("d", area)
	   .attr("fill","#c4e4fe");
	// add the area
    svg.append("path")
       .datum(dataset)
       .attr("class", "area")
       .attr("d", area)
	   .attr("fill","#fecfc4");
	   
	   
	svg.append("path")
    .datum(dataset) 
    .attr("class", "line")
    .attr("d", line) 
	.style("stroke", "#f44336");
	
	   
	svg.append("path")
    .datum(dataset2)
    .attr("class", "line") 
    .attr("d", line)
	.style("stroke","#0088cc");


  svg.selectAll(".dot")
  .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d) { return xScale(d.x) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 3)
	.style("fill","#0088cc")
	.style("opacity",0)
	.on("mouseover", function(d) { // onMouseOver() - expand the circle, set and show the tooltip
                   
	  tooltip.html("<strong>TH (marginal)</strong><br/>" + "Point(" + d.x + ", " + d.y+")")
		  .style("left", (d3.event.pageX-100) + "px")
		  .style("top", (d3.event.pageY-60) + "px");
	  // fadeIn the tooltip
	  tooltip.transition()
		  .duration(100)
		  .style("opacity", 0.9);
		  
    })
	.on("mouseout", function(d) {
		
		 tooltip.transition()
		  .duration(100)
		  .style("opacity", 0);
	});
	
  svg.selectAll(".dot2")
  .data(dataset2)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot2") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(d.x) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 3)
	.style("fill","#0088cc")
	.style("opacity",0)
	.on("mouseover", function(d) { // onMouseOver() - expand the circle, set and show the tooltip
                   
	  tooltip.html("<strong>TH</strong><br/>" + "Point(" + d.x + ", " + d.y+")")
		  .style("left", (d3.event.pageX-100) + "px")
		  .style("top", (d3.event.pageY-60) + "px");
	  // fadeIn the tooltip
	  tooltip.transition()
		  .duration(100)
		  .style("opacity", 0.9);
		  
    })
	.on("mouseout", function(d) {
		
		 tooltip.transition()
		  .duration(100)
		  .style("opacity", 0);
	});	
	
	
	
	svg.append("circle")
	.attr("class", "dot")
	.attr("cx",xScale(wip_prog))
	.attr("cy",yScale(throughput))
	.style("fill","#000")
	.attr("r", 5)
	.on("mouseover", function(d) { // onMouseOver() - expand the circle, set and show the tooltip
                   
	  tooltip.html("<strong>Current State</strong><br/>" + "Point(" + wip_prog + ", " + throughput+")")
		  .style("left", (d3.event.pageX-100) + "px")
		  .style("top", (d3.event.pageY-60) + "px");
	  // fadeIn the tooltip
	  tooltip.transition()
		  .duration(100)
		  .style("opacity", 0.9);
		  
    })
	.on("mouseout", function(d) {
		
		 tooltip.transition()
		  .duration(100)
		  .style("opacity", 0);
	});
	
	
	var legends_data=["TH (best case)","TH (marginal)"];
	var colorLine=["#0088cc","#f44336","#000"];
	
	var legend=d3.select(".placeSvg1").select("svg")
	.append("g")
	.attr("transform","translate(180,"+(height+95)+")")
	.selectAll(".legends_rect")
	.data(legends_data)
	.enter()
	.append("g")
	.attr("class",'legends legends_rect')
	.attr("id","legend_div")
	.attr("transform",function(d,i){return "translate("+(i*160)+",0)";})
	.attr("data-id",function(d,i){return i+1;});
	
	legend.append("rect")
	//.attr("id","legend_div")
	//.attr("y", function(d,i){return 20*i;})
	//.attr("class",'legends_rect')
	.attr("height",5)
	.attr("width",40)
	.style("fill",function(d,i){return colorLine[i];});
	
	legend.append("text")
	.attr("dy",6)
	.attr("dx",45)
	.attr("text-anchor","start")
	.text(function(d){return d;});
	
	
	var legends_data=["Current State"];
	var colorLine=["#000"];
	
	var legend=d3.select(".placeSvg1").select("svg")
	.append("g")
	.attr("transform","translate(500,"+(height+96)+")")
	.selectAll(".legends_circle")
	.data(legends_data)
	.enter()
	.append("g")
	.attr("class",'legends legends_circle')
	.attr("id","legend_cir_div")
	.attr("transform",function(d,i){return "translate("+(i*110)+",0)";})
	.attr("data-id",function(d,i){return i+1;});
	
	legend.append("circle")
	//.attr("id","legend_div")
	//.attr("y", function(d,i){return 20*i;})
	//.attr("class",'legends_rect')
	.attr("r",5)
	.style("fill",function(d,i){return colorLine[i];});
	
	legend.append("text")
	.attr("dy",5)
	.attr("dx",10)
	.attr("text-anchor","start")
	.text(function(d){return d;});
	
}




function draw_2nd_chart(){	
	

	var dataset=[];
	var dataset2=[];
	
	$.map(obj_arr,function(element,index){
		dataset.push({"x":element.w,"y":element.ct_pwc});
		dataset2.push({"x":element.w,"y":element.ct});
	});
	
	var ct_pwc=d3.max(obj_arr,function(d){return Number(d.ct_pwc);});
	var ct=d3.max(obj_arr,function(d){return Number(d.ct);});
	
	
	var max_y=ct_pwc>ct?ct_pwc:ct;
	
	var throughput=Number($("#flow_time").val());
	var wip_prog=Number($("#wip_prog").val());
	var n = Number($("#chart_range").val());
	
	if(max_y<throughput){
		max_y=throughput;
	}
	
	if(wip_prog>n){
		n=wip_prog;
	}
	
	
	// 2. Use the margin convention practice 
var margin = {top: 50, right: 50, bottom: 60, left: 50}
  , width = 800 - margin.left - margin.right // Use the window's width 
  , height = 500 - margin.top - margin.bottom; // Use the window's height


var xScale = d3.scaleLinear()
    .domain([1, n])
    .range([0, width]); 


var yScale = d3.scaleLinear()
    .domain([0, (Number(max_y)+1)]) 
    .range([height, 0]);  


// define the area
var area = d3.area()
    .x(function(d) { return xScale(d.x); })
    .y0(height)
    .y1(function(d) { return yScale(d.y); });	
	
// define the area
var area2 = d3.area()
    .x(function(d) { return xScale(d.x); })
    .y0(0)
    .y1(function(d) { return yScale(d.y); });
	
	
var line = d3.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); }) 
    .curve(d3.curveMonotoneX); 


$(".placeSvg2").empty();

var svg = d3.select(".placeSvg2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 svg.append("g")
        .attr("transform", "translate(" + 370 + "," + (-20) + ")")
        .append("text")
        .style("font-size", "22px")
        .attr("text-anchor", "middle")
        .text("Flow Time vs WIP");
	// add the area #c4e4fe (light blue) #fecfc4 (light red)
	svg.append("path")
       .datum(dataset)
       .attr("class", "area")
       .attr("d", area2)
	   .attr("fill","#fecfc4");
	   
	// add the area
    svg.append("path")
       .datum(dataset)
       .attr("class", "area")
       .attr("d", area)
	   .attr("fill","#c4e4fe");
	   
	// add the area
    svg.append("path")
       .datum(dataset2)
       .attr("class", "area")
	   .attr("transform","translate(0,0)")
       .attr("d", area)
	   .attr("fill","#fff");
	   

svg.append("path")
    .datum(dataset) 
    .attr("class", "line")
    .attr("d", line) 
	.style("stroke", "#f44336");
	
	svg.append("path")
    .datum(dataset2)
    .attr("class", "line") 
    .attr("d", line)
	.style("stroke","#0088cc");
	

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); 

svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); 	


  svg.selectAll(".dot")
  .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d) { return xScale(d.x) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 3)
	.style("fill","#0088cc")
	.style("opacity",0)
	.on("mouseover", function(d) { // onMouseOver() - expand the circle, set and show the tooltip
                   
	  tooltip.html("<strong>CT (marginal)</strong><br/>" + "Point(" + d.x + ", " + d.y+")")
		  .style("left", (d3.event.pageX-100) + "px")
		  .style("top", (d3.event.pageY-60) + "px");
	  // fadeIn the tooltip
	  tooltip.transition()
		  .duration(100)
		  .style("opacity", 0.9);
		  
    })
	.on("mouseout", function(d) {
		
		 tooltip.transition()
		  .duration(100)
		  .style("opacity", 0);
	});
	
  svg.selectAll(".dot2")
  .data(dataset2)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot2") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(d.x) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 3)
	.style("fill","#0088cc")
	.style("opacity",0)
	.on("mouseover", function(d) { // onMouseOver() - expand the circle, set and show the tooltip
                   
	  tooltip.html("<strong>CT</strong><br/>" + "Point(" + d.x + ", " + d.y+")")
		  .style("left", (d3.event.pageX-100) + "px")
		  .style("top", (d3.event.pageY-60) + "px");
	  // fadeIn the tooltip
	  tooltip.transition()
		  .duration(100)
		  .style("opacity", 0.9);
		  
    })
	.on("mouseout", function(d) {
		
		 tooltip.transition()
		  .duration(100)
		  .style("opacity", 0);
	});	
	
	
	
	svg.append("circle")
	.attr("class", "dot")
	.attr("cx",xScale(wip_prog))
	.attr("cy",yScale(throughput))
	.style("fill","#000")
	.attr("r", 5)
	.on("mouseover", function(d) { // onMouseOver() - expand the circle, set and show the tooltip
                   
	  tooltip.html("<strong>Current State</strong><br/>" + "Point(" + wip_prog + ", " + throughput+")")
		  .style("left", (d3.event.pageX-100) + "px")
		  .style("top", (d3.event.pageY-60) + "px");
	  // fadeIn the tooltip
	  tooltip.transition()
		  .duration(100)
		  .style("opacity", 0.9);
		  
    })
	.on("mouseout", function(d) {
		
		 tooltip.transition()
		  .duration(100)
		  .style("opacity", 0);
	});
	
	
	var legends_data=["FT (best case)","FT (marginal)"];
	var colorLine=["#0088cc","#f44336","#000"];
	
	var legend=d3.select(".placeSvg2").select("svg")
	.append("g")
	.attr("transform","translate(180,"+(height+95)+")")
	.selectAll(".legends_rect")
	.data(legends_data)
	.enter()
	.append("g")
	.attr("class",'legends legends_rect')
	.attr("id","legend_div")
	.attr("transform",function(d,i){return "translate("+(i*160)+",0)";})
	.attr("data-id",function(d,i){return i+1;});
	
	legend.append("rect")
	.attr("height",5)
	.attr("width",40)
	.style("fill",function(d,i){return colorLine[i];});
	
	legend.append("text")
	.attr("dy",6)
	.attr("dx",45)
	.attr("text-anchor","start")
	.text(function(d){return d;});
	
	
	var legends_data=["Current State"];
	var colorLine=["#000"];
	
	var legend=d3.select(".placeSvg2").select("svg")
	.append("g")
	.attr("transform","translate(500,"+(height+96)+")")
	.selectAll(".legends_circle")
	.data(legends_data)
	.enter()
	.append("g")
	.attr("class",'legends legends_circle')
	.attr("id","legend_cir_div")
	.attr("transform",function(d,i){return "translate("+(i*110)+",0)";})
	.attr("data-id",function(d,i){return i+1;});
	
	legend.append("circle")
	.attr("r",5)
	.style("fill",function(d,i){return colorLine[i];});
	
	legend.append("text")
	.attr("dy",5)
	.attr("dx",10)
	.attr("text-anchor","start")
	.text(function(d){return d;});
	
}

