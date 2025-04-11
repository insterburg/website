
function showInfo(infoId) {
  var infoBoxes = document.querySelectorAll('.tut-info-wrapper');
  infoBoxes.forEach(function(box) {
    box.classList.remove('active');
  });
  var infoBox = document.getElementById(infoId);
  infoBox.classList.add('active');
}

function hideInfo() {
  var infoBoxes = document.querySelectorAll('.tut-info-wrapper');
  infoBoxes.forEach(function(box) {
    box.classList.remove('active');
  });
}

const slideIndices = new Map();

function initSlide(tutorialName) {
  if (!slideIndices.has(tutorialName)) {
    changeSlide(tutorialName, 0, 1);
  }
}

function changeSlide(tutorialName, n, max) {
  console.log("changeSlide(" + tutorialName + ", " + n + ", " + max + ")");
  var i;
  var slides = document.getElementsByClassName("tutorial-slides " + tutorialName);
  if (slideIndices.has(tutorialName)) {
    slideIndices.set(tutorialName, 
      (slideIndices.get(tutorialName) + n + max) % max);
  } else {
    slideIndices.set(tutorialName, 0);
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  console.log(slideIndices.get(tutorialName));
  slides[slideIndices.get(tutorialName)].style.display = "block";
}

var slideOfferIndex = 0;
function changeOfferSlide(n, max) {
  console.log("changeOfferSlide(" + n + ", " + max + ")");
  var i;
  var slides = document.getElementsByClassName("further-offers-slide");
  var descriptions = document.getElementsByClassName("further-offers-description");
  slideOfferIndex = (slideOfferIndex + n + max) % max;
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    descriptions[i].style.display = "none";
  }
  slides[slideOfferIndex].style.display = "block";
  descriptions[slideOfferIndex].style.display = "block";
}

changeOfferSlide(slideOfferIndex, 1)
