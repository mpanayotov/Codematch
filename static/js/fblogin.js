// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
		// Logged into your app and Facebook.
		//testAPI();
		console.log('connected');
		//console.log(response.authResponse["userID"]);
	} else if (response.status === 'not_authorized') {
		// The person is logged into Facebook, but not your app.
		console.log('Please log ' + 'into this app.');
	} else {
		// The person is not logged into Facebook, so we're not sure if
		// they are logged into this app or not.
		console.log('Please log ' + 'into Facebook.');
	}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
/*function checkLoginState() {
 FB.getLoginStatus(function(response) {
 statusChangeCallback(response);
 });
 }*/

window.fbAsyncInit = function() {
	FB.init({
		appId : '913571472096581',
		cookie : true, // enable cookies to allow the server to access
		// the session
		xfbml : true, // parse social plugins on this page
		version : 'v2.5' // use version 2.0
	});

	// Now that we've initialized the JavaScript SDK, we call
	// FB.getLoginStatus().  This function gets the state of the
	// person visiting this page and can return one of three states to
	// the callback you provide.  They can be:
	//
	// 1. Logged into your app ('connected')
	// 2. Logged into Facebook, but not your app ('not_authorized')
	// 3. Not logged into Facebook and can't tell if they are logged into
	//    your app or not.
	//
	// These three cases are handled in the callback function.

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});

};

// Load the SDK asynchronously
( function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id))
			return;
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

function fb_login() {
	FB.login(function(response) {

		if (response.authResponse) {
			console.log('Welcome!  Fetching your information.... ');
			//console.log(response); // dump complete info
			access_token = response.authResponse.accessToken;
			//get access token
			user_id = response.authResponse.userID;
			//get FB UID

			get_fb_credentials();

		} else {
			//user hit cancel button
			console.log('User cancelled login or did not fully authorize.');

		}
	}, {
		scope : 'public_profile,email'
	});
}

function get_fb_credentials() {
	//console.log('Welcome!  Fetching your information.... ');
	FB.api('/me?fields=email,name,id,link', function(response) {
		//alert('Successful login for: ' + response.name + " email: " + response.email);
		//document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
		//console.log(response.email, response.name, response.id, response.link);
		if(response.email == "" || response.email == undefined || response.email == null)
		{
			alert("За да се регистрирате е необходимо да споделите с нас Вашия e-mail адрес. Моля, променте настройките си в социалната мрежа и опитайте пак.");
			return;
		}
		login_or_register(response.email, response.name, response.id);
	});
	/*
	FB.api(
	    "/"+response.id,
	    function (response) {
	      if (response && !response.error) {
	        alert(response.public_key);
	      }
	    }
	);*/
}

function login_or_register(email, name, fb_id){
	$(".fb-login-holder").html("<center><img src='/static/imgs/ajax-loader.GIF' style='width:50px;'></center>");
	$.ajax({
						url : "/fbLogin/",
						type : 'POST', //this is the default though, you don't actually need to always mention it
						xhrFields : {
							withCredentials : true
						},
						headers : {
							'X-Requested-With' : 'XMLHttpRequest'
						},
						data : {
							email : email,
							username : name,
							fb_id : fb_id
						},
						success : function(data) {
							if(data=="registration_with_fb_complete" || data=="fblogin_complete")
								window.location.href = "/";
						},
						error : function(error) {
							console.log("ERROR:", error);
						},
				});	
}