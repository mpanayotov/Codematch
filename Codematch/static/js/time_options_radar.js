var options = {
		      radius: 4,    // 點的半徑
		      w: 350,
		      h: 350,
		      factor: 1,    // 框的縮放比例
		      factorLegend: 0.8,
		      levels: 1,    // 幾層框
		      maxValue: 100,
		      radians: 2 * Math.PI,
		      opacityArea: 0.5,
		      color: d3.scale.category10()
		    };

var MovableRadarChart = {
  draw: function(id, d, options, intersect){
    var cfg = {
      radius: 4,    // 點的半徑
      w: 450,
      h: 450,
      factor: 1,    // 框的縮放比例
      factorLegend: 0.8,
      levels: 1,    // 幾層框
      maxValue: 100,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      color: d3.scale.category10()
    };
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }

    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d.map(function(o){return o.value}))); 
    var allAxis = (d.map(function(i, j){return i.axis}));
    var total = allAxis.length;    
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);

    // 初始化畫布    
    d3.select(id).select("svg").remove();
    var g = d3.select(id).append("svg").attr("width", cfg.w).attr("height", cfg.h).append("g");

    var tooltip;

    drawFrame();
    var maxAxisValues = []; // 儲存該坐標軸的最大 x, y
    drawAxis();
    var dataValues = [];
    reCalculatePoints();
    
    var areagg = initPolygon();
    drawSpecialPolygons(maxAxisValues);
    drawPoly();
	drawnode();
	
	if('undefined' !== typeof intersect){
      drawIntersectPolygon();
    }

    // 框
    function drawFrame(){
      for(var j=0; j<cfg.levels; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels").data(allAxis).enter().append("svg:line")
         .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
         .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
         .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
         .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
         .attr("class", "line").style("stroke", "grey").style("stroke-width", "0.5px").attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");;
      }
    }

    // 坐標軸
    function drawAxis(){
      var axis = g.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");
      axis.append("line")
          .attr("x1", cfg.w/2)
          .attr("y1", cfg.h/2)
          .attr("x2", function(j, i){
            maxAxisValues[i] = {x:cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total)), y:0};
            return maxAxisValues[i].x;
          })
          .attr("y2", function(j, i){
            maxAxisValues[i].y = cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
            return maxAxisValues[i].y;
          })
          .attr("class", "line").style("stroke", "grey").style("stroke-width", "1px");
		
      axis.append("text").attr("class", "legend")
          .text(function(d){return d}).style("font-family", "sans-serif").style("font-size", "10px").attr("transform", function(d, i){return "translate(0, -10)";})
          .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-20*Math.sin(i*cfg.radians/total);})
          .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))+20*Math.cos(i*cfg.radians/total);});
    }
	
	function drawSpecialPolygons(values)
	{
		for (var i=0; i < values.length; i=i+2) {
		  	var points = values[i].x +","+ values[i].y +" " +cfg.h/2+","+cfg.w/2+" "+values[i+1].x +","+ values[i+1].y;
		  	var el = $(id+" polygon.radar-chart-serie0").clone();
		  	//console.log($(id+" polygon.radar-chart-serie0"));
		  	el.attr("class","special-shape");
		  	el.attr("points", points);
	 	 	$(id+" svg").append(el);
		};
	}
	
	function drawIntersectPolygon()
	{
		var points = "";
		for (var i=0; i < intersect.length; i=i+1) {
			var x = cfg.w/2*(1-(parseFloat(Math.max(intersect[i].value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
            var y = cfg.h/2*(1-(parseFloat(Math.max(intersect[i].value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
		  	points += x +","+ y +" ";
		};
		var el = $(id+" polygon.radar-chart-serie0").clone();
		  	//console.log($(id+" polygon.radar-chart-serie0"));
		el.attr("class","intersect");
		el.attr("points", points);
	 	$(id+" svg").append(el);
	}
	
    // 根據輸入的資料計算多邊形要畫的點
    function reCalculatePoints(){
      g.selectAll(".nodes")
        .data(d, function(j, i){
        	var x = cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
            var y = cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
          	dataValues[i] = [x,y];
          	j["x"]=x;
          	j["y"]=y;
        });
      dataValues[d[0].length] = dataValues[0];
    }
    
    function initPolygon(){
      return g.selectAll("area").data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie0")
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(0))
                .on('mouseover', function (d){
                  z = "polygon."+d3.select(this).attr("class");
                  g.selectAll("polygon").transition(200).style("fill-opacity", 0.1); 
                  g.selectAll(z).transition(200).style("fill-opacity", 0.7);
                })
                .on('mouseout', function(){
                  g.selectAll("polygon").transition(200).style("fill-opacity", cfg.opacityArea);
                })
                .style("fill", function(j, i){return cfg.color(0);})
                .style("fill-opacity", cfg.opacityArea);
    }

    // 畫多邊形
    function drawPoly(){
      areagg.attr("points",function(de) {
          var str="";
          for(var pti=0;pti<de.length;pti++){
            str=str+de[pti][0]+","+de[pti][1]+" ";
          }        
          return str;
        });
    }
	
    // 畫點 n(){this.on("mousedown.drag",i).on("touchstart.drag",a)}
    function drawnode(){  
         d3.select(id+" svg").selectAll(".nodes")
        .data(d).enter()
        .append("svg:circle")//.attr("class", "radar-chart-serie0")
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0);})
        .attr("cx", function(j, i){
          return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.axis;})
        .style("fill", cfg.color(0)).style("fill-opacity", 0.9)
        /*.on('mouseover', function (d){
                    newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                    newY =  parseFloat(d3.select(this).attr('cy')) - 5;
                    //tooltip.attr('x', newX).attr('y', newY).text(Math.abs(d.value).toFixed(2)+"%").transition(200).style('opacity', 1);
                    z = "polygon."+d3.select(this).attr("class");
                    g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
                    g.selectAll(z).transition(200).style("fill-opacity", 0.7);
                  })
        .on('mouseout', function(){
                    tooltip.transition(200).style('opacity', 0);
                    g.selectAll("polygon").transition(200).style("fill-opacity", cfg.opacityArea);
                  })*/
        .call(d3.behavior.drag().on("drag", move))      // for drag & drop
        //.append("svg:title")
        .text(function(j){return Math.max(j.value, 0)});
        //setTimeout(function(){drawnode3();},1000);
    }

    //Tooltip
    tooltip = g.append('text').style('opacity', 0).style('font-family', 'sans-serif').style('font-size', 16);


    function move(dobj, i){
      this.parentNode.appendChild(this);
      var dragTarget = d3.select(this);
      var oldData = dragTarget.data()[0];
      oldData.default = 0;
      var value = oldData.value;
      // 進行座標位移歸零，以方便計算斜率
      var oldX = parseFloat(dragTarget.attr("cx")) - cfg["w"]/2;
      var oldY = cfg["w"]/2 - parseFloat(dragTarget.attr("cy"));
      var newY = 0, newX = 0, newValue = 0;
	  var maxX = maxAxisValues[i].x - cfg["w"]/2;
      var maxY = cfg["w"]/2 - maxAxisValues[i].y;
      
      // 斜率為無限大的特殊情況
      if(oldX == 0) {
        newY = oldY - d3.event.dy;
        // 檢查是否超過範圍
		if(value <= 0)
		{
			if(newY < 0)
				newY = -0.0000000001;
			else
				newY = 0.0000000001;
		}
        if(Math.abs(newY) > Math.abs(maxY)) {
          newY = maxY;
        }
        newValue = (newY/oldY) * oldData.value;
      }
      else
      {
        var slope = oldY / oldX;   // 斜率       
        newX = d3.event.dx + parseFloat(dragTarget.attr("cx")) - cfg["w"]/2;
        // 檢查是否超過範圍
        if(value <= 0)
		{
			if(newX < 0)
				newX = -0.0000000001;
			else
				newX = 0.00000000001;
		}
        if(Math.abs(newX) > Math.abs(maxX)) {
          newX = maxX;
        }
        newY = newX * slope;

        var ratio = newX / oldX; // 利用相似三角形等比的概念計算新的值
        newValue = ratio * oldData.value;
      }
      
      // 重新設定點的座標
      dragTarget
          .attr("cx", function(){return newX + cfg["w"]/2 ;})
          .attr("cy", function(){return cfg["w"]/2 - newY;});
      // 重新設定點的值
      d[oldData.order].value=newValue;
      // 重新計算多邊形的轉折點
      reCalculatePoints();
      // 重畫多邊形
      drawPoly();
    }

  }
};