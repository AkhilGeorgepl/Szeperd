document.addEventListener("DOMContentLoaded", function(){


/* =========================
   STICKY HEADER
========================= */

const header = document.querySelector("header");

if(header){

window.addEventListener("scroll",()=>{

    if(window.scrollY > 50){
        header.classList.add("sticky");
    }
    else{
        header.classList.remove("sticky");
    }

});

}



/* =========================
   RAIN EFFECT
========================= */

const rainContainer = document.querySelector(".rain");


function createRainDrop(){

if(!rainContainer) return;


const drop = document.createElement("div");

drop.className="rain-drop";


drop.style.left =
Math.random()*100+"%";


drop.style.height =
(10 + Math.random()*30)+"px";


let duration =
1 + Math.random()*2;


drop.style.animationDuration =
duration+"s";


drop.style.opacity =
0.2 + Math.random()*0.3;


rainContainer.appendChild(drop);



setTimeout(()=>{

drop.remove();

},duration*1000);


}



function startRain(){


if(!rainContainer) return;


let amount =
window.innerWidth < 768 ? 40 : 150;



for(let i=0;i<amount;i++){

setTimeout(
createRainDrop,
Math.random()*3000
);

}


setInterval(createRainDrop,100);


}


startRain();




/* =========================
   REVIEW SLIDER
========================= */


const slider =
document.querySelector(".review-slider");


const next =
document.querySelector(".right-arrow");


const prev =
document.querySelector(".left-arrow");



let reviewIndex=0;



if(slider){


const cards =
slider.querySelectorAll(".review-card");


const wrapper =
document.querySelector(".review-wrapper");



function cardWidth(){

return cards[0].offsetWidth + 20;

}



function updateSlider(){


if(!wrapper) return;


let total =
cards.length * cardWidth()-20;


let max =
total - wrapper.offsetWidth;



let move =
reviewIndex * cardWidth();



if(move > max)
move=max;


if(move<0)
move=0;



slider.style.transform =
`translateX(-${move}px)`;


}



if(next){

next.addEventListener("click",()=>{

reviewIndex++;

let max =
Math.ceil(
(cards.length*cardWidth())/
wrapper.offsetWidth
)-1;


if(reviewIndex>max)
reviewIndex=max;


updateSlider();


});


}



if(prev){

prev.addEventListener("click",()=>{


reviewIndex--;


if(reviewIndex<0)
reviewIndex=0;


updateSlider();


});


}




/* Mobile Swipe */


let startX=0;


slider.addEventListener(
"touchstart",
e=>{

startX=e.touches[0].clientX;

});



slider.addEventListener(
"touchend",
e=>{


let endX =
e.changedTouches[0].clientX;


if(startX-endX>50)
reviewIndex++;


if(endX-startX>50)
reviewIndex--;



let max =
Math.ceil(
(cards.length*cardWidth())/
wrapper.offsetWidth
)-1;


if(reviewIndex<0)
reviewIndex=0;


if(reviewIndex>max)
reviewIndex=max;



updateSlider();



});


window.addEventListener(
"resize",
()=>{

reviewIndex=0;
updateSlider();

});


}




/* =========================
   MOUSE PARALLAX
========================= */

if(window.matchMedia("(pointer:fine)").matches){

const content = document.querySelector(".content");


const layers = document.querySelectorAll(
".back-2,.back-3,.back-4,.back-5,.cloud"
);


if(content && layers.length){

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;


content.addEventListener("mousemove", e=>{

    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;

});


function animate(){

    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;


    layers.forEach((layer,index)=>{


        let speed = (index + 1) * 15;


        layer.style.translate =
        `${currentX * speed}px ${currentY * speed}px`;


    });


    requestAnimationFrame(animate);

}


animate();

}

}


/* =========================
   CURSOR LIGHT TRAIL
========================= */


const trail =
document.querySelector(".cursor-trail");


if(trail){


document.addEventListener(
"mousemove",
e=>{


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


setTimeout(()=>{

loader.classList.add("hide");

},500);


}


});






/* =========================
   MOBILE MENU
========================= */


const menuBtn =
document.querySelector("#menu-btn");


const nav =
document.querySelector("nav");



if(menuBtn && nav){


menuBtn.addEventListener(
"click",
()=>{


nav.classList.toggle("show");


});


}






/* =========================
   SEARCH BOX
========================= */


const searchBtn =
document.querySelector("#search-btn");


const searchBox =
document.querySelector(".search-box");



if(searchBtn && searchBox){


searchBtn.addEventListener(
"click",
()=>{


searchBox.classList.toggle("open");


});


}



});
