$('.saveBtn').on('click', function(event){
        if($(".name").val().trim() == "")
        {
            alert("Name field is empty. Please type your name.");
            return;
        }
		if($(".pass").val().trim() == "")
        {
            alert("Password field is empty. Please type your password.");
            return;
        }
        if($(".location").val().trim() == "")
        {
            alert("Location field is empty. Please select your location.");
            return;
        }
        if($(".pass-repeat").val().trim() == "")
        {
            alert("Please repeat your password.");
            return;
        }
        
        if($(".pass-repeat").val().trim() != $(".pass").val().trim())
        {
            alert("Passwords do not match.");
            return;
        }
        
        var username = $(".name").val().trim();
        var password = $(".pass").val().trim();
        var location = $(".location").val().trim();
        
        $.ajax({
                url: "/createUser/",
                type: "POST",
                data: {
                    email: email,
                    location: location,
                    username: username,
                    password: password
                },
                success: function(data) {
                	if(data=="user_created")
                		window.location.href="/login/";
                	if(data=="duplicated_email")
                		alert("This email is taken. Please, sign up again with onother one.");
                },
                error: function() {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
            
    });