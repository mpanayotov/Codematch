function balanceTimeChart()
{
	var rightBalance = 100;
	//check for default values
	var changed = false;
	for (var i=0; i < time_options.length; i++) {
	  if (time_options[i].default == 0)
	  {
	  	changed = true;
	  	break;
	  }
	};
	if (!changed)
	{
		alert("Please pick how you want to spend your time during work.");
		return false;
	}
	var sum = 0;
	for (var i=0; i < time_options.length; i++) {
			sum += Math.floor(Math.abs(time_options[i].value));
	};
	// default values are set to 5, so if it combined sum is less than 50
	// encourage users to change that
	if(sum<50)
	{
		alert("Please pick how you want to spend your time during work.");
		return false;
	}
	else
	{
		var axisToBalance = time_options.filter(function(el){if(!el.default) return el;});
		var sumValues = 0;
		for (var i=0; i < axisToBalance.length; i++) {
			sumValues += Math.floor(Math.abs(axisToBalance[i].value));
		};
		sumValues = Math.floor(sumValues);
		var difference = rightBalance - sumValues;
		var sumOfAxisToChange = 0;
		for (var i=0; i < axisToBalance.length; i++) {
		  	sumOfAxisToChange += Math.floor(Math.abs(axisToBalance[i].value));
		};
		for (var i=0; i < axisToBalance.length; i++) {
		  	var ratio = Math.floor(Math.abs(axisToBalance[i].value))/sumOfAxisToChange;
		  	changeAxisPointValues(ratio, axisToBalance[i], difference);
		};
		reDrawPolygon();
		$("circle").hide();
	}
	return true;
}

function changeAxisPointValues(ratio, axis, difference)
{
	var x = $("#editPosition").find("circle[data-id='"+axis.axis+"']").attr("cx");
	var y = $("#editPosition").find("circle[data-id='"+axis.axis+"']").attr("cy");
	var newValue = Math.abs(Math.floor(Math.abs(axis.value)) + ratio*difference);
	axis.value = newValue;
	var position = positionForValue(newValue);
	axis.position = position;
	axis.key = 3;
	console.log(newValue+" "+position);
	var newX = options.w/2*(1-(parseFloat(Math.max(position, 0))/options.maxValue)*options.factor*Math.sin(axis.order*options.radians/time_options.length));
    var newY = options.h/2*(1-(parseFloat(Math.max(position, 0))/options.maxValue)*options.factor*Math.cos(axis.order*options.radians/time_options.length));
	axis.x = newX;
	axis.y = newY;
	$("#editPosition").find("circle[data-id='"+axis.axis+"']").attr({"cx":newX, "cy":newY});
}

function positionForValue(val)
{
	//65 - 17- 7 -6 -5
	if(0 <= val && val <= 20)
	{
		return val*65/20;
	}
	if(20 < val && val <= 50)
	{
		//return val*82/50;
		return 65 + val*17/50;
	}
	if(50 < val && val <= 70)
	{
		return 82 + val*7/70;
	}
	if(70 < val && val <= 90)
	{
		return  89 + val*6/90;
	}
	if(90 < val && val <= 100)
	{
		return 95 + val*5/100;
	}
	
}
/*
function changeAxisPointValues2(ratio, axis, difference)
{
	var x = $("circle[data-id='"+axis.axis+"']").attr("cx");
	var y = $("circle[data-id='"+axis.axis+"']").attr("cy");
	var distance = calcDistance(x-options.h/2, y-options.h/2);
	if (difference>0)
		var newDist = distance + ratio*difference*((options.h/2)/100);
	else
		var newDist = distance + ratio*difference;
	if(newDist > options.h/2)
		newDist = options.h/2;
	var newDistValue = (newDist*axis.value)/distance;
	axis.value = newDistValue;
	var newX = options.w/2*(1-(parseFloat(Math.max(newDistValue, 0))/options.maxValue)*options.factor*Math.sin(axis.order*options.radians/time_options.length));
    var newY = options.h/2*(1-(parseFloat(Math.max(newDistValue, 0))/options.maxValue)*options.factor*Math.cos(axis.order*options.radians/time_options.length));
	$("circle[data-id='"+axis.axis+"']").attr({"cx":newX, "cy":newY});
}
*/
function reDrawPolygon()
{
	var points = "";
	for (var i=0; i < time_options.length; i++) {
	  points += $("#editPosition").find("circle[data-id='"+time_options[i].axis+"']").attr("cx")+","+$("#editPosition").find("circle[data-id='"+time_options[i].axis+"']").attr("cy")+" ";
	};
	//$("polygon.radar-chart-serie0").attr("points", points);
	$("#editPosition").find("polygon.radar-chart-serie0").attr("points", points);
	//sumValues()
}

function calcDistance(x,y){
	return Math.sqrt(x*x + y*y);
}

function sumValues()
{
	var sumValues = 0;
	for (var i=0; i < time_options.length; i++) {
	  sumValues += time_options[i].value;
	};
	//$(".sum").html(sumValues);
}