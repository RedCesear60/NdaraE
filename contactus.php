<?php

require_once('config.php');

$PAGE->set_context(context_system::instance());
$PAGE->set_pagelayout('admin');
$PAGE->set_title("contact");
$PAGE->set_heading("contact");
$PAGE->set_url($CFG->wwwroot.'/contactus.php');

echo $OUTPUT->header();
?>

<body>
<!--<h2 class="categories">Course Catalog</h2>   -->
 <link href="contact-form.css" rel="stylesheet">
 
<div class="row-fluid">
	<div class="aboutus-con span12">

			<div class="fcf-body">

				<div id="fcf-form">
				<h4 class="fcf-h3">Contactez-nous</h4><br>

				<form id="fcf-form-id" class="fcf-form-class" method="post" action="contact-form-process.php">
					
					<div class="fcf-form-group">
						<label for="Name" class="fcf-label">Nom</label><br>
						<div class="fcf-input-group">
							<input type="text" id="Name" name="Name" class="fcf-form-control" required><br>
						</div>
					</div>

					<div class="fcf-form-group"><br>
						<label for="Email" class="fcf-label">Email</label><br>
						<div class="fcf-input-group">
							<input type="email" id="Email" name="Email" class="fcf-form-control" required><br>
						</div>
					</div>

					<div class="fcf-form-group"><br>
						<label for="Message" class="fcf-label">Message</label><br>
						<div class="fcf-input-group">
							<textarea id="Message" name="Message" class="fcf-form-control" rows="6" maxlength="3000" required></textarea><br>
						</div>
					</div>

					<div class="fcf-form-group"><br>
						<button type="submit" id="fcf-button" class="fcf-btn fcf-btn-primary fcf-btn-lg fcf-btn-block">Envoyer</button>
					</div>
			  
				</form>
				</div>

			</div>
       
    </div>   
 </div>     
    
</body>

<?php
echo $OUTPUT->footer();
?>