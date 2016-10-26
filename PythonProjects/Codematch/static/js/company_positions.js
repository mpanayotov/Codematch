var time_options = [];
function getPositions()
{
	 $.ajax({
                url: "/company/getpositions/",
                type: "GET",
                success: function(data) {
                	positions = data;
                	renderPositions();
                },
                error: function(data) {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
}

function renderPositions()
{
	if(positions.length == 0) $(".center-notification").show();
	for (var i=0; i < positions.length; i++) {
	  	var p = $(".position-default").clone();
	  	p.removeClass("position-default");
	  	p.attr("position-key", positions[i].pk);
		p.find(".chart").attr("id", "chart-position-"+positions[i].pk);
		p.find(".editbtn").attr("position-key", positions[i].pk);
		if(positions[i].fields.purpose != null)
		{
			p.find(".position-options").html("");
			if(positions[i].fields.purpose == "batch")
				p.find(".position-options").append("<div class='position-status text-center'>BATCH active</div>");
			if(positions[i].fields.purpose == "outside_batch")
				p.find(".position-options").append("<div class='position-status text-center'>PUBLISHED</div>");
		}
		else
			p.find(".publishbtn").attr("position-key", positions[i].pk);
	  	$(".wrapper").append(p);
	  	
	  	data = getJsonData(positions[i].fields.time_preferences);
	  	data = data.map(function(el){ el.value = el.position; return el;});
	  	MovableRadarChart.draw("#chart-position-"+positions[i].pk, data, {h:140, w:140, radius:0});
	  	var skillsJson = JSON.parse(positions[i].fields.tech_skills);
	  	techSkills = [];
		for (var key in skillsJson) {
		  techSkills += "<a class='btn btn-default btn-lg tech'><i class='devicon-"+key+"'></i><span key='"+key+"' class='network-name'>"+skillsJson[key]+"</span></a>";
		};
		p.find(".position-stack").html(techSkills);
		positionDetails = "<a class='btn btn-default btn-lg exp-lvl exp-original'><span class='network-name'>"+positions[i].fields.exp_level+"</span></a>"+
		"<a class='btn btn-default btn-lg worktype worktype-original'><span class='network-name'>"+positions[i].fields.work_type+"</span></a>";
					
		p.find(".position-details").html(positionDetails);
		p.find(".position-title").html(positions[i].fields.title);
		p.find(".position-salary").html("Max.Salary: &#8364 "+positions[i].fields.salary+"k / yr");
		p.find(".project-description").html(positions[i].fields.project_description);
	  	p.show();
	};
	
	enableEditOption();
	enablePublishOption();
}

function getJsonData(stringData)
{
	var arr = stringData.substring(1,stringData.length-1).split("},");
      arr = arr.map(function(el){
      			if(el[el.length-1] != "}")
      				return el+"}";
      			else
      				return el;
      });
      var options = [];
      for (var i=0; i < arr.length; i++) {
			options.push(JSON.parse(arr[i]));
		};
	console.log(options);
	return options;
}

function enableEditOption(){
	$(".editbtn").on('click', function(event){
		var editDiv = $("#editPosition");
		editDiv.modal("show");
		var key = $(this).attr("position-key");
		$("#edit-position-chart").html("");
		var position = positions.filter(function(el){ return el.pk == key;})[0];
		time_options = getJsonData(position.fields.time_preferences);
		console.log(time_options);
	  	time_options = time_options.map(function(el){ el.value = el.position; return el;});
	  	options.h=240; options.w=240; options.radius=4;
	  	MovableRadarChart.draw(".edit-position-chart", time_options, options);
	  	var el = $(".position[position-key='"+position.pk+"']");
	  	var tech_skills = el.find(".position-stack").clone();
	  	tech_skills.find(".tech").addClass("chosenTech");
	  	$(".skills-counter").html("5/5");
	  	$(".techSkillHolder").html(tech_skills.html());
	  	activateRemoveFunction();
	  	$(".salaryRange").val(position.fields.salary).change();
	  	var work_type = el.find(".worktype-original").clone();
	  	editDiv.find(".worktype-holder").html(work_type);
	  	var exp_lvl = el.find(".exp-lvl").clone();
	  	editDiv.find(".exp-level").html(exp_lvl);
	  	var title = el.find(".position-title").html();
	  	editDiv.find(".title-edit").html(title);
	  	var description = el.find(".project-description").html();
	  	editDiv.find(".work-description").html(description);
	  	editDiv.find(".save-edit").attr("position-key", key);
	  	$(".chart-label").css("font-size", "12px");
   });
}

function enableSkillSelection(){
	 $(".tech-skill").click(function() {
	 	 if($(".techSkillHolder span").length == 5) return;
	 	 $(".chosenTech").off("click");
	     var techSkill = $(this).find("a").find("span").html().trim();
	     var icon = $(this).find("a").find("i").attr("class");
	     var key = $(this).find("span").attr("key");
	     var exist = false;
	     $(".techSkillHolder span").each(function(){
	     	if($(this).html().trim() == techSkill) exist = true;
	     });
	     if(exist) return;
	     var addedSkill = "<a class='btn btn-default btn-lg chosenTech'><i class='"+icon+"'></i><span key='"+key+"' class='network-name'>"+techSkill+"</span></a>";
	     $(".techSkillHolder").append(addedSkill);
	     var count = parseInt($(".skills-counter").html().trim().split("/")[0])+1;
 		 $(".skills-counter").html(count+"/5");
	     activateRemoveFunction();
	 });
}
 
 function activateRemoveFunction(){
	 $(".chosenTech").click(function() {
	     $(this).remove();
	     var count = parseInt($(".skills-counter").html().trim().split("/")[0])-1;
 		 $(".skills-counter").html(count+"/5");
	 });
}

$(".exp-level span").click(function() {
	     var el = $(this).clone();
	     $(".selectedExp").html(el);
 });
 
$(".worktype span").click(function() {
	     var el = $(this).clone();
	     $(".selectedWorktype").html(el);
	     //$(".selectedWorktype").append(el);
 });
 
function formatTechSkills()
{
	var formatedSkills = {};
	$('.techSkillHolder span').each(function( index ) {
		var key = $(this).attr("key");
	 	formatedSkills[key] = $(this).html().trim();
	});
	 
	return JSON.stringify(formatedSkills);
}

function formatTimePreferences(){
	calcCoordinatesOfAxis();
	return JSON.stringify(time_options);
}

function calcCoordinatesOfAxis()
{
	options.h = 350;
	options.w = 350;
	for (var i=0; i < time_options.length; i++) {
	  time_options[i].x = options.w/2*(1-(parseFloat(Math.max(time_options[i].position, 0))/options.maxValue)*options.factor*Math.sin(time_options[i].order*options.radians/time_options.length));
	  time_options[i].y = options.h/2*(1-(parseFloat(Math.max(time_options[i].position, 0))/options.maxValue)*options.factor*Math.cos(time_options[i].order*options.radians/time_options.length));
	};
}

$(".save-edit").on('click', function(){
		if($(".chosenTech span").length < 5)
		{
			alert("Please select 5 tech skills.");
			return;
		}
		var editDiv = $("#editPosition");
		balanceTimeChart();
		var tech_skills = formatTechSkills();
		var time_preferences = formatTimePreferences();
		var work_type = editDiv.find(".worktype").find("span").html().trim();
		var exp_level = editDiv.find(".exp-level").find("span").html().trim();
		var salary = editDiv.find(".salaryRange").val();
		var description = editDiv.find(".work-description").html().trim();
		var title = editDiv.find(".title-edit").html().trim();
		var key = $(this).attr("position-key");
		
		$.ajax({
                url: "/company/editposition/",
                type: "POST",
                xhrFields : {
					withCredentials : true
				},
				headers : {
					'X-Requested-With' : 'XMLHttpRequest'
				},
                data:{
                	tech_skills:tech_skills,
                	time_preferences:time_preferences,
                	work_type:work_type,
                	exp_level:exp_level,
                	salary:salary,
                	project_description:description,
                	title:title,
                	position_id:key
                },
                success: function(data) {
                	if(data == "edit_successful")
                		window.location.href="/company/positions/";
                },
                error: function() {
                    console.log("Error occured. Please notify us at: support@codematch.eu");
                },
            });
   });

function enablePublishOption(){
	$(".publishbtn").on('click', function(){
		var key = $(this).attr("position-key");
		$.ajax({
				beforeSend: function(){$("#search-modal").modal("show");},
                url: "/company/publishposition/",
                type: "POST",
                xhrFields : {
					withCredentials : true
				},
				headers : {
					'X-Requested-With' : 'XMLHttpRequest'
				},
                data:{
                	position_id:key
                },
                success: function(data) {
                	if(data == "publish_successful")
                		window.location.href="/company/matches/";
                	$("#search-modal").modal("hide");
                },
                error: function() {
                	$("#search-modal").modal("hide");
                    console.log("Error occured. Please notify us at: support@codematch.eu");
                },
            });
   });
}

/*
$(".save-edit").on('click', function(){
		var editDiv = $("#editPosition");
		balanceTimeChart();
		var key = $(this).attr("position-key");
		var position = $(".position[position-key='"+key+"']");
		var tech_skills = editDiv.find(".techSkillHolder").html();
		position.find(".position-stack").html(tech_skills);
		var more_info = editDiv.find(".exp-level").html() + editDiv.find(".worktype").html();
		position.find(".position-details").html(more_info);
		var salary = editDiv.find(".salary").html();
		position.find(".position-salary").html("Max. Salary: "+salary+" &#8364");
		var newChart = editDiv.find("svg").clone();
		//editDiv.modal("hide");
   });
   */