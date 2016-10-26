 $('.salaryRange').rangeslider({polyfill: false});
 $(".salaryRange").on('change', function(){
 		$(".edit-salary").html($(this).val());
 });

function limitWords()
{
	$(".char-counter").show();
	var text_max = 300;
	$('textarea').attr("maxlength", text_max);
	var current = $('textarea').val().length;
	$('.char-counter').html(current+"/"+text_max + ' characters');	
	$('textarea').keyup(function() {
		var text_length = $('textarea').val().length;
		$('.char-counter').html(text_length+"/"+text_max + ' characters');
	});
}
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
		 $(".exp-level").find(".exp-original").remove();
		 $(".exp-level").append(el);
		 $(".exp-level").css("padding","0px");
   });
 }

 $(".worktype-holder").on('click', function(event){
 		if($(this).find(".worktype-options").length > 0) return;
 		$(this).find(".worktype-original").hide();
 		$(this).css("padding","10px 5px");
 		
 		var el  = "<div class='worktype-options'>"
 				+"<a class='btn btn-default btn-lg worktype opt'><span class='network-name'>Remote</span></a>"
 				+"<a class='btn btn-default btn-lg worktype opt'><span class='network-name'>Onsite or Remote</span></a>"
 				+"<a class='btn btn-default btn-lg worktype opt'><span class='network-name'>Onsite</span></a>"
 				+"</div>";
 		$(this).append(el);
 		enableWorktypeSelection();
   });
$(".worktype-holder").on('mouseout', function(event){
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
		 $(".worktype-holder").find(".worktype-original").remove();
		 $(".worktype-holder").append(el);
		 $(".worktype-holder").css("padding","0px");
   });
 }
 
 $(".title-edit").on('click', function(event){
 		if($(this).find("input").length > 0)
 		 	return;
		 var content = $(this).html().trim();	
         $(this).html(
         	"<input type='text' class='edit-input' placeholder='How would you title this position'>"
         );
         $(this).find("input").val(content);
         $(this).find("input").focus();
   });
$(".title-edit").on('mouseout', function(event){
		 if($(this).find("input").is(":hover"))
		   		return;
		 var content = $(this).find("input").val().trim();
		 if (content == "")
		 	return;
         $(".title-edit").html(
         	content
         );
   });

$(".work-description").on('click', function(event){
 		if($(this).find("textarea").length > 0)
 		 	return;
		 var content = $(this).html().trim();	
         $(this).html(
         	"<textarea type='text' clas='summary' class='edit-input' placeholder='Describe the project you need a talent for'></textarea>"
         );
         $(this).find("textarea").val(content);
         $(this).find("textarea").focus();
         limitWords();
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
         $(".char-counter").hide();
   });