<?php
// Check for empty fields
if(empty($_POST['email']) ||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }

$email_address = $_POST['email'];
	
// Create the email and send the message
$to = 'mihail_workbuz@abv.bg,claudio.meireles7@gmail.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
$email_subject = "Codematch Developer SignUp";
$email_body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nEmail: $email_address\n";
$headers = "From: support@codematch.eu\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: $email_address";	
mail($to,$email_subject,$email_body,$headers);

// Create the email and send the message
$to = 'mihail_workbuz@abv.bg,claudio.meireles7@gmail.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
$email_subject = "Sign-up request for Codematch";
$email_body = "Thank you for your support and interest in our platform. \n\n
	We are now working on the product itself and we will comeback to you in a few days to start testing and get your feedback.\n\n
	In the meanwhile, we would like to invite you to share with us your experience as a developer when you are on the market looking for a job. In order to get that we have prepared a 1 minute survey,   https://clmei.typeform.com/to/PynjUy , thank you again for your support. \n\n
	The Codematch team";
$headers = "From: support@codematch.eu\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: support@codematch.eu";	
mail($email_address,$email_subject,$email_body,$headers);

return true;			
?>