document.addEventListener('DOMContentLoaded', function () {


/* =========================
   STICKY HEADER
========================= */

const header = document.querySelector('header');

if(header){

    window.addEventListener('scroll', function(){

        if(window.scrollY > 50){
            header.classList.add('sticky');
        } 
        else {
            header.classList.remove('sticky');
        }

    });

}



/* =========================
   RAIN EFFECT
========================= */


function createRainDrop(){

    const rainContainer =
    document.querySelector('.rain');


    if(!rainContainer) return;


    const rainDrop =
    document.createElement('div');


    rainDrop.classList.add('rain-drop');


    const fallDuration =
    1 + Math.random() * 2;



    rainDrop.style.left =
    `${Math.random()*100}%`;


    rainDrop.style.animationDuration =
    `${fallDuration}s`;


    rainDrop.style.height =
    `${Math.random()*30+10}px`;


    rainDrop.style.opacity =
    `${Math.random()*0.3+0.2}`;



    rainContainer.appendChild(rainDrop);



    setTimeout(()=>{

        rainDrop.remove();

    }, fallDuration*1000);


}



function startRain(){


    const rainContainer =
    document.querySelector('.rain');


    if(!rainContainer) return;



    rainContainer.style.display="block";



    for(let i=0;i<150;i++){

        setTimeout(
            createRainDrop,
            Math.random()*3000
        );

    }

}


startRain();


setInterval(createRainDrop,100);





/* =========================
   CUSTOMER REVIEW SLIDER
   BUTTON + MOBILE SWIPE
========================= */


const reviewSlider =
document.querySelector(".review-slider");


const reviewNext =
document.querySelector(".right-arrow");


const reviewPrev =
document.querySelector(".left-arrow");


let reviewPosition = 0;

let startX = 0;



if(reviewSlider){



const cards =
reviewSlider.querySelectorAll(".review-card");




function getCardWidth(){

    return cards[0].offsetWidth + 20;

}




function moveReviews(){


    const wrapper =
    document.querySelector(".review-wrapper");


    if(!wrapper) return;



    const visibleWidth =
    wrapper.offsetWidth;



    const totalWidth =
    cards.length * getCardWidth() - 20;



    const maxMove =
    totalWidth - visibleWidth;



    let move =
    reviewPosition * getCardWidth();



    if(move > maxMove){

        move=maxMove;

    }



    if(move < 0){

        move=0;

    }



    reviewSlider.style.transform =
    `translateX(-${move}px)`;

}




// NEXT BUTTON

if(reviewNext){


reviewNext.addEventListener("click",()=>{


    reviewPosition++;


    if(reviewPosition > cards.length-1){

        reviewPosition =
        cards.length-1;

    }


    moveReviews();


});


}





// PREVIOUS BUTTON

if(reviewPrev){


reviewPrev.addEventListener("click",()=>{


    reviewPosition--;


    if(reviewPosition < 0){

        reviewPosition=0;

    }


    moveReviews();


});


}





// TOUCH START

reviewSlider.addEventListener(
"touchstart",
(e)=>{


    startX =
    e.touches[0].clientX;


    reviewSlider.style.transition="none";


});






// TOUCH END

reviewSlider.addEventListener(
"touchend",
(e)=>{


    reviewSlider.style.transition=".5s ease";



    let endX =
    e.changedTouches[0].clientX;



    let difference =
    startX-endX;




    if(difference > 50){

        reviewPosition++;

    }



    if(difference < -50){

        reviewPosition--;

    }



    if(reviewPosition < 0){

        reviewPosition=0;

    }



    if(reviewPosition > cards.length-1){

        reviewPosition=cards.length-1;

    }



    moveReviews();


});





window.addEventListener(
"resize",
moveReviews
);



}






/* =========================
   SMOOTH MOUSE PARALLAX
========================= */


if(window.matchMedia("(pointer:fine)").matches){



const content =
document.querySelector(".content");



const layers =
document.querySelectorAll(
".back-1,.back-2,.back-3,.back-4,.back-5"
);



if(content && layers.length){


let mouseX=0;
let mouseY=0;


let currentX=0;
let currentY=0;




content.addEventListener(
"mousemove",
(e)=>{


mouseX =
e.clientX/window.innerWidth-0.5;


mouseY =
e.clientY/window.innerHeight-0.5;


});





function animateParallax(){


currentX +=
(mouseX-currentX)*0.05;


currentY +=
(mouseY-currentY)*0.05;




layers.forEach((layer,index)=>{


let speed =
(index+1)*5;



layer.style.translate =
`${currentX*speed}px ${currentY*speed}px`;



});



requestAnimationFrame(
animateParallax
);


}



animateParallax();


}


}






/* =========================
   MOUSE LIGHT TRAIL
========================= */


const trail =
document.querySelector(".cursor-trail");



if(trail){


document.addEventListener(
"mousemove",
(e)=>{


trail.style.left =
e.clientX+"px";


trail.style.top =
e.clientY+"px";


trail.classList.add("active");


});



document.addEventListener(
"mouseleave",
()=>{


trail.classList.remove("active");


});


}







/* =========================
   PAGE LOADER
========================= */


window.addEventListener(
"load",
()=>{


const loader =
document.querySelector(".loader");


if(loader){

    loader.classList.add("hide");

}


});


 /* =========================
   MOBILE MENU TOGGLE
========================= */

const menuBtn = document.querySelector("#menu-btn");
const nav = document.querySelector("nav");

if(menuBtn && nav){

    menuBtn.addEventListener("click",()=>{

        nav.classList.toggle("show");

    });

}
});

/* =========================
   SEARCH BOX
========================= */

const searchIcon = document.querySelector("#search-btn");
const searchBox = document.querySelector(".search-box");


if(searchIcon && searchBox){

    searchIcon.addEventListener("click",()=>{

        searchBox.classList.toggle("active");

    });

}
