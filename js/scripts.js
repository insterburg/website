/***** Funktionalität für Scrolling-To-Top *****/
$(document).ready(function(){
"use strict";
$(function(){
    $(document).on( 'scroll', function(){
 
    	if ($(window).scrollTop() > 100) {
			$('.scroll-top-wrapper').addClass('show');
		} else {
			$('.scroll-top-wrapper').removeClass('show');
			$('.scroll-top-wrapper').trigger('mouseleave');
		}
	});
 
	$('.scroll-top-wrapper').on('click', scrollToTop);
});
 
function scrollToTop() {
	"use strict";
	var verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
	var element = $('body');
	var offset = element.offset();
	var offsetTop = offset.top;
	$('html, body').animate({scrollTop: offsetTop}, 500, 'linear');
}

});

var contactedTutoriatEmail = 'bar@insterburg.org';

$(document).ready(function () 
{
    jQuery('#tutoriat-contact').hide();
    //call this first so we start out with the correct visibility depending on the selected form values
    //this will call our toggleFields function every time the selection value of our underAge field changes
    $("#tutoriat").change(function () 
    {
        var selected = document.getElementById('tutoriat');
		var selVal = selected.options[selected.selectedIndex].value;
		if (selVal == 'bar') {
			contactedTutoriatEmail = 'bar@insterburg.org';
		} else if (selVal == 'billiard') {
			contactedTutoriatEmail = 'billiard@insterburg.org';
		} else if (selVal == 'blumen') {
			contactedTutoriatEmail = 'blumen@insterburg.org';
		} else if (selVal == 'dach') {
			contactedTutoriatEmail = 'dach@insterburg.org';
		} else if (selVal == 'fluegel') {
			contactedTutoriatEmail = 'fluegel@insterburg.org';
		} else if (selVal == 'foto') {
			contactedTutoriatEmail = 'foto@insterburg.org';
		} else if (selVal == 'gaestezimmer') {
			contactedTutoriatEmail = 'gaestezimmer@insterburg.org';
		} else if (selVal == 'handarbeit') {
			contactedTutoriatEmail = 'handarbeit@insterburg.org';
		} else if (selVal == 'homepage') {
			contactedTutoriatEmail = 'homepage@insterburg.org';
		} else if (selVal == 'instermat') {
			contactedTutoriatEmail = 'instermat@insterburg.org';
		} else if (selVal == 'international') {
			contactedTutoriatEmail = 'international@insterburg.org';
		} else if (selVal == 'jamsession') {
			contactedTutoriatEmail = 'jamsession@insterburg.org';
		} else if (selVal == 'konzerte') {
			contactedTutoriatEmail = 'konzerte@insterburg.org';
		} else if (selVal == 'proberaum') {
			contactedTutoriatEmail = 'proberaum@insterburg.org';
		} else if (selVal == 'lernzimmer') {
			contactedTutoriatEmail = 'lernzimmer@insterburg.org';
		} else if (selVal == 'netzwerk') {
			contactedTutoriatEmail = 'netzwerk@insterburg.org';
		} else if (selVal == 'parkplatz') {
			contactedTutoriatEmail = 'parkplatz@insterburg.org';
		} else if (selVal == 'spiele') {
			contactedTutoriatEmail = 'spiele@insterburg.org';
		} else if (selVal == 'sport') {
			contactedTutoriatEmail = 'sport@insterburg.org';
		} else if (selVal == 'technik') {
			contactedTutoriatEmail = 'technik@insterburg.org';
		} else if (selVal == 'werkstatt') {
			contactedTutoriatEmail = 'werkstatt@insterburg.org';
		} else {
			contactedTutoriatEmail = 'homepage@insterburg.org';
		}
    });

});

//Function: this toggles the visibility of the tutoriat-contact-formular and changing the text of the button
jQuery('#hideshow').on('click', function(event) { 
	"use strict";       
	jQuery('#tutoriat-contact').toggle('show');
	$(this).text(function(i, text) {
          return text === "Konakt aufnehmen" ? "Kontaktaufnahme abbrechen" : "Konakt aufnehmen";
      });
});
 $('.selectpicker').selectpicker({iconBase: 'fa'}); // Funktion für Einschalten von Selectpicker
 
/***** Funktionalität für Bewerbungsseite *****/
function red_pill() {
	"use strict";
	jQuery('#welcome-neo').hide(400);
	jQuery('#red-pill').show(400);
	jQuery('#blue-pill').hide(400);
}
	
function blue_pill() {
	"use strict";
	jQuery('#welcome-neo').hide(400);
	jQuery('#red-pill').hide(400);
	jQuery('#blue-pill').show(400);
	upload_files();
}
	
function change_pill(speed) {
	"use strict";
	jQuery('#welcome-neo').show(speed);
	jQuery('#red-pill').hide(speed);
	jQuery('#blue-pill').hide(speed);
}
/***** Funktionalität für Upload-Form *****/
function upload_files() {
    'use strict';
    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');

    var startUpload = function(files) {
        console.log(files);
    };

    uploadForm.addEventListener('submit', function(e) {
        var uploadFiles = document.getElementById('js-upload-files').files;
        e.preventDefault();

        startUpload(uploadFiles);
    });

    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';

        startUpload(e.dataTransfer.files);
    };

    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        return false;
    };

    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        return false;
    };

}
/***** Funktionalität für Feedbackform *****/
$('#contact-form').validator();