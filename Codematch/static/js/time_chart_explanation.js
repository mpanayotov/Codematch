$(".chart-label").on('mouseover', function(event){
	var text = getChartFieldInfo($(this).html().trim());
		 var el = "<div class='chart-explanation'>"+text+"</div>";
		 $("#chart").append(el);
		 
   });

$(".chart-label").on('mouseout', function(event){
		 $(".chart-explanation").remove();
   });
   
function getChartFieldInfo(field)
{
	if(field == "Documentation")
		return "Documentation - Explanation and commentary of code and engineering tasks to aid other's understanding.";
	if(field == "Data Science")
		return "Data science - Live experimentation to test system hypothesis for use when iterating on further releases.";
	if(field == "Analysis")
		return "Analysis - Determining and capturing the requirements of a system.";
	if(field == "Architecture")
		return "Architecture - High level design and planning of a system to satisfy the requirements of the system.";
	if(field == "Code Review")
		return "Code review - Reading and updating code to improve readability, maintainability and its performance.";
	if(field == "Operations")
		return "Operations - Encompasses system provisioning, automation and administration to facilitate engineering tasks.";
	if(field == "Testing")
		return "Testing - Writing and running a series of experiments to demonstrate correct performance of application under different scenarios.";
	if(field == "UI/UX")
		return "UI/UX - Building the look and the feel of the application.";
	if(field == "Front-End")
		return "Front-end - Building the client-side of the application.";
	if(field == "Back-End")
		return "Back-end - Building the server-side application and interfaces.";
	return "";
}
