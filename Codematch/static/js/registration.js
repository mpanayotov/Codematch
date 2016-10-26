$('.signUpButton').on('click', function(event){
        if($(".companyName").val().trim() == "")
        {
            alert("Company name field is empty.");
            return;
        }
        if($(".location").val().trim() == "")
        {
            alert("Location field is empty.");
            return;
        }
        if($(".username").val().trim() == "")
        {
            alert("Name field is empty.");
            return;
        }
        if($(".email").val().trim() == "")
        {
            alert("Email field is empty.");
            return;
        }
        if($(".password").val().trim() == "")
        {
            alert("Password field is empty.");
            return;
        }

        var email = $(".email").val().trim();
        var location = $(".location").val().trim();
        var username = $(".username").val().trim();
        var companyName = $(".companyName").val().trim();
        var password = $(".password").val().trim();
        //var promo = $(".promocode").val().trim();
        
        $.ajax({
                //url: "/static/phpCF/promo.php",
                url: "/signUpCompany/",
                type: "POST",
                data: {
                    company_email: email,
                    company_name: companyName,
                    location: location,
                    user_name: username,
                    password: password
                },
                success: function(data) {
                	if(data=="duplicated_email")
                		alert("This email is taken. Please, choose another one.");
                	else
                		window.location.href="/company/edit/";
                	$(".credential-input").val("");
                },
                error: function() {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
            
    });