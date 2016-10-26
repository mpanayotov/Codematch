function getBatchData()
{
	 $.ajax({
                url: "/getRequests/",
                type: "GET",
                success: function(data) {
                	batch_data = createBatchDataObjects(data);
                	renderData();
                },
                error: function(data) {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
}

function createBatchDataObjects(data)
{
	batches = data.filter(function(el){ return el.model == "matchseek.batch";});
	var batchDataDictionary = {};
	var talents = data.filter(function(el){ return el.model == "talents.talent";});
	var companies = data.filter(function(el){ return el.model == "companies.company";});
	var positions = data.filter(function(el){ return el.model == "companies.position";});
	var talentInfo = [];
	for (var i=0; i < talents.length; i++) {
		var obj = {};
		var talent = talents[i];
		var batchtalent = data.filter(function(el){ return el.model == "matchseek.batchtalent" &&
														 el.fields.talent_id==talent.pk;})[0];
		var batch = data.filter(function(el){ return el.model == "matchseek.batch" &&
														 el.pk==batchtalent.fields.batch_id;})[0];
		obj["talent"] = talent;
		obj["batchtalent"] = batchtalent;
		obj["batch"] = batch;
		
	  	talentInfo.push(obj);
	};
	var companyInfo = [];
	for (var i=0; i < companies.length; i++) {
		var obj = {};
		var company = companies[i];
		var batchcompany = data.filter(function(el){ return el.model == "matchseek.batchcompany" &&
														 el.fields.company==company.pk;})[0];
		var batch = data.filter(function(el){ return el.model == "matchseek.batch" &&
														 el.pk==batchcompany.fields.batch;})[0];
		var positions = data.filter(function(el){ return el.model == "companies.position" &&
														el.fields.company==company.pk;});
		var companyimages = data.filter(function(el){ return el.model == "companies.companyimages" &&
														el.fields.company_id==company.pk;});
		
		obj["company"] = company;
		obj["batchcompany"] = batchcompany;
		obj["batch"] = batch;
		obj["positions"] = positions;
		obj["companyimages"] = companyimages;
		
	  	companyInfo.push(obj);
	};
	
	batchDataDictionary["talents"]=talentInfo;
	batchDataDictionary["companies"]=companyInfo;
	
	return batchDataDictionary;
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

function renderData()
{
	$(".batchHolder").not(".batch-default").remove();
	for (var i=0; i < batches.length; i++) {
	  var companies_for_batch = batch_data.companies.filter(function(el){ return el.batch.pk == batches[i].pk;});
	  var talents_for_batch = batch_data.talents.filter(function(el){ return el.batch.pk == batches[i].pk;});
	  renderObjectsForBatch(talents_for_batch, companies_for_batch, batches[i]);
	};
	enableTalentApproveBtns();
	enableCompanyApproveBtns();
	enableCompanyDetailedInfo();
	enableMatchCreation();
}

function enableMatchCreation()
{
		$('.findMatchBtn').on('click', function(event){ 
		    var batch_id = $(this).attr("batch-id");
		    if (batch_id == "")
		    {
		    	alert("Cannot extract batch id.");
		    	return;
		    }
	        $.ajax({
	                url: "/adminpanel/findMatches/",
	                type: "POST",
	                xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data: {
						batch_id:batch_id
					},
	                success: function(data) {
	                	alert(data);
	                },
	                error: function() {
	                    alert("Error occured. Please notify us at: support@codematch.eu");
	                },
	            });
	            
	    });
}

function enableTalentApproveBtns()
{
		$('.approveBtn').on('click', function(event){ 
		    var batchtalent_id = $(this).attr("batchtalent-id");
		    if (batchtalent_id == "")
		    {
		    	alert("Cannot extract batchtalent id.");
		    	return;
		    }
	        $.ajax({
	                url: "/approve/talent/",
	                type: "POST",
	                xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data: {
						batchtalent_id:batchtalent_id
					},
	                success: function(data) {
	                	if(data == "Successfully_approved")
	                		getBatchData();
	                	else
	                		alert("Error occured. Please notify us at: support@codematch.eu");
	                },
	                error: function() {
	                    alert("Error occured. Please notify us at: support@codematch.eu");
	                },
	            });
	            
	    });
}

function enableCompanyApproveBtns()
{
	$('.approveBtnCompany').on('click', function(event){ 
		    var batchcompany_id = $(this).attr("batchcompany-id");
		    if (batchcompany_id == "")
		    {
		    	alert("Cannot extract batchcompany id.");
		    	return;
		    }
	        $.ajax({
	                url: "/approve/company/",
	                type: "POST",
	                xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data: {
						batchcompany_id:batchcompany_id
					},
	                success: function(data) {
	                	if(data == "Successfully_approved")
	                		getBatchData();
	                	else
	                		alert("Error occured. Please notify us at: support@codematch.eu");
	                },
	                error: function() {
	                    alert("Error occured. Please notify us at: support@codematch.eu");
	                },
	            });
	            
	    });
}

function renderObjectsForBatch(talents, companies, batch)
{
	var batch_el = $(".batch-default").clone();
	batch_el.removeClass("batch-default");
	batch_el.attr("batch-key", batch.pk);
	
	batch_el.find(".batch").html("BATCH_ID: "+batch.pk+"| BATCH_NAME "+batch.fields.name+
			"| START:"+getTime(batch.fields.start_date)+"| END "+getTime(batch.fields.end_date));
	batch_el.find(".findMatchBtn").attr("batch-id", batch.pk);
	batch_el.find(".batchInfo").html(getBatchInfo(talents, companies));
	$("#container").append(batch_el);
	batch_el.show();
	for (var i=0; i < talents.length; i++) {
	   var el = batch_el.find(".talent-default").clone();
	   el.removeClass("talent-default");
	   batch_el.find(".talentsSection").append(el);
	   el.show();
	   var talent = talents[i];
	   el.find("#chart").attr("class", "chart-"+batch.pk+"-"+talent.talent.pk);
	   var data = getJsonData(talent.talent.fields.time_preferences);
	   console.log(data);
	   data = data.map(function(el){ el.value = el.position; return el;});
	   MovableRadarChart.draw(".chart-"+batch.pk+"-"+talent.talent.pk, data, {h:140, w:140, radius:0});
	   var skillsJson = JSON.parse(talent.talent.fields.tech_skills);
	  	techSkills = [];
		for (var key in skillsJson) {
		  techSkills += "<a class='btn btn-default btn-lg tech'><i class='devicon-"+key+"'></i><span class='network-name'>"+skillsJson[key]+"</span></a>";
		};
	   el.find(".techSkills").html(techSkills);
	   el.find(".salary").html(talent.talent.fields.salary);
	   el.find(".profile-img").attr("src", "/media/"+talent.talent.fields.profile_picture);
	   el.find(".username").html(talent.talent.fields.username);
	   el.find(".location").html(talent.talent.fields.location);
	   el.find(".role").html(talent.talent.fields.role);
	   el.find(".work-description").html(talent.talent.fields.work_description);
	   var exp_lvl = talent.talent.fields.exp_level;
	   var work_type = talent.talent.fields.work_type;
	   var relocate = talent.talent.fields.relocate ? "Can relocate" : "Cannot relocate";
	   el.find(".detailsInfo").html(
	   	"<a class='relocate'><span class='network-name'>"+exp_lvl+"</span></a>"+
	   	"<a class='relocate'><span class='network-name'>"+work_type+"</span></a>"+
	   	"<a class='relocate'><span class='network-name'>"+relocate+"</span></a>"
	   );
	   el.find(".ed-original").addClass(talent.talent.fields.editor);
	   el.find(".os-original").addClass(talent.talent.fields.operating_system);
	   if(!talent.batchtalent.fields.approved)
	   {
	   		el.find(".approveBtn").attr("batchtalent-id", talent.batchtalent.pk);
	   		el.find(".approveBtn").show();
	   }
	   else
	   {
	   	   el.find(".approved").show();
	   }
	   renderPossibleMatches(talent.talent, companies, el, batch);
	};
	
	for (var i=0; i < companies.length; i++) {
		var company = companies[i];
		for (var j=0; j < companies[i].positions.length; j++) {
		   var el = batch_el.find(".position-default").clone();
		   el.removeClass("position-default");
		   batch_el.find(".companies").append(el);
		   el.show();
		   var position = companies[i].positions[j];
		   el.find("#chart-position").attr("class", "chart-position-"+batch.pk+"-"+position.pk);
		   var data = getJsonData(position.fields.time_preferences);
		   data = data.map(function(el){ el.value = el.position; return el;});
		   MovableRadarChart.draw(".chart-position-"+batch.pk+"-"+position.pk, data, {h:140, w:140, radius:0});
		   var skillsJson = JSON.parse(position.fields.tech_skills);
		  	techSkills = [];
			for (var key in skillsJson) {
			  techSkills += "<a class='btn btn-default btn-lg tech'><i class='devicon-"+key+"'></i><span class='network-name'>"+skillsJson[key]+"</span></a>";
			};
		   el.find(".techStackPosition").html(techSkills);
		   el.find(".companysalary").html(position.fields.salary);
		   el.find(".company-img").attr("src", "/media/"+company.company.fields.profile_picture);
		   el.find(".more-company").attr("batch-company-key", i).html("More");
		   el.find(".companyname").html(company.company.fields.company_name);
		   el.find(".companylocation").html(company.company.fields.location);
		   el.find(".positionrole").html(position.fields.title);
		   el.find(".project-description").html(position.fields.project_description);
		   var exp_lvl = position.fields.exp_level;
		   var work_type = position.fields.work_type;
		   var relocate = position.fields.relocate ? "Can relocate" : "Cannot relocate";
		   el.find(".detailsInfoCompany").html(
		   	"<a class='relocate'><span class='network-name'>"+exp_lvl+"</span></a>"+
		   	"<a class='relocate'><span class='network-name'>"+work_type+"</span></a>"+
		   	"<a class='relocate'><span class='network-name'>"+relocate+"</span></a>"
		   );   		
	   };
	   
	   if(!company.batchcompany.fields.approved)
		   {
		   	    var approve_btn = "<div batchcompany-id='"+company.batchcompany.pk+"' class='approveBtnCompany text-center'>APPROVE</div>";
		   		batch_el.find(".companies").append(approve_btn);
		   }
		   else
		   {
		   	   batch_el.find(".companies").append("<div class='approved-company text-center'>ALREADY APPROVED</div>");
		   }	
	};
}

function getBatchInfo(talents, companies)
{
	var approved = 0;
	var unapproved = 0;
	for (var i=0; i < companies.length; i++) {
	  	if(companies[i].batchcompany.fields.approved)
	  		approved++;
	  	else
	  		unapproved++;
	};
	var talents_approved = 0;
	var talents_unapproved = 0;
	for (var i=0; i < talents.length; i++) {
	  	if(talents[i].batchtalent.fields.approved)
	  		talents_approved++;
	  	else
	  		talents_unapproved++;
	};
	var returnedString = "Companies: "+companies.length+" (approved:"+approved+", unapproved:"+unapproved+") "+
				" <------------------------> "+
				"Talents: "+talents.length+" (approved:"+talents_approved+", unapproved:"+talents_unapproved+")";
	return returnedString;
	
}

function renderPossibleMatches(talent, companies, el, batch)
{
	for (var i=0; i < companies.length; i++) {
		for (var j=0; j < companies[i].positions.length; j++) {
		  	var position = companies[i].positions[j];
		  	var tech_skills_score = techScoreBetween(position, talent);
		  	var time_score = timeScoreBetween(position, talent);
		  	console.log(tech_skills_score, time_score);
		  	var overall_score = tech_skills_score*0.3 + time_score*0.7;
		  	var salaries_match = salariesMatch(position.fields.salary, talent.fields.salary);
		  	if(overall_score >= 0 && salaries_match)
		  	{
		  		var possible_match = el.find(".possible-match-default").clone();
		  		possible_match.removeClass("possible-match-default");
		  		el.find(".other-info").append(possible_match);
		  		possible_match.show();
		  		possible_match.find("#chart-match").attr(
		  			"class", "chart-match-"+batch.pk+"-"+talent.pk+"-"+position.pk);
		  		var data = getChartInformation(talent, position);
			    data[0] = data[0].map(function(el){ el.value = el.position; return el;});
	  			data[1] = data[1].map(function(el){ el.value = el.position; return el;});
	     		MovableRadarChart.draw(".chart-match-"+batch.pk+"-"+talent.pk+"-"+position.pk,
	     								 data[0], {h:140, w:140, radius:0}, data[1]);
	     		var skillsJson = JSON.parse(position.fields.tech_skills);
			  	techSkills = [];
				for (var key in skillsJson) {
				  techSkills += "<a class='btn btn-default btn-lg match-tech'><i class='devicon-"+key+"'></i><span class='network-name'>"+skillsJson[key]+"</span></a>";
				};
			    possible_match.find(".match-tech-skills").html(techSkills);
			    possible_match.find(".match-salary").html("Max Salary: "+position.fields.salary+"&#8364");
			    possible_match.find(".match-company").html(companies[i].company.fields.company_name);
			    possible_match.find(".match-position").html(position.fields.title);
			    possible_match.find(".match-score").html(parseFloat(overall_score).toFixed(2)+" %");
		  	}
	  	};
	};
}

function techScoreBetween(position, talent)
{
	var position_skills = JSON.parse(position.fields.tech_skills);
	var talent_skills = JSON.parse(talent.fields.tech_skills);
	var counter = 0;
	for(var x in position_skills)
	{
		for(var y in talent_skills)
		{
			if(position_skills[x] == talent_skills[y])
				counter++;
		};
	};
	return counter*20;
}

function timeScoreBetween(position, talent)
{
	var data = getChartInformation(talent, position);
	//data[0] = data[0].map(function(el){ el.value = el.position; return el;});
	//data[1] = data[1].map(function(el){ el.value = el.position; return el;});
	var interesect_polygon = intersectionPolygons(data[0], data[1]);
	var x1 = interesect_polygon.map(function(p) { return p.x;});
	var y1 = interesect_polygon.map(function(p) { return p.y;});
	var area1 = polygonArea(x1,y1,x1.length);
	console.log(x1.length, y1.length, interesect_polygon);
	var x2 = data[0].map(function(p) { return p.x;});
	var y2 = data[0].map(function(p) { return p.y;});
	var area2 = polygonArea(x2,y2,x2.length);
	console.log(area1, area2);
	var coverage = (area1/area2)*100;
	//console.log(coverage);
	return coverage;
}

function salariesMatch(position_salary, talent_salary)
{
	var min = parseInt(talent_salary.split("-")[0]);
	var max = parseInt(talent_salary.split("-")[1]);
	position_salary = parseInt(position_salary);
	return min <= position_salary && position_salary <= max;
}

function polygonArea(X, Y, numPoints) 
{ 
  area = 0;         // Accumulates area in the loop
  j = numPoints-1;  // The last vertex is the 'previous' one to the first

  for (i=0; i<numPoints; i++)
    { area = area +  (X[j]+X[i]) * (Y[j]-Y[i]); 
      j = i;  //j is previous vertex to i
    }
  return area/2;
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

function enableCompanyDetailedInfo()
{
	$(".more-company").on('click', function(event){
		var key = $(this).attr("batch-company-key");
		addCompanyDetailedInfo(batch_data.companies[key].company, batch_data.companies[key].companyimages);
		$(".videoUrl").attr({"src": "//www.youtube.com/embed/" + getId(batch_data.companies[key].company.fields.video_url),
			"height": $(".videoUrl").width()/1.8});
        $("#company-modal").modal("show");
   });
   
   $( ".modal" ).on('shown.bs.modal', function(){
     	$(this).find(".videoUrl").attr("height", $(this).find(".videoUrl").width()/1.8);
	});
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

function getTime(datestr){
	var date = (new Date(datestr)).toUTCString();
	var date_str = date.substring(0, date.length-4);
	return date_str;
}