<?php

require_once('config.php');

$PAGE->set_context(context_system::instance());
$PAGE->set_pagelayout('admin');
$PAGE->set_title("adoptus");
$PAGE->set_heading("adoptus");
$PAGE->set_url($CFG->wwwroot.'/adoptus.php');

echo $OUTPUT->header();
?>

<body>
<!--<h2 class="categories">Course Catalog</h2>   -->
  <div class="row-fluid">
<div class="aboutus-con span12">

		
	   <h4>Qu'est-ce qu'eNdara?</h4><br>

	   <p>eNdara, se prononce <em>indara</em></p>
	   <p>Il vient du mot <strong>ndara</strong> qui signifie Connaissance ou Savoir en langue Sango, parlée en République Centrafricaine.</p>
	   <p>eNdara est l'acquisition de la connaissance par le biais du Digital</p>
	   
	   <h4>Pourquoi adopter eNdara?</h4><br>
	   
       <p>Adopter eNdara, c'est se donner la possibilité de s'enrichir ou d'enrichir les autres, les apprenants, tout en se formant à travers les outils disponibles sur cette plate-forme de e-learning.</p>
	   <p>eNdara vous donne la possiblité de vous former, de vous informer et d'être accompagné sur différentes thématiques décrites ci-dessous avec l'aide de tuteurs aux profils multiples composés d'enseignants, de formateurs, de professionnels et d'étudiants.</p>
	   <p>Vous bénéficierez ainsi d'un :</p>
       <h6>Accompagnement personnalisé</h6>
	   <h6>Ateliers</h6>
	   <h6>Classes virtuelles</h6>
	   <h6>Cours</h6>
	   <h6>Tutorat en ligne</h6>
	   <br>
	   <h4>Comment accèder aux cours?</h4><br>
	   <p>D'abord, il faut accepter le politique du site eNdara en matière de protection de données et créer un compte via le bouton <strong>s'incrire</strong> présent sur la page d'accueil en haut à droit.</p>
    
    </div>   
 </div>     
    
</body>

<?php
echo $OUTPUT->footer();
?>