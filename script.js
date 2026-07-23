document.addEventListener('DOMContentLoaded', function () {
  // Sticky Header Scroll Effect
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Rain Effect Logic
  function createRainDrop() {
    const rainContainer = document.querySelector('.rain');
    if (!rainContainer) return;

    const rainDrop = document.createElement('div');
    rainDrop.classList.add('rain-drop');

    // Random properties
    rainDrop.style.left = `${Math.random() * 100}%`; // Random X position
    const fallDuration = 1 + Math.random() * 2; // Random fall duration (1s - 3s)
    rainDrop.style.animationDuration = `${fallDuration}s`;
    rainDrop.style.height = `${Math.random() * 30 + 10}px`; // Random height (10px - 40px)
    rainDrop.style.opacity = `${Math.random() * 0.3 + 0.2}`; // Random opacity (0.2 - 0.5)

    rainContainer.appendChild(rainDrop);

    // 10% of drops will loop instead of disappearing
    if (Math.random() < 0.1) {  
      rainDrop.addEventListener('animationiteration', () => {
        rainDrop.style.left = `${Math.random() * 100}%`; // Reset position
        rainDrop.style.animationDuration = `${1 + Math.random() * 2}s`; // New random speed
      });
    } else {
      // Remove the raindrop after falling
      setTimeout(() => {
        rainDrop.remove();
      }, fallDuration * 1000);
    }
  }

  function startRain() {
    const rainContainer = document.querySelector('.rain');
    if (!rainContainer) return;
    rainContainer.style.display = 'block'; // Ensure rain container is visible

    // Initial burst of raindrops
    for (let i = 0; i < 150; i++) {
      setTimeout(createRainDrop, Math.random() * 3000);
    }
  }

  // Start the initial rain
  startRain();

  // Maintain a steady drizzle running constantly
  setInterval(createRainDrop, 100); 
});

// =========================
// CUSTOMER REVIEWS SLIDER
// =========================

const reviewSlider = document.querySelector(".review-slider");
const reviewNext = document.querySelector(".right-arrow");
const reviewPrev = document.querySelector(".left-arrow");

let reviewPosition = 0;


if (reviewSlider && reviewNext && reviewPrev) {


    reviewNext.addEventListener("click", function(){

        if(reviewPosition < 2){

            reviewPosition++;

            reviewSlider.style.transform =
            `translateX(-${reviewPosition * 441}px)`;

        }

    });



    reviewPrev.addEventListener("click", function(){

        if(reviewPosition > 0){

            reviewPosition--;

            reviewSlider.style.transform =
            `translateX(-${reviewPosition * 441}px)`;

        }

    });


}
/* =========================
   SMOOTH MOUSE PARALLAX EFFECT
========================= */

if(window.matchMedia("(pointer:fine)").matches){

const content = document.querySelector(".content");

const layers = document.querySelectorAll(
".back-1, .back-2, .back-3, .back-4, .back-5"
);

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;


content.addEventListener("mousemove", (e)=>{

    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);

});


function animateParallax(){

    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;


    layers.forEach((layer,index)=>{

        let speed = (index + 1) * 5;

        layer.style.translate =
        `${currentX * speed}px ${currentY * speed}px`;

    });


    requestAnimationFrame(animateParallax);

}


animateParallax();

}

/* =========================
   MOUSE LIGHT TRAIL
========================= */

const trail = document.querySelector(".cursor-trail");


if(trail){

document.addEventListener("mousemove",(e)=>{

    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";

    trail.classList.add("active");

});


document.addEventListener("mouseleave",()=>{

    trail.classList.remove("active");

});


}
