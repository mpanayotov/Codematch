function getConversations()
{
	 $.ajax({
                url: "/company/getMesseges/",
                type: "GET",
                success: function(data) {
                	matches = createMatchObjects(data);
                	renderConversations(matches);
                },
                error: function(data) {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
}

function createMatchObjects(data)
{
	var all_msgs = data.filter(function(el){ return el.model == "matchseek.messege";});
	if(all_msgs.length == 0) $(".center-notification").show();
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

function renderConversations()
{
	for (var key in matches) {
	  	createMatch(matches[key].company, matches[key].talent, matches[key].position, matches[key].match, key);
	  	data = getChartInformation(matches[key].talent, matches[key].position);
	  	data[0] = data[0].map(function(el){ el.value = el.position; return el;});
	  	data[1] = data[1].map(function(el){ el.value = el.position; return el;});
	  	MovableRadarChart.draw("#chart-intersection"+key, data[0], {h:110, w:110, radius:0}, data[1]);
	};
	enableConversation();
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
	var conv = $(".conv-default").clone();
	conv.removeClass("conv-default");
	conv.attr("key", key);
	if(matches[key].messeges.length == 0) return;
	var msg = matches[key].messeges[matches[key].messeges.length-1];
	if (msg.fields.sender == "talent")
	{
		conv.find(".img-chat").attr("src", "/media/"+matches[key].talent.fields.profile_picture);
		conv.find(".chat-name").html(matches[key].talent.fields.username);
	}
	else
	{
		conv.find(".img-chat").attr("src", "/media/"+matches[key].company.fields.profile_picture);
		conv.find(".chat-name").html(matches[key].company.fields.company_name);
	}
	var date = (new Date(msg.fields.time)).toUTCString();
	var date_str = date.substring(0, date.length-4);
	conv.find(".chat-msg").html(date_str+"<br/>"+msg.fields.text);
	conv.show();
	$(".conversations").append(conv);
}

function enableConversation()
{
	$(".conversation").on('click', function(event){
	   $(".conversations").hide("slow");
       var key = $(this).attr("key");
       $(".msg-button-send").attr("key", key);
       $(".chat-div").show("slow");
	   renderChatMsgs(key);
   });
}

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
	setTimeout(function(){
		$(".chat-div").show("slow", function(){
			$("html, body").animate({ scrollTop: $(document).height() }, 1500);
		});
	},600);
}

$(".msg-button-send").on('click', function(){
     var text = $(".messege-box").val().trim();
     if(text=="")
     {
     	alert("Please, type a messege.");
     	return;
     }
     var key = $(this).attr("key");
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
                	renderChatMsgs(key);
                	$(".messege-box").val("");
                },
                error: function(data) {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
      
});

function clearChatMesseges()
{
	$(".messeges .msg").not(".default-msg").remove();
}

$(".back-btn").on('click', function(event){
       $(".chat-div").hide("slow");
       $(".conversations").show("slow");
   });