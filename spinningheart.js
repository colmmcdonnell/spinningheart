// get the data	
d3.csv("data/spinningheart.csv", function(error, links) {
			
	var nodes = {};

	// process the incoming data
	links.forEach(function(link) {
	    link.source = nodes[link.source] || 
	        (nodes[link.source] = {name: link.source});
	    link.target = nodes[link.target] || 
	        (nodes[link.target] = {name: link.target});
	    link.value = +link.value;
	});
	
	var width = 900,
	    height = 600;

	var color = d3.scale.category20();

	var force = d3.layout.force()
	    // negative value results in node repulsion
	    .charge(-150)
	    // sets the target distance between linked
	    .linkDistance(275)
	    .size([width, height]);

	var svg = d3.select("#graph").append("svg")
	    .attr("width", width)
	    .attr("height", height);
				
	force.nodes(d3.values(nodes))
		.links(links)
		.start();
		
	// add the connections	
	var link = svg.selectAll(".link")
		.data(links)
		.enter().append("line")
		.attr("class", "link")
 		.style("stroke-width", function(d) { return Math.sqrt(d.value); });
						
	// create the groups					
	var node = svg.selectAll(".node")
		.data(force.nodes())
		.enter()
		.append("g")
		.attr("class", "node")
		.style("fill", function(d) { return color(d.group); })
		.call(force.drag);

	// assign a circle to each group
	node.append("circle")
		.attr("r", 5);
	
	node.append("text")
	.attr({
	    "x": 12,
	    "y": ".35em",
	    "class":"nodelabel",
        "stroke":"grey"
        })
		.text(function(d) { return d.name; });

	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });

		node
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
		
		node
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });		
	});
});