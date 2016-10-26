 $(".username").on('click', function(event){
 		 if($(this).find("input").length > 0)
 		 	return;
		 var content = $(this).html().trim();	
         $(this).html(
         	"<input type='text' class='edit-input' placeholder='Your name'>"
         );
         $(this).find("input").val(content);
         $(this).find("input").focus();
   });
$(".username").on('mouseout', function(event){
		 if($(this).find("input").is(":hover"))
		   		return;
		 var content = $(this).find("input").val().trim();
		 if (content == "")
		 	return;
         $(".username").html(
         	content
         );
   });

 $(".holder").on('click', function(event){
 		 if($(this).find("input").length > 0)
 		 	return;
		 var git_url = $(this).find(".github").parent().attr("href").trim();
		 var linkedin_url = $(this).find(".linkedin").parent().attr("href").trim();	
         $(this).html(
         	"<input type='text' id='github-input' class='edit-input' placeholder='Your github profile url'>"+
         	"<input type='text' id='linkedin-input' class='edit-input' placeholder='Your linkedin profile url'>"
         );
         $(this).find("#github-input").val(git_url);
         $(this).find("#linkedin-input").val(linkedin_url);
         $(this).find("#github-input").focus();
   });
$(".holder").on('mouseout', function(event){
		 if($(this).is(":hover"))
		   		return;
		 var git = $(this).find("#github-input").val().trim();
		 var link = $(this).find("#linkedin-input").val().trim();
		 if (git == "" || link == "")
		 	return;
		 if(git.indexOf("github") == -1)
		 {
		 	showUrlWarning("Github profile url is not valid.");
		 	return;
		 }
		 if(link.indexOf("linkedin") == -1)
		 {
		 	showUrlWarning("Linkedin profile url is not valid.");
		 	return;
		 }
         $(this).html(
         	"<a target='_blank' href='"+checkForValidUrls(git)+"'><img class='github'></a>"+
			"<a target='_blank' href='"+checkForValidUrls(link)+"'><img class='linkedin'></a>"
         );
   });

function showUrlWarning(msg)
{
	$(".invalid-url").html(msg);
	$(".invalid-url").show("slow");
	setTimeout(function(){
		$(".invalid-url").hide();
		$(".invalid-url").html("");
	}, 5000);
}

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

 $(".role").on('click', function(event){
 		if($(this).find("input").length > 0)
 		 	return;
		 var content = $(this).html().trim();	
         $(this).html(
         	"<input type='text' class='edit-input' placeholder='How would you title your role'>"
         );
         $(this).find("input").val(content);
         $(this).find("input").focus();
   });
$(".role").on('mouseout', function(event){
		 if($(this).find("input").is(":hover"))
		   		return;
		 var content = $(this).find("input").val().trim();
		 if (content == "")
		 	return;
         $(".role").html(
         	content
         );
   });
   
 $(".exp-level").on('click', function(event){
 		if($(this).find(".exp-options").length > 0) return;
 		$(this).find(".exp-original").hide();
 		$(this).css("padding","10px 5px");
 		
 		var el  = "<div class='exp-options'><a class='btn btn-default btn-lg exp-lvl opt'><span class='network-name'>Entry level</span></a>"
 				+"<a class='btn btn-default btn-lg exp-lvl opt'><span class='network-name'>Mid level</span></a>"
 				+"<a class='btn btn-default btn-lg exp-lvl opt'><span class='network-name'>Senior level</span></a>"
 				+"<a class='btn btn-default btn-lg exp-lvl opt'><span class='network-name'>Lead level</span></a></div>";
 		$(this).append(el);
 		enableExpSelection();
   });
$(".exp-level").on('mouseout', function(event){
		 if($(this).is(":hover"))
		   		return;
		 $(this).css("padding","0px");
		 $(this).find(".exp-original").show();
		 $(this).find(".exp-options").remove();
   });

 function enableExpSelection()
 {
 	$(".opt").on('click', function(event){
 		 event.stopPropagation();
 		 event.preventDefault();
		 var el = $(this).clone().removeClass("opt").addClass("exp-original");
		 $(".exp-options").remove();
		 $(".exp-original").remove();
		 $(".exp-level").append(el);
		 $(".exp-level").css("padding","0px");
   });
 }

 $(".worktype").on('click', function(event){
 		if($(this).find(".worktype-options").length > 0) return;
 		$(this).find(".worktype-original").hide();
 		$(this).css("padding","10px 5px");
 		
 		var el  = "<div class='worktype-options'>"
 				+"<a class='btn btn-default btn-lg work-type opt'><span class='network-name'>Remote</span></a>"
 				+"<a class='btn btn-default btn-lg work-type opt'><span class='network-name'>Onsite or Remote</span></a>"
 				+"<a class='btn btn-default btn-lg work-type opt'><span class='network-name'>Onsite</span></a>"
 				+"</div>";
 		$(this).append(el);
 		enableWorktypeSelection();
   });
$(".worktype").on('mouseout', function(event){
		 if($(this).is(":hover"))
		   		return;
		 $(this).css("padding","0px");
		 $(this).find(".worktype-original").show();
		 $(this).find(".worktype-options").remove();
   });
 
 function enableWorktypeSelection()
 {
 	$(".opt").on('click', function(event){
 		 event.stopPropagation();
 		 event.preventDefault();
		 var el = $(this).clone().removeClass("opt").addClass("worktype-original");
		 $(".worktype-options").remove();
		 $(".worktype-original").remove();
		 $(".worktype").append(el);
		 $(".worktype").css("padding","0px");
   });
 }
 
  $(".editor").on('click', function(event){
 		$(this).find(".ed-original").hide();
 		$(this).css("padding","10px 5px");
 		$(".ed-options").show();
 		enableEditorSelection();
   });
$(".editor").on('mouseout', function(event){
		 if($(this).is(":hover"))
		   		return;
		 $(this).css("padding","0px");
		 $(this).find(".ed-original").show();
		 $(".ed-options").hide();
   });
   
 function enableEditorSelection()
 {
 	$(".editor-imgs").on('click', function(event){
 		 event.stopPropagation();
 		 event.preventDefault();
		 var el = $(this).clone().addClass("ed-original").attr("value", $(this).attr("value"));
		 $(".ed-options").hide();
		 $(".ed-original").remove();
		 $(".editor").append(el);
		 $(".editor").css("padding","0px");
   });
 }
 
$(".os").on('click', function(event){
 		$(this).find(".os-original").hide();
 		$(this).css("padding","10px 5px");
 		$(".os-options").show();
 		enableOsSelection();
   });

$(".os").on('mouseout', function(event){
		 if($(this).is(":hover"))
		   		return;
		 $(this).css("padding","0px");
		 $(this).find(".os-original").show();
		 $(".os-options").hide();
   });
   
 function enableOsSelection()
 {
 	$(".os-imgs").on('click', function(event){
 		 event.stopPropagation();
 		 event.preventDefault();
		 var el = $(this).clone().addClass("os-original").attr("value", $(this).attr("value"));
		 $(".os-options").hide();
		 $(".os-original").remove();
		 $(".os").append(el);
		 $(".os").css("padding","0px");
   });
 }
 
 $(".relocation").on('click', function(event){
 		if($(this).find(".rel-options").length > 0) return;
 		$(this).find(".rel-original").hide();
 		$(this).css("padding","10px 5px");
 		
 		var el  = "<div class='rel-options'><a class='btn btn-default btn-lg exp-lvl opt'><span value='1' class='network-name'>Can relocate</span></a>"
 				+"<a class='btn btn-default btn-lg exp-lvl opt'><span value='0' class='network-name'>On my location</span></a></div>";
 		$(this).append(el);
 		enableRelocateSelection();
   });
$(".relocation").on('mouseout', function(event){
		 if($(this).is(":hover"))
		   		return;
		 $(this).css("padding","0px");
		 $(this).find(".rel-original").show();
		 $(this).find(".rel-options").remove();
   });
   
 function enableRelocateSelection()
 {
 	$(".opt").on('click', function(event){
 		 event.stopPropagation();
 		 event.preventDefault();
		 var el = $(this).clone().removeClass("opt").addClass("rel-original");
		 $(".rel-options").remove();
		 $(".rel-original").remove();
		 $(".relocation").append(el);
		 $(".relocation").css("padding","0px");
   });
 }
   
   
 $(".location").on('click', function(event){
 		if($(this).find("select").length > 0)
 		 	return;		 
         $(this).html(
         	//Bucharest
         	"<select class='edit-input'>"
         	+"<option>Sofia, Bulgaria</option>"
         	+"<option>Athens, Greece</option>"
         	+"<option>Bucharest, Romania</option>"
         	+"<option>Belgrade, Serbia</option>"
         	+"<option>Skopje, Macedonia</option>"
         	+"</select>"
         );
   });
$(".location").on('mouseout', function(event){
		 if($(this).find("select").is(":hover"))
		   		return;
		 var content = $(this).find("select").val().trim();
		 if (content == "")
		 	return;
         $(".location").html(
         	content
         );
   });
 
  $(".salary-div").on('click', function(event){
 		if($(this).find("select").length > 0)
 		 	return;		 
         $(this).html(
         	"<select class='edit-input'>"
         	+"<option>500 - 1000</option>"
         	+"<option>1000 - 2000</option>"
         	+"<option>2000 - 5000</option>"
         	+"<option>5000+</option>"
         	+"</select>"
         );
   });
$(".salary-div").on('mouseout', function(event){
		 if($(this).find("select").is(":hover"))
		   		return;
		 var content = $(this).find("select").val().trim();
		 if (content == "")
		 	return;
         $(".salary-div").html(
         	"<span>Desired Salary: </span> <span class='salary'>"+content+"</span> &#8364"
         );
   });
 
 $(".work-description").on('click', function(event){
 		if($(this).find("textarea").length > 0)
 		 	return;
		 var content = $(this).html().trim();	
         $(this).html(
         	"<textarea type='text' class='edit-input' placeholder='What do you want to do'></textarea>"
         );
         $(this).find("textarea").val(content);
         $(this).find("textarea").focus();
   });
$(".work-description").on('mouseout', function(event){
		 if($(this).find("textarea").is(":hover"))
		   		return;
		 var content = $(this).find("textarea").val().trim();
		 if (content == "")
		 	return;
         $(".work-description").html(
         	content
         );
   });

 $(".techSkills").on('click', function(event){
 		loadTechStack(tech_stack);
 		copySelectedSkills();
 		enableAddSkill();
 		enableRemoveSkill();
 		$(".cancel").on('click', function(event){
 			$('#tech-stack-modal').modal('hide');
   		});
   		$(".saveSkills").on('click', updateSkills);
 		$('#tech-stack-modal').modal('show');
   });
   
 function updateSkills()
 {
 	if($(".selected-skills .tech").length < 5) return;
 	$(".techSkills").html("");
 	$(".selected-skills .tech").each(function(){
		var skill = $(this).clone();
		$(".techSkills").append(skill);
	});
	$('#tech-stack-modal').modal('hide');
 }
   
function copySelectedSkills()
{
	$(".selected-skills").html("");
	$(".techSkills .tech").each(function(){
		var skill = $(this).clone();
		$(".selected-skills").append(skill);
	});
}

function loadTechStack(tech_stack)
{
	$(".skills-to-select").html("");
	var stack = JSON.stringify(tech_stack.replace(/&quot;/g, '"'));
	var stack_dict = {}
	stack_dict = JSON.parse(stack);
	var parsed = JSON.parse(stack_dict);
	for (var key in parsed) {
	  	var el ="<a class='btn btn-default btn-lg tech'><i class='devicon-"+key+"'></i><span key='"+key+"' class='network-name' >"+parsed[key]+"</span></a>";
        $(".skills-to-select").append(el);
	};
}

function enableAddSkill()
{
 $(".skills-to-select .tech").on('click', function(event){
 		if($(".selected-skills .tech").length == 5) return;
 		$(".selected-skills .tech").off('click', removeFunc);
 		var skill = $(this).find("span").html().trim();
 		var exist = false;
	     $(".selected-skills span").each(function(){
	     	if($(this).html().trim() == skill) exist = true;
	     });
	    if(exist) return;
 		var el = $(this).clone();
 		console.log(el);
 		$(".selected-skills").append(el);
 		var count = parseInt($(".skills-counter").html().trim().split("/")[0])+1;
 		$(".skills-counter").html(count+"/5");
 		enableRemoveSkill();
   });
}
function enableRemoveSkill()
{
	$(".selected-skills .tech").on('click', removeFunc);
}
var removeFunc = function(event){
		event.stopPropagation();
 		event.preventDefault();
 		$(this).remove();
 		var count = parseInt($(".skills-counter").html().trim().split("/")[0])-1;
 		$(".skills-counter").html(count+"/5");
  };
