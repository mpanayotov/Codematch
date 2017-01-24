
$('.signUpVerifyButton').on('click', function(event){
        if($(".emailfield").val().trim() == "")
        {
            alert("Email field is empty. Please type your email.");
            return;
        }

        var email = $(".emailfield").val().trim();
        $.ajax({
                url: "/verifyEmail/",
                type: "POST",
                data: {
                    email: email
                },
                success: function(data) {
                	if(data=="duplicated_email")
                		alert("Thie email is taken. Try with another one.");
                	if(data=="Verification_email_sent")
                		alert("Thank you for your time! We have sent you a verification email.");
                	$(".emailfield").val("");
                },
                error: function() {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
            
});
    
$('.signUpButton').on('click', function(event){
        if($(".emailfield").val().trim() == "")
        {
            alert("Email field is empty. Please type your email.");
            return;
        }

        var email = $(".emailfield").val().trim();
        $.ajax({
                url: "/static/phpCF/contact_me.php",
                type: "POST",
                data: {
                    email: email,
                },
                success: function(data) {
                	$(".emailfield").val("");
                	alert("You have signed up successfully.");
                },
                error: function() {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
            
    });
    
$('.dev-btn').on('click', function(event){
	$(this).hide();
	$(".email-signup").css("display", "inline-block"); 
	$(".email-signup").show();
	$(".email-signup input").focus();  
});