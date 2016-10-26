var formdata = new FormData();
function displayTechSkills(skills)
{
	var parsed = JSON.parse(skills);
	for (var key in parsed) {
		var el = "<a class='btn btn-default btn-lg tech'>"
				+"<i class='devicon-"+key+"'></i><span key='"+key+"' class='network-name' >"+parsed[key]+"</span></a>"
                  +"</li>";
	  $(".techSkills").append(el);
	};
}

 $(".picUploader").on("mouseenter", function() {
     $(".profile-img").css("border", "2px solid #70ABE6");
 });
 
  $(".picUploader").on("mouseout", function() {
     $(".profile-img").css("border", "none");
 });

function editProfilePicture()
{
	var photo = $(".picUploader")[0];
	if (photo.files && photo.files[0]) {
			formdata.append('profile_picture', photo.files[0]);
	       var reader = new FileReader();
	       reader.onload = imageIsLoaded;
	       reader.readAsDataURL(photo.files[0]);
      }
}

function imageIsLoaded(e) {
    $('.img-sidebar').attr('src', e.target.result);
    $('.profile-img').attr('src', e.target.result);
};
var timeprintIsChanged = false;
 $(".time-chart-edit").one("click", function() {
 	 $("#chart").html("");
 	 options.radius = 5;
     MovableRadarChart.draw("#chart", time_options, options);
     $(this).attr("readonly", "true");
     $(this).css("opacity","0.6");
     timeprintIsChanged = true;
 });
 
$(".saveChanges").on("click", function() {
	 if(timeprintIsChanged)
 	 	balanceTimeChart();
 	 editProfile();
 	 //setTimeout(function(){window.location.href="/talent/profile/";},2000);
 });

function getProfileVriables()
{
	 var can_match_outside_batch = $(".switch-animate").hasClass("switch-off") ? 0 : 1;
	 var tech_skills = formatTechSkills();
	 var time_preferences = formatTimePreferences();
  	 var salary = $(".salaryRange").val();
  	 var role = $(".role").html().trim();
  	 var operating_system = $(".os-original").attr("value").trim();
  	 var editor = $(".ed-original").attr("value").trim();
  	 var exp_level = $(".exp-original span").html().trim();
  	 var relocation = $(".rel-original span").attr("value").trim();
  	 var linkedin = $(".linkedin").parent().attr("href").trim();
  	 var github = $(".github").parent().attr("href").trim();
  	 var work_description = $(".work-description").html().trim();
  	 var work_type = $(".worktype-original span").html().trim();
  	 
  	 formdata.append('tech_skills', tech_skills);
  	 formdata.append('time_preferences', time_preferences);
  	 formdata.append('salary', salary);
  	 formdata.append('role', role);
  	 formdata.append('operating_system', operating_system);
  	 formdata.append('editor', editor);
  	 formdata.append('exp_level', exp_level);
  	 formdata.append('relocate', relocation);
  	 formdata.append('linkedin', linkedin);
  	 formdata.append('github', github);
  	 formdata.append('work_description', work_description);
  	 formdata.append('work_type', work_type);
  	 formdata.append('can_match_outside_batch', can_match_outside_batch);
}

function editProfile()
{
	getProfileVriables();
  	 
	$.ajax({
         url: "/completeDevProfile/",
         type: "POST",
         data: formdata,
         contentType: false,
         processData: false,
         success: function(data) {
             if (data == "complete_successful")
                 setTimeout(function(){window.location.href="/talent/profile/";},1000);
         },
         error: function() {
             alert("Error occured. Please notify us at: support@codematch.eu");
         },
     });
}

function formatTechSkills()
{
	var formatedSkills = {};
	$( ".techSkills span" ).each(function() {
		var key = $(this).attr("key");
		formatedSkills[key]=$(this).html().trim();
	});
	return JSON.stringify(formatedSkills);
}

function formatTimePreferences(){
	return JSON.stringify(time_options);
}

$(".switch").on("click", function() {
      if($(this).find(".switch-animate").hasClass("switch-on"))
      {
      	 $(this).find(".switch-animate").removeClass("switch-on");
      	 $(this).find(".switch-animate").addClass("switch-off");
      	 $(".save-match-holder").hide();
      	 $(".save-changes-holder").show();
      }
      else
      {
      	 $(this).find(".switch-animate").removeClass("switch-off");
      	 $(this).find(".switch-animate").addClass("switch-on");
      	 $(".save-changes-holder").hide();
      	 $(".save-match-holder").show();
      }
 });

$(".saveAndMatch").on("click", function() {
	 if(timeprintIsChanged)
 	 	balanceTimeChart();
 	 editProfileAndMatch();
 	 //setTimeout(function(){window.location.href="/talent/profile/";},2000);
 });
 
function editProfileAndMatch()
{
	getProfileVriables();	 
	$.ajax({
		 beforeSend: function(){$("#search-modal").modal("show");},
         url: "/editProfileAndMatch/",
         type: "POST",
         data: formdata,
         contentType: false,
         processData: false,
         success: function(data) {
             if (data == "match_successful")
                 setTimeout(function(){window.location.href="/talent/matches/";},1000);
             $("#search-modal").modal("hide");
         },
         error: function() {
         	 $("#search-modal").modal("hide");
             alert("Error occured. Please notify us at: support@codematch.eu");
         },
     });
}

$(".batch-explain").on("click", function() {
	$("#batch-modal").modal("show");
 });
$(".okay-btn").on("click", function() {
	$("#batch-modal").modal("hide");
 });