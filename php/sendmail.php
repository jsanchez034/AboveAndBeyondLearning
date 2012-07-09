<?php
// multiple recipients

$to = 'SES@above-and-beyondlearning.com';

// subject
$subject = 'Email from above-and-beyondlearning.com';

$email = $_REQUEST['email'] ;
$crlf = "\n";

$fullname = '<p><span style="font-weight:bold;">Name</span>:&nbsp;'. $_REQUEST['fname'] . '&nbsp;' . $_REQUEST['lname'] . '</p>';
$phone = '<p><span style="font-weight:bold;">Phone Number:</span>&nbsp;' .  $_REQUEST['p1'] . '-' . $_REQUEST['p2'] . '-' . $_REQUEST['p3'] . '</p>';
$comment = '<span style="font-weight:bold;">Comments: </span><p>'. $_REQUEST['comm'] . '</p>';
$emailf = '<p><span style="font-weight:bold;">Email:</span>&nbsp;' .  $_REQUEST['email'] . '</p>';

$message = <<<END
<html>
	<body>
		$fullname  $phone  $emailf $comment  
	</body>
</html>
END;

$message = stripcslashes($message);

// To send HTML mail, the Content-type header must be set
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

/*----Don't forget to implement the correct header to send the emails
$headers = 'From: ' . $email . "\r\n" .
            'Reply-To: ' . $email . "\r\n" .
          'X-Mailer: PHP/' . phpversion();
*/



// Mail it
mail($to, $subject, $message, $headers);
?> 
