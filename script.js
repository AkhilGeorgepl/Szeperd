document.addEventListener("DOMContentLoaded", function(){

    /* =========================
       STICKY HEADER (Throttled)
    ========================= */
    const header = document.querySelector("header");
    if(header){
        let ticking = false;
        window.addEventListener("scroll", () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                if(window.scrollY > 50){
                    header.classList.add("sticky");
                } else {
                    header.classList.remove("sticky");
                }
                ticking = false;
            });
        });
    }

    /* =========================
       RAIN EFFECT
    ========================= */
    const rainContainer = document.querySelector(".rain");
    let rainTimer = null;

    function createRainDrop(){
        if(!rainContainer) return;
        const drop = document.createElement("div");
        drop.className = "rain-drop";
        drop.style.left = Math.random() * 100 + "%";
        drop.style.height = (10 + Math.random() * 30) + "px";
        let duration = 1 + Math.random() * 2;
        drop.style.animationDuration = duration + "s";
        drop.style.opacity = 0.2 + Math.random() * 0.3;
        rainContainer.appendChild(drop);
        setTimeout(()=>{
            drop.remove();
        }, duration * 1000);
    }

    function startRain(){
        if(!rainContainer) return;
        let amount = window.innerWidth < 768 ? 80 : 300;
        for(let i = 0; i < amount; i++){
            setTimeout(createRainDrop, Math.random() * 2000);
        }
        clearInterval(rainTimer);
        rainTimer = setInterval(createRainDrop, 40);
    }
    startRain();

    /* =========================
       REVIEW SLIDER
    ========================= */
    const slider = document.querySelector(".review-slider");
    const next = document.querySelector(".right-arrow");
    const prev = document.querySelector(".left-arrow");
    let reviewIndex = 0;

    if(slider){
        const cards = slider.querySelectorAll(".review-card");
        const wrapper = document.querySelector(".review-wrapper");

        function cardWidth(){
            return cards.length ? cards[0].offsetWidth + 20 : 0;
        }

        function updateSlider(){
            if(!wrapper) return;
            let total = cards.length * cardWidth() - 20;
            let max = total - wrapper.offsetWidth;
            let move = reviewIndex * cardWidth();

            if(move > max) move = max;
            if(move < 0) move = 0;

            slider.style.transform = `translateX(-${move}px)`;
        }

        if(next){
            next.addEventListener("click", ()=>{
                reviewIndex++;
                let cw = cardWidth();
                let max = wrapper ? Math.ceil((cards.length * cw) / wrapper.offsetWidth) - 1 : 0;
                if(reviewIndex > max) reviewIndex = max;
                updateSlider();
            });
        }

        if(prev){
            prev.addEventListener("click", ()=>{
                reviewIndex--;
                if(reviewIndex < 0) reviewIndex = 0;
                updateSlider();
            });
        }

        /* Mobile Swipe */
        let startX = 0;
        slider.addEventListener("touchstart", e => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener("touchend", e => {
            let endX = e.changedTouches[0].clientX;
            if(startX - endX > 50) reviewIndex++;
            if(endX - startX > 50) reviewIndex--;

            let cw = cardWidth();
            let max = wrapper ? Math.ceil((cards.length * cw) / wrapper.offsetWidth) - 1 : 0;
            if(reviewIndex < 0) reviewIndex = 0;
            if(reviewIndex > max) reviewIndex = max;

            updateSlider();
        });

        window.addEventListener("resize", ()=>{
            reviewIndex = 0;
            updateSlider();
        });
    }

    /* =========================
       MOUSE PARALLAX (Window-Bound)
    ========================= */
    if(window.matchMedia("(pointer:fine)").matches){
        const content = document.querySelector(".content");
        const layers = document.querySelectorAll(".back-2,.back-3,.back-4,.back-5,.cloud");

        if(content && layers.length){
            let mouseX = 0;
            let mouseY = 0;
            let currentX = 0;
            let currentY = 0;

            window.addEventListener("mousemove", e => {
                mouseX = e.clientX / window.innerWidth - 0.5;
                mouseY = e.clientY / window.innerHeight - 0.5;
            });

            function animate(){
                currentX += (mouseX - currentX) * 0.08;
                currentY += (mouseY - currentY) * 0.08;

                layers.forEach((layer, index)=>{
                    let speed = (index + 1) * 15;
                    layer.style.translate = `${currentX * speed}px ${currentY * speed}px`;
                });

                requestAnimationFrame(animate);
            }
            animate();
        }
    }

    /* =========================
       MOBILE GYROSCOPE PARALLAX
    ========================= */
    if(window.matchMedia("(pointer:coarse)").matches){
        const layers = document.querySelectorAll(".back-2,.back-3,.back-4,.back-5,.cloud");

        if(layers.length){
            window.addEventListener("deviceorientation", (e) => {
                let tiltX = (e.gamma || 0) / 45; 
                let tiltY = (e.beta || 0) / 45;  

                layers.forEach((layer, index) => {
                    let speed = (index + 1) * 10;
                    layer.style.translate = `${tiltX * speed}px ${tiltY * speed}px`;
                });
            });
        }
    }

    /* =========================
       CURSOR LIGHT TRAIL
    ========================= */
    const trail = document.querySelector(".cursor-trail");
    if(trail){
        document.addEventListener("mousemove", e => {
            trail.style.left = e.clientX + "px";
            trail.style.top = e.clientY + "px";
            trail.classList.add("active");
        });
        document.addEventListener("mouseleave", ()=>{
            trail.classList.remove("active");
        });
    }

    /* =========================
       PAGE LOADER (Race-Condition Fixed)
    ========================= */
    function hideLoader(){
        const loader = document.querySelector(".loader");
        if(loader){
            setTimeout(()=>{
                loader.classList.add("hide");
            }, 500);
        }
    }

    if(document.readyState === "complete"){
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader);
    }

    /* =========================
       MOBILE MENU
    ========================= */
    const menuBtn = document.querySelector("#menu-btn");
    const nav = document.querySelector("nav");

    if(menuBtn && nav){
        menuBtn.addEventListener("click", ()=>{
            nav.classList.toggle("show");
        });
    }



}); // <--- Clean, secure closing bracket for DOMContentLoaded




/* =========================
   SEARCH SYSTEM
========================= */


const searchBtn = document.querySelector("#search-btn");

const searchBox = document.querySelector(".search-box");


const mobileSearch = document.querySelector(".mobile-search-overlay");

const closeSearch = document.querySelector("#close-search");



if(searchBtn){


searchBtn.addEventListener("click",()=>{


    if(window.innerWidth <= 768){

        mobileSearch.classList.add("active");

    }

    else{

        searchBox.classList.toggle("open");

    }


});


}




if(closeSearch){


closeSearch.addEventListener("click",()=>{


    mobileSearch.classList.remove("active");


});


}

document.addEventListener("click", function(e){

    const searchOverlay = document.querySelector(".mobile-search-overlay");
    const searchBtn = document.querySelector("#search-btn");
    const searchInput = document.querySelector(".mobile-search-overlay input");

    if(!searchOverlay) return;


    // If click is outside search popup and not on search button
    if(
        searchOverlay.classList.contains("active") &&
        !searchOverlay.contains(e.target) &&
        !searchBtn.contains(e.target)
    ){

        searchOverlay.classList.remove("active");

    }

});

document.addEventListener("click", function(e){

    const menu = document.querySelector("nav");
    const menuBtn = document.querySelector("#menu-btn");

    if(!menu || !menuBtn) return;


    // If menu is open and click is outside
    if(
        menu.classList.contains("show") &&
        !menu.contains(e.target) &&
        !menuBtn.contains(e.target)
    ){

        menu.classList.remove("show");

    }

});
