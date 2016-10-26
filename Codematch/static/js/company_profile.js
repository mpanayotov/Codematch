function displayTechStack(stack)
{
	var parts = stack.slice(0,-1).split(",");
	for (var i=0; i < parts.length; i++) {
	  $(".techStack").append("<li>"+parts[i]+"</li>");
	};
}
function displayPerks(perks)
{
	var parts = perks.slice(0,-1).split(",");
	for (var i=0; i < parts.length; i++) {
	  $(".perksList").append("<li>"+parts[i]+"</li>");
	};
}
function displayLinks(crunch_base, angel_list, website)
{
	if(crunch_base=="" && angel_list=="" && website=="")
		return;
	
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
	
	$(".media").show();
	if(fb != "")
	  	$(".mediaList").append("<a target='_blank' href='"+fb+"'><img class='img-refs' src='/static/img/fb.png'></a>");
	if(twitter != "")
	  	$(".mediaList").append("<a target='_blank' href='"+twitter+"'><img class='img-refs' src='/static/img/twitter.png'></a>");
	if(youtube != "")
		$(".mediaList").append("<a target='_blank' href='"+youtube+"'><img class='img-refs' src='/static/img/YouTube.png'></a>");
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