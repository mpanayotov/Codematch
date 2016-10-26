$('.signIn').on('click', function(event){
        if($(".email").val().trim() == "")
        {
            alert("Email field is empty. Please type your email.");
            return;
        }
		if($(".pass").val().trim() == "")
        {
            alert("Password field is empty. Please type your password.");
            return;
        }
        
        var email = $(".email").val().trim();
        var password = $(".pass").val().trim();
        
        $.ajax({
                url: "/signIn/",
                type: "POST",
                data: {
                    email: email,
                    password: password
                },
                success: function(data) {
                	if(data=="successful_login")
                		window.location.href="/login/";
                	else
                		alert("Incorrect username or password");
                },
                error: function() {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
            
    });
