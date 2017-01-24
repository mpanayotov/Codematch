var formdata = new FormData();
imageFiles = [];
var profileImage = null;
function displayImage() {
			var photo = $("#imgUploader")[0];
			profileImage = photo.files[0];
			console.log(formdata);
			if (photo.files && photo.files[0]) {
	            var reader = new FileReader();
	            reader.onload = imageIsLoaded;
	            reader.readAsDataURL(photo.files[0]);
        	}
		}
function imageIsLoaded(e) {
    $('.img-company').attr('src', e.target.result);
};

 $(".srcUpload").on("click", function() {
     if ($(".srcHolder").val().trim() == "")
     {
     	alert("Please, type your company picture url.");
     }
     
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

$('.completeProfileBtn').on('click', function(event){
		if(profileImage==null)
		{
			alert("Please upload your company profile picture.");
			return;
		}
		if($(".company-name").val().trim() == "")
        {
            alert("Company name field is empty. Please type your company name.");
            return;
        }
        if($(".company-email").val().trim() == "")
        {
            alert("Email field is empty. Please type your email.");
            return;
        }
        if($(".userName").val().trim() == "")
        {
            alert("Name field is empty. Please type your first and last names.");
            return;
        }
        if($(".location").val().trim() == "")
        {
            alert("Location field is empty. Please type your location.");
            return;
        }
        if($(".short-description").val().trim() == "")
        {
            alert("Company short description field is empty.");
            return;
        }
		if($(".website").val().trim() == "")
        {
            alert("Website url field is empty.");
            return;
        }
        if($(".companysize").val().trim() == "")
        {
            alert("Company short description field is empty.");
            return;
        }
        if($(".foundation").val().trim() == "")
        {
            alert("Foundation year field is empty.");
            return;
        }
        
        if($(".salary").val().trim() == "")
        {
            alert("Annual salary field is empty.");
            return;
        }
        
        var industries = "";
		 $('.industry .selected span').each(function( index ) {
	 		 var industry = $(this).html().trim() + ",";
	 		 industries += industry;
	  	 });
	  	 
	  	if(industries == "")
        {
            alert("Industry field is empty.");
            return;
        }
	  	 
	  	var techStack = "";
		 $('.tech-stack .selected span').each(function( index ) {
	 		 var tech = $(this).html().trim() + ",";
	 		 techStack += tech;
	  	 });
	  	 
	  	if(techStack == "")
        {
            alert("Tech stack field is empty.");
            return;
        }
        
        var companyPerks = "";
		 $('.perks .selected span').each(function( index ) {
	 		 var perk = $(this).html().trim() + ",";
	 		 companyPerks += perk;
	  	 });
	  	 
	  	if(companyPerks == "")
        {
            alert("Perks field is empty.");
            return;
        }
        
        if(imageFiles.length > 0)
        	appendCompanyImages();        
        
        var email = $(".company-email").val().trim();
        var name = $(".company-name").val().trim();
        var user_name = $(".userName").val().trim();
        var location = $(".location").val().trim();
        var short_description = $(".short-description").val().trim();
        var company_size = $(".companysize").val().trim();
        var website_url = $(".website").val().trim();
        if (website_url != "") website_url = checkForValidUrls(website_url);
        var foundation_year = $(".foundation").val().trim();
        var tech_stack = techStack;
        var industry = industries;
        var perks = companyPerks;
        var software_used = $(".softwareUsed").val().trim();
        var funding = $(".funding").val().trim();
        var investors = $(".investors").val().trim();
        var annual_salary = $(".salary").val().trim();
        var video_url = $(".video").val().trim();
        if (video_url != "") video_url = checkForValidUrls(video_url);
        var crunch_base_url = $(".crunchbase").val().trim();
        if (crunch_base_url != "") crunch_base_url = checkForValidUrls(crunch_base_url);
        var angel_list_url = $(".angellist").val().trim();
        if (angel_list_url != "") angel_list_url = checkForValidUrls(angel_list_url);
        var fb_page_url = $(".fbpage").val().trim();
        if (fb_page_url != "") fb_page_url = checkForValidUrls(fb_page_url);
        var twitter_page_url = $(".twitterpage").val().trim();
        if (twitter_page_url != "") twitter_page_url = checkForValidUrls(twitter_page_url);
        var youtube_channel_url = $(".youtube").val().trim();
        if (youtube_channel_url != "") youtube_channel_url = checkForValidUrls(youtube_channel_url);
        var long_description = $(".longdescription").val().trim();
        
        formdata.append('company_email', email);
        formdata.append('company_name', name);
		formdata.append('user_name', user_name);
		formdata.append('location', location);
		formdata.append('short_description', short_description);
		formdata.append('company_size', company_size);
		formdata.append('website_url', website_url);
		formdata.append('foundation_year', foundation_year);
		formdata.append('tech_stack', tech_stack);
		formdata.append('industry', industry);
		formdata.append('software_used', software_used);
		formdata.append('funding', funding);
		formdata.append('investors', investors);
		formdata.append('annual_salary', annual_salary);
		formdata.append('perks', perks);
		formdata.append('video_url', video_url);
		formdata.append('crunch_base_url', crunch_base_url);
		formdata.append('angel_list_url', angel_list_url);
		formdata.append('fb_page_url', fb_page_url);
		formdata.append('twitter_page_url', twitter_page_url);
		formdata.append('youtube_channel_url', youtube_channel_url);
		formdata.append('long_description', long_description);		
        formdata.append('profile_picture', profileImage);
        
        $.ajax({
                url: "/editCompany/",
                type: "POST",
                xhrFields : {
					withCredentials : true
				},
				headers : {
					'X-Requested-With' : 'XMLHttpRequest'
				},
                data: formdata,
                contentType: false,
            	processData: false,
                success: function(data) {
                	if(data=="edit_successful")
                		window.location.href="/company/profile/";
                	else
                		alert(data);
                },
                error: function() {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
            
    });

function imagesAreLoaded(e) {
	addPicture(e.target.result);
};

 $("#upload-images").on("change", function(event) {
 	for (var i=0; i < event.target.files.length; i++) {
	   imageFiles.push(event.target.files[i]);
	   var reader = new FileReader();
	   reader.onload = imagesAreLoaded;
	   reader.readAsDataURL(event.target.files[i]);
	 };
 });

function appendCompanyImages()
{
	for (var i=0; i < imageFiles.length; i++) {
	  	formdata.append('image_'+i, imageFiles[i]);
	};
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

function addPicture(image)
{
	 var imageEl = "<div class='col-sm-4 img-col'>"
									+"<div class='project-wrapper'>"
					                    +"<div class='project'>"
					                        +"<div class='photo-wrapper'>"
					                            +"<div class='photo'>"
					                            	+"<a class='fancybox' href='"+image+"'>"
					                            		+"<img class='img-responsive' src='"+image+"' alt=''></a>"
					                            +"</div>"
					                            +"<div class='overlay'></div>"
					                        +"</div>"
					                    +"</div>"
					                +"</div>"
								+"</div>";
		$(".picturesHolder").append(imageEl);
}