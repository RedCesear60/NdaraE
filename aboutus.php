<?php

require_once('config.php');

$PAGE->set_context(context_system::instance());
$PAGE->set_pagelayout('admin');
$PAGE->set_title("Aboutus");
$PAGE->set_heading("Aboutus");
$PAGE->set_url($CFG->wwwroot.'/aboutus.php');

echo $OUTPUT->header();
?>

<body>
<!--<h2 class="categories">Course Catalog</h2>   -->
  <div class="row-fluid">
<div class="aboutus-con span12">
       <h4>Qui sommes nous?</h4>
	   
	   <p>Le site eNdara est mise en place par <a href="https://www.h-cw.org/">l'Association HCW</a>, qui intervient dans le domaine de l'Education et de la Culture depuis une dizaine d'années.</p>
	   <p>La transmission est le maître-mot qui anime tous les volontaires participant à ce voyage, pleins de rencontres depuis sa création.</P>
	   <p>C'est dans cette optique que la plate-forme eNdara a été créée afin de donner la possibilité à tous ceux, désireux d'apprendre ou de partager des connnaissances et de les mettre à disposition.</p>
    
    </div>   
 </div>     
    
</body>

<?php
echo $OUTPUT->footer();
?>