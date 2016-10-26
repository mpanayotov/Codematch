<?php
// Check for empty fields
if(empty($_POST['email']) ||
	empty($_POST['location']) ||
	empty($_POST['companyName']) ||
	empty($_POST['username']) ||
	empty($_POST['password']) ||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }

$email_address = $_POST['email'];
$location = $_POST['location'];
$username = $_POST['username'];
$companyname = $_POST['companyName'];
$password = $_POST['password'];
$promocode = $_POST['promocode'];
	
// Create the email and send the message
$to = 'mihail_workbuz@abv.bg,claudio.meireles7@gmail.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
$email_subject = "Codematch Company SignUp";
$email_body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nEmail: $email_address\n"."\nPassword: $password\n"."\nCompany name: $companyname\n"."\nLocation: $location\n"."\nName: $username\n"."\nPromo code: $promocode\n";
$headers = "From: support@codematch.eu\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: $email_address";	
mail($to,$email_subject,$email_body,$headers);

// Create the email and send the message
$email_subject = "Sign-up in codematch";
$email_body = "Thank you for signing up in codematch. \n\n
	Codematch team will send you the link to create your profile as soon as possible. \n\n Codematch.eu team!";
$headers = "From: support@codematch.eu\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: support@codematch.eu";	
mail($email_address,$email_subject,$email_body,$headers);

return true;			
?>