function totalSum(){
	var sum = 0;
	$(".timeManagerHolder .progress-bar").each(function(){
		sum += parseInt($(this).html());
	});
	return sum;
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
 $("#slider").on("change", function() {
     if (this.value == 10) {
         $(".yearsHolder").html(this.value + "+ year(s)");
         return;
     }
     $(".yearsHolder").html(this.value + " year(s)");
 });

 $(".next").on("click", function() {
 	var current = $(".sectionHolder:visible");
 	if(checkForCorrectInput(current))
 	{
	     var next = current.next();
	     if (next.next().next().length == 0) {
	     	 current.hide();
	         $(".next").hide();
	         next.show("slow");
	         $(".prev").show();
	         return;
	     }
	     current.hide();
	     next.show("slow");
	     $(".prev").show();
	     $(".next").show();
	}
 });
 
 function checkForCorrectInput(section)
 {
 	if(section.attr("id")=="tech-section")
 	{
 		if($(".techSkillHolder span").length < 5)
 		{
 			alert("Please, choose 5 skills of your favourite stack.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="time-section")
 	{
 		return balanceTimeChart();
 	}
 	if(section.attr("id")=="salary-section")
 	{
 		if ($(".salaryRange").val() == "")
 		{
 			alert("Please, select your desired monthly salary.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="worktype-section")
 	{
 		if ($(".worktype").val().trim() == "")
 		{
 			alert("Please, select what type of work you prefer.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="role-section")
 	{
 		if ($(".role-title").val().trim() == "")
 		{
 			alert("Please, describe how you would call your role.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="os-section")
 	{
 		if ($(".os-imgs[picked='true']").length == 0)
 		{
 			alert("Please, select your preferred OS.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="editor-section")
 	{
 		if ($(".editor-imgs[picked='true']").length == 0)
 		{
 			alert("Please, select your favourite editor.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="exp-section")
 	{
 		if ($(".experience-level").val().trim() == "")
 		{
 			alert("Please, select your level of experience.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="relocate-section")
 	{
 		if ($(".relocation").val().trim() == "")
 		{
 			alert("Please, select if you would be willing to relocate for a new job.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="work-section")
 	{
 		if ($(".favourite-work").val().trim() == "")
 		{
 			alert("Please, describe (1-2 sentences) what kind of work you would like to be involved in.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="github-section")
 	{
 		if ($(".github").val().trim() == "")
 		{
 			alert("Please, provide us with your github profile url.");
 			return false;
 		}
 		if($(".github").val().trim().indexOf("github") == -1)
 		{
 			alert("This url is not valid.");
 			return false;
 		}
 		return true;
 	}
 	if(section.attr("id")=="linkedin-section")
 	{
 		if ($(".linkedin").val().trim() == "")
 		{
 			alert("Please, provide us with your github profile url.");
 			return false;
 		}
 		if($(".linkedin").val().trim().indexOf("linkedin") == -1)
 		{
 			alert("This url is not valid.");
 			return false;
 		}
 		return true;
 	}
 }

 $(".prev").on("click", function() {
     var current = $(".sectionHolder:visible");
     var prev = current.prev();
     if (prev.prev().length == 0) {
         $(".prev").hide();
     }
     current.hide();
     prev.show("slow");
     $(".next").show();
 });

 $('.saveBtn').on('click', function(event) { 	 
  	 var tech_skills = formatTechSkills();
	 var time_preferences = formatTimePreferences();
  	 var salary = $(".salaryRange").val();
  	 var role = $(".role-title").val().trim();
  	 var operating_system = $(".os-imgs[picked='true']").attr("value").trim();
  	 var editor = $(".editor-imgs[picked='true']").attr("value").trim();
  	 var exp_level = $(".experience-level").val().trim();
  	 var relocation = $(".relocation").val().trim();
  	 var work_type = $(".worktype").val().trim();
  	 var linkedin = checkForValidUrls($(".linkedin").val().trim());
  	 var github = checkForValidUrls($(".github").val().trim());
  	 var work_description = $(".favourite-work").val().trim();
  	 
     $.ajax({
         url: "/completeDevProfile/",
         type: "POST",
         data: {
             tech_skills: tech_skills,
             time_preferences: time_preferences,
             salary: salary,
             role: role,
             work_type:work_type,
             operating_system: operating_system,
             editor: editor,
             exp_level: exp_level,
             relocate: relocation,
             linkedin: linkedin,
             github: github,
             work_description: work_description
         },
         success: function(data) {
             if (data == "complete_successful")
                 window.location.href = "/talent/profile/";
         },
         error: function() {
             alert("Error occured. Please notify us at: support@codematch.eu");
         },
     });

 });

function formatTechSkills()
{
	var formatedSkills = {};
	$( ".techSkillHolder span" ).each(function() {
		var key = $(this).attr("key");
		formatedSkills[key]=$(this).html().trim();
	});
	return JSON.stringify(formatedSkills);
}

function formatTimePreferences(){
	return JSON.stringify(time_options);
}

 $(".os-imgs").on("click", function() {
 	$(".os-imgs").css("width","75px");
 	$(".os-imgs").attr("picked","false");
 	$(this).css("width","150px");
 	$(this).attr("picked","true");
 });
  $(".editor-imgs").on("click", function() {
 	$(".editor-imgs").css("width","75px");
 	$(".editor-imgs").attr("picked","false");
 	$(this).css("width","150px");
 	$(this).attr("picked","true");
 });
 
function checkForValidUrls(url)
{
	var prefix1 = 'http://';
	var prefix2 = 'https://';
	if (url.substr(0, prefix1.length) !== prefix1 && url.substr(0, prefix2.length) !== prefix2)
	{
	    url = prefix1 + url;
	}
	return url;
}