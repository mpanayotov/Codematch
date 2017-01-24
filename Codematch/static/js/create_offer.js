$('.offerBtn').on('click', function(event){
		if($(".chosenTech").length < 5)
		{
			alert("Please select 5 tech skills.");
			return;
		}
		if($(".salaryRange").val() == "")
        {
            alert("Please, provide maximum annual salary.");
            return;
        }
        if($(".title").val().trim() == "")
        {
            alert("Please, type a title for your open position.");
            return;
        }
        if($(".selectedExp").children().length == 0)
        {
            alert("Please, choose seniority level.");
            return;
        }
        if($(".selectedWorktype").children().length == 0)
        {
            alert("Please, choose desired type of work.");
            return;
        }
        if($(".summary").val().trim() == "")
        {
            alert("Please, describe your project/product/service.");
            return;
        }
        
		if(!balanceTimeChart()) return;
		var salary = $(".salaryRange").val();
		var title = $(".title").val().trim();
		var project_description = $(".summary").val().trim();
		var work_type = $(".selectedWorktype span").html().trim();
		var exp_level = $(".selectedExp span").html().trim();
		var tech_skills = formatTechSkills();
		var time_preferences = formatTimePreferences();
        $.ajax({
                url: "/createJobOffer/",
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
                	exp_level:exp_level,
                	work_type:work_type,
                	salary:salary,
                	title:title,
                	project_description:project_description
                },
                success: function(data) {
                	if(data=="offer_created")
                		window.location.href="/company/positions/";
                	else
                		alert("Incorrect username or password");
                },
                error: function() {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
            
    });

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
	return JSON.stringify(time_options);
}

/*
$.ajax({
                url: "/admin/findMatches/",
                type: "POST",
                xhrFields : {
					withCredentials : true
				},
				headers : {
					'X-Requested-With' : 'XMLHttpRequest'
				},
                data:{
                	batch_id:1
                },
                success: function(data) {
                	console.log("Incorrect username or password");
                },
                error: function() {
                    console.log("Error occured. Please notify us at: support@codematch.eu");
                },
            });
       */