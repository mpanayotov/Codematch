// --BEGIN--CONTROLS THAT REQUIRE AUTHENTIFICATION

//create a new post
$( ".ride-left" ).click(function() {
	if (user_is_authenticated == "True")
	{
		if($(".ride-left").css("opacity") == 1)
		{
			return;
		}
		else
		{
			$(".ride-left").css({"opacity":"1", "border-right":"1px solid black"});
			$(".ride-left").addClass("ride-active");
			$(".ride-right").css("opacity", "0.5");
			$(".ride-right").removeClass("ride-active");
			$(".okayright").hide();
			$(".okayleft").show();
			letUserType();
		}
	}
	else
	{
		requestLogin("За да създадете публикация, първо трябва да влезете в профила си.");
	}
});

$( ".ride-right" ).click(function() {
	if (user_is_authenticated == "True")
	{
		if($(".ride-right").css("opacity") == 1)
		{
			return;
		}
		else
		{
			$(".ride-right").css({"opacity":"1", "border-left":"1px solid black"});
			$(".ride-right").addClass("ride-active");
			$(".ride-left").css("opacity", "0.5");
			$(".ride-left").removeClass("ride-active");
			$(".okayleft").hide();
			$(".okayright").show();
			letUserType();
		}
	}
	else
	{
		requestLogin("За да създадете публикация, първо трябва да влезете в профила си.");
	}
});

function letUserType(){
	$(".postText").attr("readonly", false);
	$(".postText").focus();
}

//use fast tags to create comment for drive or passenger
$( ".positive-label" ).click(function() {
		$(".txt-positive").val($(this).html());
		$(".txt-positive").focus();
});

$( ".postText" ).click(function() {
		if($(this).attr("readonly") == "readonly")
		{
			$(".reminder").show("slow");
				setTimeout(function(){
	           $(".reminder").hide("slow");	
	        }, 4000);
			//alert("Първо изберете откъде закъде ще предлагате/търсите пътуване (от двете опции отгоре).");	
		}
});

$( ".negative-label" ).click(function() {
		$(".txt-negative").val($(this).html());
		$(".txt-negative").focus();	
});

/*
function saveComment(self){
	if (user_is_authenticated == "True")
	{
		if ($(self).attr("class") == "positive-comment-Button")
		{
			var comment = $(".textarea-positive-comment").val();
			saveCommentRequest(comment, "positive");
		}
		if ($(self).attr("class") == "positive-comment-Button-mobile")
		{
			var comment = $(".textarea-positive-comment-mobile").val();
			saveCommentRequest(comment, "positive");
		}
		if ($(self).attr("class") == "negative-comment-Button")
		{
			var comment = $(".textarea-negative-comment").val();
			saveCommentRequest(comment, "negative");
		}
		if ($(self).attr("class") == "negative-comment-Button-mobile")
		{
			var comment = $(".textarea-negative-comment-mobile").val();
			saveCommentRequest(comment, "negative");
		}
	}
	else
	{
		requestLogin("За да дадете коментар, първо трябва да влезете в профила си.");
	}
}
*/
function saveComment(self){
	if (user_is_authenticated == "True")
	{
		var comment = $(".text-cmt").val().trim();
		saveCommentRequest(comment, "positive");
	}
	else
	{
		requestLogin("За да дадете коментар, първо трябва да влезете в профила си.");
	}
}


$( ".postButton" ).click(function() {
	if (user_is_authenticated == "True")
	{
		if ($(".ride-active").length != 0)
		{
			var message = $(".postText").val().trim();
			if(message != "")
			{
				var direction_from = $(".ride-active").children(".dirfrom").html().trim();
				var direction_to = $(".ride-active").children(".dirto").html().trim();
				publicatePost(message, direction_from, direction_to);
			}
			else
			{
				alert("Моля, напишете вашата публикация.");
			}
		}
		else
		{
			alert("Моля, изберете една от двете посоки и напишете вашата публикация.");
		}
	}
	else
	{
		requestLogin("За да създадете публикация, първо трябва да влезете в профила си.");
	}
});

$( ".updateButton" ).click(function(){updateFunction();});

function updateFunction(){
	if (user_is_authenticated == "True")
	{
		var update_text = $(".lastPostUpdateText").val().trim();
		if (update_text != "")
		{
			updateLastPost(update_text);
		}
		else
		{
			alert("Полето за актуализация на последната ви публикация е празно.");
		}
	}
	else
	{
		requestLogin("За да актуализирате информацията(update) на последната си публикация, първо трябва да влезете в профила си.");
	}
}

$( ".saveNumberButton" ).click(function() {
	if (user_is_authenticated == "True")
	{
		var phone_number = ($(".phoneNumberInput").val()).trim();
		if (phonenumber(phone_number) && phone_number!="")
			savePhoneNumber(phone_number);
		else
			alert("Моля въведете номера си в този формат: пример:0878 33 44 55");
	}
});

// --END--CONTROLS THAT REQUIRE AUTHENTIFICATION

$( ".updateFeature" ).click(function() {
	 setTimeout(function(){
           $(".lastPostUpdateText").focus();	
        }, 600);
		//$(".lastPostUpdateText").focus();	
});

$( ".fb-login-button" ).click(function() {
	fb_login();
});

function requestLogin(msg)
{
	$(".top-label").html(msg)
	$(".signInBox").show();
}

function updateLastPost(update_text){
	$.ajax({
						url : "/updateLastPost/",
						type : 'POST', //this is the default though, you don't actually need to always mention it
						xhrFields : {
							withCredentials : true
						},
						headers : {
							'X-Requested-With' : 'XMLHttpRequest'
						},
						data : {
							update_text : update_text
						},
						success : function(data) {
							if (data=="update_saved")
							{
								$(".lastPostUpdateText").val("");
								appendUpdateText(update_text);
								showSuccessMsg();
								//alert("Актуализирахте последната си публикация успешно.");
							}
						},
						error : function(error) {
							console.log("ERROR:", error);
						},
				});	
}

function showSuccessMsg()
{
	$(".update-success").show("slow");
	setTimeout(function(){
	           $(".update-success").hide("slow");	
	        }, 4000);
}

function appendUpdateText(text){
	var textString = "<div class='postUpdate'><span class='updateTag'>Update: </span><span class='update'>"+text+"</span></div>"
	$("#"+user_fb_id).find(".postUpdate").remove();
	$("#"+user_fb_id).append(textString);
}

function publicatePost(message, direction_from, direction_to){
	$.ajax({
						url : "/publicatePost/",
						type : 'POST', //this is the default though, you don't actually need to always mention it
						xhrFields : {
							withCredentials : true
						},
						headers : {
							'X-Requested-With' : 'XMLHttpRequest'
						},
						data : {
							message : message,
							direction_from: direction_from,
							direction_to: direction_to
						},
						success : function(data) {
							actualiseLastPostDetails(message);
							addPublicatedComment(message);
							actualiseFeedCounters(1);
							actualiseLastPostId();
							blinkUpdateButton();
						},
						error : function(error) {
							console.log("ERROR:", error);
						},
				});
}

function blinkUpdateButton()
{
	setTimeout(function(){
			$(".updateFeature").css("background-color","#00a3cc");
	        $(".updateFeature").fadeIn(250).fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250, function(){$(".updateFeature").css("background-color","#3B5999");}).fadeIn(250);
	        //$(".updateFeature").css("background-color","#3B5999");
	        }, 500);
}

function addPublicatedComment(message)
{
		var postString = "<div class='panel panel-default rideSharePost last-appended-post' style='display:none;' id='"+user_fb_id+"'>"+
		                                "<div class='profileCredentials'>"+
		                                 "<img src='http://graph.facebook.com/"+user_fb_id+"/picture?type=large' class='img-circle pull-left'>"+
		                                " <div class='nameAndRating'>"+
		                                  " <div class='timePost'>току-що</div>"+
		                                   "<div class='name'>"+user_fb_name+"</div>"+
		                                   " <div class='rating'>";
		                                   /*
		 									var ratingString = "";                                   
											for (var j=0; j < 5; j++) {
											   if (j < user_fb_rating)
											   		ratingString += "<span>&#9733;</span>";
											   	else
											   		ratingString += "<span>☆</span>";
											};
 	postString += ratingString;*/
 	var otherString = 
		                             	 "</div>"+
		                                 "</div>"+
		                               " </div>"+
		                               " <a class='carImage' href='/media/"+user_fb_car_image+"'><img src='/media/"+user_fb_car_image+"' class='img-rounded pull-left'></a>"+
		                                 checkForMobile(user_fb_phone_number, user_fb_id) +
		                             
		                               " <div class='panel-body offertext'>"+
		                                    "<div class='clearfix'></div>"+
		                                     "<div class='lineSeparator'></div>"+
		                                    	message +
		                                " </div>"+
		                                  "<div class='lineSeparatorFull'></div>"+
		                             " </div>";	
		
	postString += otherString;
	if(activeDirection() == "left")
	{
		if(activePostDirection() == "left")
			$(".one-direction").prepend(postString);
		else
			$(".second-direction").prepend(postString);
	}
	else
	{
		if(activePostDirection() == "right")
			$(".second-direction").prepend(postString);
		else
			$(".one-direction").prepend(postString);
	}
	actualiseControlls();
	$(".last-appended-post").show("slow");
	$(".postText").val("");
}

function saveCommentRequest(comment, assessment){
	var fb_id = comment_id;
	if(fb_id == user_fb_id)
	{
		alert("Можете да давате коментари само за други потребители.");
		return;
	}
	if (comment.trim()!="" && fb_id != undefined && fb_id != ""){
		$.ajax({
						url : "/saveComment/",
						type : 'POST', //this is the default though, you don't actually need to always mention it
						xhrFields : {
							withCredentials : true
						},
						headers : {
							'X-Requested-With' : 'XMLHttpRequest'
						},
						data : {
							comment : comment,
							//assessment: assessment,
							user_fb_id: fb_id
						},
						success : function(data) {
							clearTextAreasAndRenderNewComment(fb_id);
							//alert(data);
						},
						error : function(error) {
							console.log("ERROR:", error);
						},
				});
		}
	else{
		alert("Моля въведете коментар.");
	}
}

function clearTextAreasAndRenderNewComment(fb_id){
	/*$(".textarea-positive-comment").val("");
	$(".textarea-negative-comment").val("");
	$(".textarea-positive-comment-mobile").val("");
	$(".textarea-negative-comment-mobile").val("");*/
	$(".text-cmt").val("");
	loadComments(fb_id);
}

function savePhoneNumber(phone_number){
	$.ajax({
					url : "/savePhoneNumber/",
					type : 'POST', //this is the default though, you don't actually need to always mention it
					xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data : {
						phone_number : phone_number,
					},
					success : function(data) {
						if(data=="phone_number_uploaded")
							alert("Успешно запазихте телефон за връзка.");
					},
					error : function(error) {
						console.log("ERROR:", error);
					},
				});
}

function phonenumber(inputtxt) {
  var phoneno = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
  if(inputtxt.match(phoneno)) {
    return true;
  }
  else {
    return false;
  }
}

$( ".direction-right" ).click(function() {
	if($(".direction-right").css("opacity") == 1)
	{
		return;
	}
	else
	{
		$(".direction-right").css({"opacity":"1", "border-left":"1px solid black"});
		$(".direction-right").addClass("dir-active");
		$(".direction-left").removeClass("dir-active");
		$(".direction-left").css("opacity", "0.5");
		$(".one-direction").hide();
		$(".second-direction").show();
		$(".dir-tick-left").hide();
		$(".dir-tick-right").show();
	}
});

$( ".direction-left" ).click(function() {
	if($(".direction-left").css("opacity") == 1)
	{
		return;
	}
	else
	{
		$(".direction-left").css({"opacity":"1", "border-right":"1px solid black"});
		$(".direction-left").addClass("dir-active");
		$(".direction-right").removeClass("dir-active");
		$(".direction-right").css("opacity", "0.5");
		$(".second-direction").hide();
		$(".one-direction").show();
		$(".dir-tick-right").hide();
		$(".dir-tick-left").show();
	}
});

function openCommentBox(){
	comment_id = user_fb_id;
	$(".commentPopUpBox").show("fast");
	loadComments(comment_id);
	displayYourProfile();
}
function closeCommentBox(){
	$(".commentPopUpBox").hide();
}
function closeMobileCommentBox(){
	$(".mobile-comment-box").hide();
}
function openMobileCommentBox(){
	$(".commentPopUpBox").hide();
	$(".mobile-comment-box").show();	
}

function displayProfile(self)
{
	var name = $(self).find(".name").html();
	var rating = $(self).find(".rating").html();
	var image_src = $(self).find(".img-circle").attr("src");
	$(".commentBox-image").attr("src", image_src);
	$(".commentBox-name").html(name);
	$(".commentBox-rating").html(rating);
}

function displayYourProfile()
{
	$(".commentBox-image").attr("src", "http://graph.facebook.com/"+user_fb_id+"/picture");
	$(".commentBox-name").html(user_fb_name);
	/*var ratingString = "";                                   
	for (var j=0; j < 5; j++) {
		 if (j < parseInt(user_fb_rating))
			ratingString += "<span>&#9733;</span>";
		 else
			ratingString += "<span>☆</span>";
	};
	$(".commentBox-rating").html(ratingString);*/
}

function loadComments(fb_id)
{
		$.ajax({
					url : "/loadComments/",
					type : 'POST', //this is the default though, you don't actually need to always mention it
					xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data : {
						fb_id : fb_id,
					},
					success : function(data) {
						renderComments(data);	
					},
					error : function(error) {
						console.log("ERROR:", error);
					},
				});
}

function renderComments(comments){
	$(".commentsContainer").html("");
	if(comments == "no_comments_yet")
	{
		$(".commentsContainer").append("<div class='no-comment-label'>Все още няма коментари. Ако сте пътували заедно, може да оставите коментар и да информирате останалите.</div>");
		return;
	}
	for (var i=0, len=comments.length; i < len; i++) {
	  var commentString = "<div class='singleComment'>"+
        		"<img src='http://graph.facebook.com/"+comments[i]["fields"]["from_fb_id"]+"/picture' class='img-circle imgComment'>"+
				"<span class='commentName'> "+comments[i]["fields"]["from_fb_name"]+"</span>"+
				"<div class='commentText'>"+
					comments[i]["fields"]["comment"]+
				"</div>"+
        	"</div>";
        $(".commentsContainer").append(commentString);
	};
}

$('.carImage').magnificPopup({type:'image'});
$('.profileMenu').on('click', function(event){
    // The event won't be propagated up to the document NODE and 
    // therefore delegated events won't be fired
    event.stopPropagation();
});

function showPhoneNumber(post){
	$(post).prev().children().show("slow");
}

$(document).mouseup(function (e)
{
    var container = $(".phoneWeb");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide("slow");
    }
});

function attachActiveClass(self)
{
	$("#initial-direction").removeAttr("id");
	$(self).attr("id", "initial-direction");
}

function showPostsForDirection(self){
	$(".posts-loader").show();
	attachActiveClass(self);
	var from = ($(self).children().html()).split("-")[0].trim();
	var to = ($(self).children().html()).split("-")[1].trim();
	$(".directions-from").html(from);
	$(".directions-to-oposite").html(from);
	$(".directions-to").html(to);
	$(".directions-from-oposite").html(to);
	
	var direction = "";
	var oposite_dir = ""
		if(activeDirection() == "left")
		{
			direction = "left";
			oposite_dir = "right"}
		else{
			direction = "right";
			oposite_dir = "left"}
			
	var direction_from = $(".dir-active").children(".go-from").html().trim();
	var direction_to = $(".dir-active").children(".go-to").html().trim();
	$(".one-direction").html("");
	$(".second-direction").html("");
	startFrom = [0,0];
	showMorePosts(direction_from, direction_to, direction, true);
	showMorePosts(direction_to, direction_from, oposite_dir, false);
}

function lookForNewPosts(self)
{
	var from = ($(self).children().html()).split("-")[0].trim();
	var to = ($(self).children().html()).split("-")[1].trim();
	
	var direction = "";
	var oposite_dir = ""
		if(activeDirection() == "left")
		{
			direction = "left";
			oposite_dir = "right"}
		else{
			direction = "right";
			oposite_dir = "left"}
			
	var direction_from = $(".dir-active").children(".go-from").html().trim();
	var direction_to = $(".dir-active").children(".go-to").html().trim();
	
	showRecentPosts(direction_from, direction_to, direction, true);
	showRecentPosts(direction_to, direction_from, oposite_dir, false);
}

function showRecentPosts(direction_from, direction_to, direction, fill_active_dir){
	$.ajax({
					url : "/showRecentPosts/",
					type : 'POST', //this is the default though, you don't actually need to always mention it
					xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data : {
						direction_from : direction_from,
						direction_to: direction_to,
						last_post_id: last_post_id
					},
					success : function(data) {
						if(data["posts"].length > 0)
						{
							renderRecentPosts(data, fill_active_dir);
							actualiseFeedCounters(data["posts"].length);
						}
					},
					error : function(error) {
						console.log("ERROR:", error);
					},
				});
}

function actualiseLastPostDetails(message)
{
	console.log("1");
	if($(".last-post-user-content").length > 0){
		$(".last-post").find(".last-post-container").html(message);
		console.log("2");
	}
	else{
		console.log("3");
		$(".last-post").find(".last-post-container").html(message);
		$(".last-post").find(".timePost").html("току-що");
		$(".last-post").find(".name").html(user_fb_name);
		$(".last-post").find(".img-user").attr("src","http://graph.facebook.com/"+user_fb_id+"/picture?type=large");
		$(".last-post").find(".img-car").attr("src","/media/"+user_fb_car_image);
		$(".last-post").find(".rating").hide();
		$(".last-post").find(".lastPostUpdateText").attr("readonly", false);
		$(".last-post").find(".updateButtonNoPosts").click(function(){updateFunction();});
		console.log("4");
	}
}

function actualiseFeedCounters(numberPosts)
{
	if(activeDirection() == "left")
		startFrom[0]+=numberPosts;
	else
		startFrom[1]+=numberPosts;
}

function renderRecentPosts(posts, fill_active_dir){
	var selector = null;
	if(fill_active_dir){
		if (!$(".one-direction").is(":hidden"))
			selector = "." +  $(".one-direction").attr("class");
		else
			selector = "." +  $(".second-direction").attr("class");
	}
	else{
		if ($(".one-direction").is(":hidden"))
			selector = "." +  $(".one-direction").attr("class");
		else
			selector = "." +  $(".second-direction").attr("class");
	}
	
	for (var i=0, len=posts["posts"].length; i < len; i++) {
		var post = posts["posts"][len-1-i];
		var postString = "<div class='panel panel-default rideSharePost new-recent-post' style='display:none;' id='"+post[1]+"'>"+
		                                "<div class='profileCredentials'>"+
		                                 "<img src='http://graph.facebook.com/"+post[1]+"/picture?type=large' class='img-circle pull-left'>"+
		                                " <div class='nameAndRating'>"+
		                                  " <div class='timePost'>"+post[9]+"</div>"+
		                                   "<div class='name'>"+post[0]+"</div>"+
		                                   " <div class='rating'>";
		                                   
		 									/*var ratingString = "";                                   
											for (var j=0; j < 5; j++) {
											   if (j < parseInt(post[6]))
											   		ratingString += "<span>&#9733;</span>";
											   	else
											   		ratingString += "<span>☆</span>";
											};
 	postString += ratingString;*/
 	var otherString = 
		                             	 "</div>"+
		                                 "</div>"+
		                               " </div>"+
		                               " <a class='carImage' href='/media/"+post[2]+"'><img src='/media/"+post[2]+"' class='img-rounded pull-left'></a>"+
		                                 checkForMobile(post[3],post[1]) +
		                             
		                               " <div class='panel-body offertext'>"+
		                                    "<div class='clearfix'></div>"+
		                                     "<div class='lineSeparator'></div>"+
		                                    	post[4]+
		                                " </div>"+
		                                  "<div class='lineSeparatorFull'></div>"+
		                                  checkForUpdate(post[5])+
		                             " </div>";	
		
	postString += otherString;
	  	$(selector).prepend(postString);
	  	$(".new-recent-post").show("slow");
	};
	actualiseControlls();
	actualiseLastPostId();
}

function actualiseLastPostId()
{
		$.ajax({
					url : "/actualiseLastPostId/",
					type : 'POST', //this is the default though, you don't actually need to always mention it
					xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					success : function(data) {
						last_post_id = parseInt(data);
					},
					error : function(error) {
						console.log("ERROR:", error);
					},
				});
}

function activeDirection()
{
	if($(".dir-active").hasClass("direction-left"))
		return "left";
	else
		return "right";
}

function activePostDirection()
{
	if($(".ride-active").hasClass("ride-left"))
		return "left";
	else
		return "right";
}

function actualiseControlls()
{
	$('.carImage').magnificPopup({type:'image'});
	$( ".profileCredentials" ).click(function() {
		comment_id = $(this).parent().attr("id");
		$(".commentPopUpBox").show("fast");
		loadComments(comment_id);
		displayProfile(this);
	});
}

function showMorePosts(direction_from, direction_to, direction, fill_active_dir){
	var start_from;
	if(direction=="left") start_from=startFrom[0];
	else  start_from=startFrom[1];
	$.ajax({
					url : "/showMorePosts/",
					type : 'POST', //this is the default though, you don't actually need to always mention it
					xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data : {
						direction_from : direction_from,
						direction_to: direction_to,
						start_from: start_from,
						last_post_id: last_post_id
					},
					success : function(data) {
						if(data["posts"].length > 0)
						{
							renderMorePosts(data, fill_active_dir);
							if(direction=="left")
								startFrom[0]+=data["posts"].length;
							else
								startFrom[1]+=data["posts"].length;		
						}
						$(".posts-loader").hide();
						canScroll=true;
					},
					error : function(error) {
						console.log("ERROR:", error);
					},
				});
}

function renderMorePosts(posts, fill_active_dir){
	var selector = null;
	if(fill_active_dir){
		if (!$(".one-direction").is(":hidden"))
			selector = "." +  $(".one-direction").attr("class");
		else
			selector = "." +  $(".second-direction").attr("class");
	}
	else{
		if ($(".one-direction").is(":hidden"))
			selector = "." +  $(".one-direction").attr("class");
		else
			selector = "." +  $(".second-direction").attr("class");
	}
	
	for (var i=0, len=posts["posts"].length; i < len; i++) {
		var post = posts["posts"][i];
		var postString = "<div class='panel panel-default rideSharePost' id='"+post[1]+"'>"+
		                                "<div class='profileCredentials'>"+
		                                 "<img src='http://graph.facebook.com/"+post[1]+"/picture?type=large' class='img-circle pull-left'>"+
		                                " <div class='nameAndRating'>"+
		                                  " <div class='timePost'>"+post[9]+"</div>"+
		                                   "<div class='name'>"+post[0]+"</div>"+
		                                   " <div class='rating'>";
		                                   
		 									/*var ratingString = "";                                   
											for (var j=0; j < 5; j++) {
											   if (j < parseInt(post[6]))
											   		ratingString += "<span>&#9733;</span>";
											   	else
											   		ratingString += "<span>☆</span>";
											};
 	postString += ratingString;*/
 	var otherString = 
		                             	 "</div>"+
		                                 "</div>"+
		                               " </div>"+
		                               " <a class='carImage' href='/media/"+post[2]+"'><img src='/media/"+post[2]+"' class='img-rounded pull-left'></a>"+
		                                 checkForMobile(post[3],post[1]) +
		                             
		                               " <div class='panel-body offertext'>"+
		                                    "<div class='clearfix'></div>"+
		                                     "<div class='lineSeparator'></div>"+
		                                    	post[4]+
		                                " </div>"+
		                                  "<div class='lineSeparatorFull'></div>"+
		                                  checkForUpdate(post[5])+
		                             " </div>";	
		
	postString += otherString;
	  	$(selector).append(postString);
	};
	actualiseControlls();
}
function activateScrolling(){
	$("#main").scroll(function() {
		if(canScroll){
			var wrap = $(".mainContentWrapper")[0];
			var contentHeight = wrap.offsetHeight;
			var yOffset = $("#main")[0].scrollTop;
			var y = yOffset + window.innerHeight;
			//console.log(y+" "+contentHeight);
			if(y >= contentHeight-2){
				var direction_from = $(".dir-active").children(".go-from").html().trim();
				var direction_to = $(".dir-active").children(".go-to").html().trim();
				var direction = "";
				if(activeDirection() == "left")
					direction = "left";
				else
					direction = "right";
				canScroll = false;
				showMorePosts(direction_from, direction_to, direction, true);
			}
		}
	});	
}

function checkForMobile(tel, fbid){
	var mobileString = "";
	if(mobilecheck()){
		if (tel != null && tel!=undefined && tel!="" && tel!="None")
			mobileString += "<a class='callButton' href='tel:"+tel+"'><img src='/static/imgs/callButton.png' class='img-rounded connect' /></a>";
		if	(/iPhone|iphone/i.test(navigator.userAgent))
			mobileString += "<a class='messengerButton' href='fb-messenger://user-thread/"+fbid+"'><img src='/static/imgs/fb-messenger-button.png' class='img-rounded connect' /></a>";
		else
			mobileString +=  "<a class='messengerButton' href='fb-messenger://user/"+fbid+"'><img src='/static/imgs/fb-messenger-button.png' class='img-rounded connect' /></a>	";
	}
	else
	{
		if (tel != null && tel!=undefined && tel!="" && tel!="None")
			mobileString += "<div class='phoneWebContainer hidden-xs'><div class='phoneWeb' hidden>"+tel+"</div></div>" +"<a class='callButton' style='cursor: pointer;' onclick='showPhoneNumber(this);'><img src='/static/imgs/callButton.png' class='img-rounded connect' /></a>";
				
		mobileString += "<a class='messengerButton' target='_blank' href='https://www.messenger.com/t/"+fbid+"'><img src='/static/imgs/fb-messenger-button.png' class='img-rounded connect' /></a>";
		                          
	}
	return mobileString;
}

function checkForUpdate(update){
	var updateString = "";
	if (update != null && update!=undefined && update!="")
		updateString +=  "<div class='postUpdate'>"+
		                                    "<span class='updateTag'>Update: </span>"+
		                                    "<span class='update'>"+update+"</span>";
	return updateString;
}

function mobilecheck(){
	var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
// /iPhone|iphone/i.test(navigator.userAgent)

$(".nameSearch").keyup(function() {
	searchForUsers();
});

$(".searchButton").click(function() {
	searchForUsers();
});

function searchForUsers()
{	
	var name = $(".nameSearch").val().trim();
	if (name.length == 0 || name == "")
	{
		$(".resultsHolder").removeClass("res-container");
		$(".resultsHolder").html("");
		return;
	}
	
	$.ajax({
					url : "/searchName/",
					type : 'POST', //this is the default though, you don't actually need to always mention it
					xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data : {
						name:name
					},
					success : function(data) {
						renderSearchResults(data);
						//console.log(data);
					},
					error : function(error) {
						console.log("ERROR:", error);
					},
				});
}

function renderSearchResults(users)
{	
	$(".resultsHolder").addClass("res-container");
	if (users.length==0)
	{	
		$(".resultsHolder").html("<center><p>No data found.</p></center>");	
		return;	
	}
	
	$(".resultsHolder").html("");
	for (var i=0, len=users.length; i < len; i++) {
	  var string = "<div id='"+users[i]["fields"]["fb_id"]+"' class='searchResult'><img src='http://graph.facebook.com/"+users[i]["fields"]["fb_id"]+"/picture' class='img-circle resultImg'>"+users[i]["fields"]["fb_name"]+"</div>"
	  $(".resultsHolder").append(string);
	};
	
	actualiseCommentEvents(users);
}

function actualiseCommentEvents(users){
	$( ".searchResult" ).click(function() {
		comment_id = $(this).attr("id");
		$(".commentPopUpBox").show("fast");
		loadComments(comment_id);
		displayProfileFromSearchResult(comment_id, users);
	});
}
function displayProfileFromSearchResult(fb_id, users)
{
	var selectedUser = users.filter(function(user) {return user["fields"]["fb_id"]==fb_id;});
	var image_src = "http://graph.facebook.com/"+selectedUser[0]["fields"]["fb_id"]+"/picture";
	var name = selectedUser[0]["fields"]["fb_name"];
	var ratingString = "";
	var rating = parseInt(selectedUser[0]["fields"]["rating"]);                              
	for (var j=0; j < 5; j++) {
			if (j < rating)
				ratingString += "<span>&#9733;</span>";
			else
				ratingString += "<span>☆</span>";
	};
	$(".commentBox-image").attr("src", image_src);
	$(".commentBox-name").html(name);
	$(".commentBox-rating").html(ratingString);
}

window.onload = function(){
	var direction = $("#initial-direction");
	showPostsForDirection(direction);
	activateScrolling();
};
setInterval(function(){lookForNewPosts($("#initial-direction"));}, 30000);