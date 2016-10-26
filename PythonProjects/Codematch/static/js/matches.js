function getMatches()
{
	 $.ajax({
                url: "/company/getmatches/",
                type: "GET",
                success: function(data) {
                	matches = createMatchObjects(data);
                	renderMatches(matches);
                },
                error: function(data) {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
}

function createMatchObjects(data)
{
	if(data.length == 0) $(".center-notification").show();
	var matchesDictionary = {};
	var match_objects = data.filter(function(el){ return el.model == "matchseek.match";});
	for (var i=0; i < match_objects.length; i++) {
		var obj = {};
		var match = match_objects[i];
		var company = data.filter(function(el){ return el.model == "companies.company" && el.pk==match.fields.company_id;})[0];
		var talent = data.filter(function(el){ return el.model == "talents.talent" && el.pk==match.fields.talent_id;})[0];
		var position = data.filter(function(el){ return el.model == "companies.position" && el.pk==match.fields.position_id;})[0];
		var companyImages = unique(data.filter(function(el){ return el.model == "companies.companyimages" && el.fields.company_id==company.pk;}));
		var messeges = data.filter(function(el){ return el.model == "matchseek.messege" && el.fields.match_id==match.pk;});
		obj["company"] = company;
		obj["talent"] = talent;
		obj["position"] = position;
		obj["match"] = match;
		obj["companyImages"] = companyImages;
		obj["messeges"] = messeges;
		
	  	matchesDictionary[i] = obj;
	};
	return matchesDictionary;
}

function unique(arr)
{
	var flags = [], output = [], l = arr.length, i;
	for( i=0; i<l; i++) {
	    if( flags[arr[i].fields.image]) continue;
	    flags[arr[i].fields.image] = true;
	    output.push(arr[i]);
	}
	return output;
};

function renderMatches()
{
	renderPositions();
	for (var key in matches) {
	  	createMatch(matches[key].company, matches[key].talent, matches[key].position, matches[key].match, key);
	  	data = getChartInformation(matches[key].talent, matches[key].position);
	  	data[0] = data[0].map(function(el){ el.value = el.position; return el;});
	  	data[1] = data[1].map(function(el){ el.value = el.position; return el;});
	  	MovableRadarChart.draw("#chart-intersection"+key, data[0], {h:110, w:110, radius:0}, data[1]);
	};
	enableCompanyDetailedInfo();
	enableMatchDetailedInfo();
}

function renderPositions()
{
	positions = [];
	var used = [];
	for(var key in matches)
	{
		if(used.indexOf(matches[key].position.pk) != -1) continue;
		positions.push(matches[key].position);
		used.push(matches[key].position.pk);
	};
	for (var i=0; i < positions.length; i++) {
	  	var p = $(".position-default").clone();
	  	p.removeClass("position-default");
	  	p.attr("position-key", positions[i].pk);
		p.find("#chart").attr("id", "chart-position-"+positions[i].pk);
	  	$(".positionSection").append(p);
	  	
	  	data = getJsonData(positions[i].fields.time_preferences);
	  	data = data.map(function(el){ el.value = el.position; return el;});
	  	MovableRadarChart.draw("#chart-position-"+positions[i].pk, data, {h:90, w:90, radius:0});
	  	var skillsJson = JSON.parse(positions[i].fields.tech_skills);
	  	techSkills = [];
		for (var key in skillsJson) {
		  techSkills += "<a class='btn btn-default btn-lg tech'><i class='devicon-"+key+"'></i><span class='network-name'>"+skillsJson[key]+"</span></a>";
		};
		p.find(".position-stack").html(techSkills);
		positionDetails = "<a class='btn btn-default btn-lg worktype'><span class='network-name'>"+positions[i].fields.work_type+"</span></a>"
					+ "<a class='btn btn-default btn-lg exp-lvl'><span class='network-name'>"+positions[i].fields.exp_level+"</span></a>";
		p.find(".position-details").html(positionDetails);
		p.find(".position-title").html(positions[i].fields.title);
		numberMatches = parseInt(countMatchesForPosition(positions[i].pk));
		if (numberMatches == 1)
			p.find(".matches-number").html(numberMatches + " Match");
		else
			p.find(".matches-number").html(numberMatches + " Matches");
		p.find(".salary").html("Max.Salary: &#8364 "+positions[i].fields.salary+"k / year");
		  	
	  	p.show();
	};
}

function countMatchesForPosition(pk)
{
	var count = 0;
	for(var key in matches)
	{
		if(matches[key].position.pk == pk)
			count++;
	};
	return count;
}

function getChartInformation(talent, position)
{
	data = [];
	talent_chart = getJsonData(talent.fields.time_preferences);
	position_chart = getJsonData(position.fields.time_preferences);
	data.push(talent_chart);
	data.push(position_chart);
	return data;
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
	return options;
}

function createMatch(company, talent, position, match, key)
{
	var response=match.fields.is_talent_interested;
	response = response == true ? "Interested" : response == false ? "not interested" :"not responded";
	var match_str = "<div class='match' key='"+key+"'>"
						+"<div class='col-lg-3 shapes'>"
							+"<div class='shape-div'>"
								+"<div class='chart-holder'>"
									+"<div id='chart-intersection"+key+"'></div>"
								+"</div>"
								+"<div class='img-holder'>"
									+"<img src='/media/"+talent.fields.profile_picture+"' class='img-circle logo-company'>"
								+"</div>"
							+"</div>"
						+"</div>"
						+"<div class='col-lg-2'>"
							+"<div class='company-name'>"+talent.fields.username+"</div>"
							+"<div class='response-type text-center'>"+response+"</div>"
						+"</div>"
						+"<div class='col-lg-2'>"
							+"<div class='more-info'>"
								+"<div>Location: "+talent.fields.location+"</div>"
								+"<div>Min. Salary: &#8364 "+talent.fields.salary+"k /yr</div>"
								+"<div>Match: "+match.fields.match+"%</div>"
							+"</div>"
						+"</div>"
						+"<div class='col-lg-5 talent-info'>"
							+"<div class='tech-stack-match'>";
	var techSkills = "";
	var skillsJson = JSON.parse(talent.fields.tech_skills);
	for (var key in skillsJson) {
	  techSkills += "<a class='btn btn-default btn-lg tech'><i class='devicon-"+key+"'></i><span class='network-name'>"+skillsJson[key]+"</span></a>";
	};	
	match_str += techSkills;
	match_str += 	"</div>"
						+"<div class='more-info-match'>"
							+"<a class='btn btn-default btn-lg worktype'><span class='network-name'>"+talent.fields.work_type+"</span></a>"
							+"<a class='btn btn-default btn-lg exp-lvl'><span class='network-name'>"+talent.fields.exp_level+"</span></a>"
						+"</div>"
						+"</div>"
						+"<br style='clear: both;'>"
					+"</div>";
	
	$("[position-key='"+position.pk+"']").append(match_str);
}


function addCompanyDetailedInfo(company, companyImages)
{
	displayTechStack(company.fields.tech_stack);
	displayPerks(company.fields.perks);
	displayLinks(company.fields.crunch_base_url, company.fields.angel_list_url, company.fields.website_url);
	displayInvestors(company.fields.investors);
	displayMedia(company.fields.fb_page_url, company.fields.twitter_page_url, company.fields.youtube_channel_url);
	$(".nameHolder").html(company.fields.company_name);
	$(".shortDescription").html(company.fields.short_description);
	$(".longDescription").html(company.fields.long_description);
	$(".location").html(company.fields.location);
	$(".foundation-year").html(company.fields.foundation_year);
	$(".company-size").html(company.fields.company_size+" Employees");
	$(".industry").html(company.fields.industry);
	$(".about").html("About "+company.fields.company_name);
	displayImages(companyImages);
}

function enableVideos()
{
	//$(".videoUrl").attr("height", $("#company-modal"+company.pk+".videoUrl").width()/1.8);
	setTimeout(function(){
	$(".videoUrl").each(function(){
		$(this).attr("height", $(this).width()/1.8);
	});
	}, 1000);
}

function enableMatchDetailedInfo()
{
	$(".match").on('click', function(event){
       var key = $(this).attr("key");
       $(".positionSection").hide("slow");
       $(".talentProfile").show("slow");
       $(".talentProfile").attr("key", key);
       renderMatchInfo(key);
       if(matches[key].match.fields.is_talent_interested)
	  		showChat(key);
	   renderChatMsgs(key);
   });
}

$(".back-btn").on('click', function(event){
       $(".talentProfile").hide("slow");
       $(".positionSection").show("slow");
       $(".chat-div").hide();
   });

function renderChatMsgs(key)
{
	clearChatMesseges();
	messeges = matches[key].messeges;
	if(messeges.length != 0){
		for (var i=0; i < messeges.length; i++) {
			var msg = $(".messeges .default-msg").clone();
			msg.removeClass("default-msg");
			var profile_picture;
			var name;
			if (messeges[i].fields.sender == "talent")
			{
				profile_picture = matches[key].talent.fields.profile_picture;
				name = matches[key].talent.fields.username;
			}
			else
			{
				profile_picture = matches[key].company.fields.profile_picture;
				name = matches[key].company.fields.company_name;
			}
			var date = (new Date(matches[key].messeges[i].fields.time)).toUTCString();
			var date_str = date.substring(0, date.length-4);
			msg.find(".msg-name-date").html(name + " | " + date_str);
			msg.find(".msg-img").attr("src", "/media/"+profile_picture);
			msg.find(".msg-text").html(messeges[i].fields.text);
			$(".messeges").append(msg);
			msg.show();
		};
	}
}

$(".msg-button-send").on('click', function(){
     var text = $(".messege-box").val().trim();
     if(text=="")
     {
     	alert("Please, type a messege.");
     	return;
     }
     var key = $(".talentProfile").attr("key");
     var match = matches[key].match;
     
     $.ajax({
                url: "/createMessege/",
                type: "POST",
                data:{
                	match_id : match.pk,
                	text: text
                },
                success: function(data) {
                	//console.log(data);
                	matches[key].messeges.push(data[0]);
                	showChat(key);
                	$(".messege-box").val("");
                },
                error: function(data) {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
      
});

function renderMatchInfo(key)
{
	   var p = $(".talentProfile");
   	   p.find(".profile-img").attr("src", "/media/"+matches[key].talent.fields.profile_picture);
   	   p.find(".username").html(matches[key].talent.fields.username);
   	   p.find(".location").html(matches[key].talent.fields.location);
	   p.find(".work-description").html(matches[key].talent.fields.work_description);
	   p.find(".role").html(matches[key].talent.fields.role);
	   var relocate = (function(){if(matches[key].talent.fields.relocate) return "Can relocate"; else return "Cannot relocate";})();
   	   var info = 	"<a class='btn btn-default btn-lg exp-lvl'><span class='network-name'>"+matches[key].talent.fields.exp_level+"</span></a>"
					+"<a class='btn btn-default btn-lg worktype'><span class='network-name'>"+matches[key].talent.fields.work_type+"</span></a>"
					+"<a class='btn btn-default btn-lg relocate'><span class='network-name'>"+relocate+"</span></a>";
	   p.find(".detailsInfo").html(info);
	   var skillsJson = JSON.parse(matches[key].talent.fields.tech_skills);
	   techSkills = "";
	   for (var i in skillsJson) {
		  techSkills += "<a class='btn btn-default btn-lg tech'><i class='devicon-"+i+"'></i><span class='network-name'>"+skillsJson[i]+"</span></a>";
	   };
	   p.find(".techSkills").html(techSkills);
	   p.find(".salary").html("&#8364 "+matches[key].talent.fields.salary+"k / year");
	   p.find(".ed-original").addClass(matches[key].talent.fields.editor);
	   p.find(".os-original").addClass(matches[key].talent.fields.operating_system);
	   p.find(".github").parent().attr("href", matches[key].talent.fields.github_url);
	   p.find(".linkedin").parent().attr("href", matches[key].talent.fields.linkedin_url);
	   data = getChartInformation(matches[key].talent, matches[key].position);
	   data[0] = data[0].map(function(el){ el.value = el.position; return el;});
	   data[1] = data[1].map(function(el){ el.value = el.position; return el;});
	   MovableRadarChart.draw(".talentProfile #chart", data[0], {h:350, w:350, radius:0}, data[1]);
}

function enableCompanyDetailedInfo()
{
	$(".more-company").on('click', function(event){
		var key = $(".chosenMatch").attr("key");
		addCompanyDetailedInfo(matches[key].company, matches[key].companyImages);
		$(".videoUrl").attr({"src": "//www.youtube.com/embed/" + getId(matches[key].company.fields.video_url),
			"height": $(".videoUrl").width()/1.8});
        $("#company-modal").modal("show");
   });
   
   $( ".modal" ).on('shown.bs.modal', function(){
     	$(this).find(".videoUrl").attr("height", $(this).find(".videoUrl").width()/1.8);
	});
}

function displayImages(companyImages)
{
	$(".picturesHolder").html("");
	for (var i=0; i < companyImages.length; i++) {
	  	var imageEl = "<div class='col-sm-6 img-col'>"
									+"<div class='project-wrapper'>"
					                    +"<div class='project'>"
					                        +"<div class='photo-wrapper'>"
					                            +"<div class='photo'>"
					                            	+"<a class='fancybox' href='/media/"+companyImages[i].fields.image+"'>"
					                            		+"<img class='img-responsive' src='/media/"+companyImages[i].fields.image+"' alt=''></a>"
					                            +"</div>"
					                            +"<div class='overlay'></div>"
					                        +"</div>"
					                    +"</div>"
					                +"</div>"
								+"</div>";
		$(".picturesHolder").append(imageEl);
	};
}

function displayTechStack(stack)
{
	var parts = stack.slice(0,-1).split(",");
	$(".techStack").html("");
	for (var i=0; i < parts.length; i++) {
	  $(".techStack").append("<li>"+parts[i]+"</li>");
	};
}
function displayPerks(perks)
{
	var parts = perks.slice(0,-1).split(",");
	$(".perksList").html("");
	for (var i=0; i < parts.length; i++) {
	  $(".perksList").append("<li>"+parts[i]+"</li>");
	};
}
function displayLinks(crunch_base, angel_list, website)
{
	if(crunch_base=="" && angel_list=="" && website=="")
		return;
	$(".linksList").html("");
	$(".links").show();
	if(crunch_base != "")
	  	$(".linksList").append("<a target='_blank' href='"+crunch_base+"'><span class='separator'>"+crunch_base+"</span></a>");
	if(angel_list != "")
	  	$(".linksList").append("<a target='_blank' href='"+angel_list+"'><span class='separator'>"+angel_list+"</span></a>");
	$(".linksList").append("<a target='_blank' href='"+website+"'><span>"+website+"</span></a>");
}
function displayInvestors(investors)
{
	if(investors=="")
	 	return
	$(".investorList").html("");
	$(".investors").show(); 
	var parts = investors.slice(0,-1).split(",");
	for (var i=0; i < parts.length; i++) {
		if(i < parts.length-1)
	  		$(".investorList").append("<span class='separator'>"+parts[i]+"</span>");
	  	else
	  		$(".investorList").append("<span class=>"+parts[i]+"</span>");
	};
}
function displayMedia(fb, twitter, youtube)
{
	if(fb=="" && twitter=="" && youtube=="")
		return;
	$(".mediaList").html("");
	$(".media").show();
	if(fb != "")
	  	$(".mediaList").append("<a target='_blank' href='"+fb+"'><img class='img-refs' src='/static/img/fb.png'></a>");
	if(twitter != "")
	  	$(".mediaList").append("<a target='_blank' href='"+twitter+"'><img class='img-refs' src='/static/img/twitter.png'></a>");
	if(youtube != "")
		$(".mediaList").append("<a target='_blank' href='"+youtube+"'><img class='img-refs' src='/static/img/YouTube.png'></a>");
}
function enableBlink()
{
	 setInterval(function(){
	 	$(".interested").fadeTo(500,0.5,function(){
	 		setTimeout(function(){
	 			$(".interested").fadeTo(500,1);
	 		},500);
	 	});
	 },1000);
}

$(".interested").on("click",function(){
		var key = $(".chosenMatch").attr("key");
		matches[key].match.fields.is_talent_interested = true;
	 	$(".chat-div").show("fast");
	 	$(".main-btns").hide();
	 	$(".interested-sign").show();
	 	$("html, body").animate({ scrollTop: $(document).height() }, 1500);
	 	$(".messege-box").focus();
	 	clearChatMesseges();
	 	saveChoice(matches[key].match.pk);
});

function clearChatMesseges()
{
	$(".messeges .msg").not(".default-msg").remove();
}

function saveChoice(match_id)
{
	$.ajax({
                url: "/saveChoice/",
                type: "POST",
                data:{
                	match_id : match_id
                },
                success: function(data) {
                	console.log(data);
                },
                error: function(data) {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
}

$(".arrow-right").on("click",function(){
	var currentPosition = $(".chosenMatch").attr("key");
	for (var key in matches) {
	  	if(key == currentPosition)
	  	{
	  		key = parseInt(key);
	  		if(matches[key+1] == undefined)
	  			break;
	  		$(".chosenMatch").hide();
			$(".chosenMatch").attr("key", key+1);
			renderMatchInfo(key+1);
			$(".chosenMatch").show("slow");
			var talentIsInterested = matches[key+1].match.fields.is_talent_interested;
	  		if(talentIsInterested)
	  			showChat(key+1);
	  		else
	  			hideChatAndShowMainBtns();
	  		break;
	  	}
	};
});

$(".arrow-left").on("click",function(){
	var currentPosition = $(".chosenMatch").attr("key");
	for (var key in matches) {
	  	if(key == currentPosition)
	  	{
	  		key = parseInt(key);
	  		if(matches[key-1] == undefined)
	  			break;
	  		$(".chosenMatch").hide();
			$(".chosenMatch").attr("key", key-1);
			renderMatchInfo(key-1);
			$(".chosenMatch").show("slow");
			var talentIsInterested = matches[key-1].match.fields.is_talent_interested;
	  		if(talentIsInterested)
	  			showChat(key-1);
	  		else
	  			hideChatAndShowMainBtns();
	  		break;
	  	}
	};
});

function hideChatAndShowMainBtns()
{
	$(".main-btns").show();
	$(".chat-div").hide();
	$(".interested-sign").hide();
}

function showChat(key)
{
	renderChatMsgs(key);
	setTimeout(function(){
		$(".chat-div").show("slow", function(){
			$("html, body").animate({ scrollTop: $(document).height() }, 1500);
		});
	},600);
}
