document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       STICKY HEADER
    ===================================================== */

    const header = document.querySelector("header");

    if (header) {

        let ticking = false;

        window.addEventListener("scroll", () => {

            if (ticking) return;

            ticking = true;

            requestAnimationFrame(() => {

                if (window.scrollY > 50) {
                    header.classList.add("sticky");
                } else {
                    header.classList.remove("sticky");
                }

                ticking = false;

            });

        });

    }


    /* =====================================================
       RAIN EFFECT
    ===================================================== */

    const rainContainer =
        document.querySelector(".rain");

    let rainTimer = null;


    function createRainDrop() {

        if (!rainContainer) return;

        const drop =
            document.createElement("div");

        drop.className = "rain-drop";

        drop.style.left =
            Math.random() * 100 + "%";

        drop.style.height =
            (10 + Math.random() * 30) + "px";

        const duration =
            1 + Math.random() * 2;

        drop.style.animationDuration =
            duration + "s";

        drop.style.opacity =
            0.2 + Math.random() * 0.3;

        rainContainer.appendChild(drop);

        setTimeout(() => {

            if (drop.parentNode) {
                drop.remove();
            }

        }, duration * 1000);

    }


    function startRain() {

        if (!rainContainer) return;

        const amount =
            window.innerWidth < 768
                ? 80
                : 300;

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            setTimeout(
                createRainDrop,
                Math.random() * 2000
            );

        }

        clearInterval(rainTimer);

        rainTimer =
            setInterval(
                createRainDrop,
                40
            );

    }


    startRain();


    /* =====================================================
       HOME REVIEWS
       reviews.json
    ===================================================== */

    const homeReviews =
        document.querySelector("#home-reviews");


    function initializeReviewSlider() {

        const slider =
            document.querySelector(".review-slider");

        const next =
            document.querySelector(".right-arrow");

        const prev =
            document.querySelector(".left-arrow");

        const wrapper =
            document.querySelector(".review-wrapper");

        const dotsContainer =
            document.querySelector(".review-dots");

        let reviewIndex = 0;


        if (!slider || !wrapper) {
            return;
        }


        const cards =
            slider.querySelectorAll(".review-card");


        if (!cards.length) {
            return;
        }


        function cardWidth() {

            const gap =
                parseFloat(
                    getComputedStyle(slider).gap
                ) || 0;

            return (
                cards[0].offsetWidth +
                gap
            );

        }


        function maxReviewIndex() {

            const cw =
                cardWidth();

            if (!cw) {
                return 0;
            }

            const gap =
                parseFloat(
                    getComputedStyle(slider).gap
                ) || 0;

            const totalWidth =
                cards.length * cw -
                gap;

            const visibleWidth =
                wrapper.clientWidth;

            const maxMove =
                Math.max(
                    0,
                    totalWidth -
                    visibleWidth
                );

            return Math.max(
                0,
                Math.ceil(
                    maxMove / cw
                )
            );

        }


        function createDots() {

            if (!dotsContainer) {
                return;
            }

            dotsContainer.innerHTML = "";

            const count =
                maxReviewIndex() + 1;


            for (
                let i = 0;
                i < count;
                i++
            ) {

                const dot =
                    document.createElement("span");

                dot.setAttribute(
                    "role",
                    "button"
                );

                dot.setAttribute(
                    "aria-label",
                    `Show review slide ${i + 1}`
                );

                dot.addEventListener(
                    "click",
                    () => {

                        reviewIndex = i;

                        updateSlider();

                    }
                );

                dotsContainer.appendChild(dot);

            }

        }


        function updateDots() {

            if (!dotsContainer) {
                return;
            }

            const dots =
                dotsContainer.querySelectorAll("span");

            dots.forEach(
                (dot, index) => {

                    dot.classList.toggle(
                        "active",
                        index === reviewIndex
                    );

                }
            );

        }


        function updateSlider() {

            const cw =
                cardWidth();

            if (!cw) {
                return;
            }

            const max =
                maxReviewIndex();


            if (reviewIndex < 0) {
                reviewIndex = 0;
            }

            if (reviewIndex > max) {
                reviewIndex = max;
            }


            let move =
                reviewIndex * cw;


            const gap =
                parseFloat(
                    getComputedStyle(slider).gap
                ) || 0;

            const totalWidth =
                cards.length * cw -
                gap;

            const maxMove =
                Math.max(
                    0,
                    totalWidth -
                    wrapper.clientWidth
                );


            if (move > maxMove) {
                move = maxMove;
            }

            if (move < 0) {
                move = 0;
            }


            slider.style.transform =
                `translate3d(-${move}px, 0, 0)`;


            updateDots();

        }


        /* -------------------------
           NEXT
        ------------------------- */

        if (next) {

            next.addEventListener(
                "click",
                () => {

                    const max =
                        maxReviewIndex();

                    if (
                        reviewIndex <
                        max
                    ) {

                        reviewIndex++;

                        updateSlider();

                    }

                }
            );

        }


        /* -------------------------
           PREVIOUS
        ------------------------- */

        if (prev) {

            prev.addEventListener(
                "click",
                () => {

                    if (
                        reviewIndex > 0
                    ) {

                        reviewIndex--;

                        updateSlider();

                    }

                }
            );

        }


        /* -------------------------
           TOUCH SWIPE
        ------------------------- */

        let startX = 0;
        let startY = 0;


        slider.addEventListener(
            "touchstart",
            event => {

                if (
                    !event.touches ||
                    !event.touches.length
                ) {
                    return;
                }

                startX =
                    event.touches[0].clientX;

                startY =
                    event.touches[0].clientY;

            },
            {
                passive: true
            }
        );


        slider.addEventListener(
            "touchend",
            event => {

                if (
                    !event.changedTouches ||
                    !event.changedTouches.length
                ) {
                    return;
                }

                const endX =
                    event.changedTouches[0].clientX;

                const endY =
                    event.changedTouches[0].clientY;

                const differenceX =
                    startX - endX;

                const differenceY =
                    startY - endY;


                if (
                    Math.abs(differenceX) >
                    Math.abs(differenceY)
                ) {

                    if (differenceX > 50) {

                        reviewIndex++;

                    }
                    else if (differenceX < -50) {

                        reviewIndex--;

                    }

                    updateSlider();

                }

            },
            {
                passive: true
            }
        );


        /* -------------------------
           RESIZE
        ------------------------- */

        let resizeTimer;


        window.addEventListener(
            "resize",
            () => {

                clearTimeout(resizeTimer);

                resizeTimer =
                    setTimeout(
                        () => {

                            createDots();

                            updateSlider();

                        },
                        150
                    );

            }
        );


        createDots();

        updateSlider();

    }


    /* =====================================================
       LOAD REVIEWS
    ===================================================== */

    if (homeReviews) {

        fetch("reviews.json")

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Could not load reviews.json"
                    );

                }

                return response.json();

            })

            .then(reviews => {

                homeReviews.innerHTML = "";

                const reviewList =
                    Array.isArray(reviews)
                        ? reviews
                        : [];


                reviewList.forEach(
                    review => {

                        const card =
                            document.createElement("div");

                        card.className =
                            "review-card";


                        card.innerHTML = `

                            <div class="review-photo">

                                <img
                                    src="${review.photo || ""}"
                                    alt="${review.name || "Traveller"}"
                                    class="review-avatar"
                                    loading="eager"
                                    decoding="async"
                                >

                            </div>

                            <div class="review-content">

                                <p>
                                    "${review.review || ""}"
                                </p>

                                <h3>
                                    ${review.name || ""}
                                </h3>

                            </div>

                        `;


                        homeReviews.appendChild(card);

                    }
                );


                initializeReviewSlider();

            })

            .catch(error => {

                console.error(
                    "Error loading reviews:",
                    error
                );

            });

    }


    /* =====================================================
       HOMEPAGE PACKAGES
       packages.json
       FIRST 3 PACKAGES
    ===================================================== */

    const homePackages =
        document.querySelector("#home-packages");


    if (homePackages) {

        fetch("packages.json")

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Could not load packages.json"
                    );

                }

                return response.json();

            })

            .then(packages => {

                homePackages.innerHTML = "";

                const packageList =
                    Array.isArray(packages)
                        ? packages.slice(0, 3)
                        : [];


                packageList.forEach(
                    pkg => {

                        const card =
                            document.createElement("article");

                        card.className =
                            "package-card";


                        const title =
                            pkg.title || "";

                        const subtitle =
                            pkg.subtitle || "";

                        const category =
                            pkg.category || "";

                        const duration =
                            pkg.duration || "";

                        const price =
                            pkg.price || "";

                        const priceNote =
                            pkg.priceNote || "";

                        const image =
                            pkg.image || "";

                        const status =
                            pkg.status || "";

                        const description =
                            pkg.description || "";

                        const destinations =
                            pkg.destinations || "";


                        card.innerHTML = `

                            <div class="package-image">

                                <img
                                    src="${image}"
                                    alt="${title}"
                                    loading="lazy"
                                >

                                ${
                                    status
                                        ? `
                                            <span class="package-status">
                                                ${status}
                                            </span>
                                        `
                                        : ""
                                }

                            </div>


                            <div class="package-content">

                                ${
                                    category
                                        ? `
                                            <span class="package-category">
                                                ${category}
                                            </span>
                                        `
                                        : ""
                                }


                                <h3>
                                    ${title}
                                </h3>


                                ${
                                    subtitle
                                        ? `
                                            <p class="package-subtitle">
                                                ${subtitle}
                                            </p>
                                        `
                                        : ""
                                }


                                ${
                                    description
                                        ? `
                                            <p class="package-description">
                                                ${description}
                                            </p>
                                        `
                                        : ""
                                }


                                <div class="package-meta">

                                    ${
                                        duration
                                            ? `
                                                <span>
                                                    <i
                                                        class="fa-regular fa-calendar"
                                                        aria-hidden="true"
                                                    ></i>

                                                    ${duration}
                                                </span>
                                            `
                                            : ""
                                    }


                                    ${
                                        destinations
                                            ? `
                                                <span>
                                                    <i
                                                        class="fa-solid fa-location-dot"
                                                        aria-hidden="true"
                                                    ></i>

                                                    ${destinations}
                                                </span>
                                            `
                                            : ""
                                    }

                                </div>


                                <div class="package-bottom">

                                    <div class="package-price">

                                        ${
                                            price
                                                ? `
                                                    <strong>
                                                        ${price}
                                                    </strong>
                                                `
                                                : ""
                                        }


                                        ${
                                            priceNote
                                                ? `
                                                    <small>
                                                        ${priceNote}
                                                    </small>
                                                `
                                                : ""
                                        }

                                    </div>


                                    <a
    href="packages.html?package=${encodeURIComponent(pkg.id || "")}"
    class="package-btn"
>
    View Package
</a>

                                </div>

                            </div>

                        `;


                        homePackages.appendChild(card);

                    }
                );

            })

            .catch(error => {

                console.error(
                    "Error loading packages:",
                    error
                );

            });

    }


    /* =====================================================
       EXPERIENCES
       experiences.json
       FIRST 4 EXPERIENCES
    ===================================================== */

    const homeExperiences =
        document.querySelector("#home-experiences");


    if (homeExperiences) {

        fetch("experiences.json")

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Could not load experiences.json"
                    );

                }

                return response.json();

            })

            .then(experiences => {

                homeExperiences.innerHTML = "";

                const experienceList =
                    Array.isArray(experiences)
                        ? experiences.slice(0, 4)
                        : [];


                experienceList.forEach(
                    experience => {

                        const card =
                            document.createElement("article");

                        card.className =
                            "experience-card";


                        const image =
                            experience.image ||
                            experience.photo ||
                            "";


                        const title =
                            experience.title ||
                            experience.name ||
                            "Experience";


                        const description =
                            experience.description ||
                            experience.text ||
                            "";


                        card.innerHTML = `

                            <div class="experience-image">

                                <img
                                    src="${image}"
                                    alt="${title}"
                                    loading="lazy"
                                >

                            </div>


                            <div class="experience-content">

                                <h3>
                                    ${title}
                                </h3>

                                <p>
                                    ${description}
                                </p>

                            </div>

                        `;


                        homeExperiences.appendChild(card);

                    }
                );

            })

            .catch(error => {

                console.error(
                    "Error loading experiences:",
                    error
                );

            });

    }


    /* =====================================================
       MOUSE PARALLAX
       HERO ONLY
    ===================================================== */

    if (
        window.matchMedia("(pointer:fine)").matches
    ) {

        const content =
            document.querySelector(
                ".hero-section .content"
            );


        const layers =
            document.querySelectorAll(
                ".hero-section .back-2," +
                ".hero-section .back-3," +
                ".hero-section .back-4," +
                ".hero-section .back-5," +
                ".hero-section .cloud"
            );


        if (
            content &&
            layers.length
        ) {

            let mouseX = 0;
            let mouseY = 0;

            let currentX = 0;
            let currentY = 0;


            window.addEventListener(
                "mousemove",
                event => {

                    mouseX =
                        event.clientX /
                        window.innerWidth -
                        0.5;


                    mouseY =
                        event.clientY /
                        window.innerHeight -
                        0.5;

                }
            );


            function animateParallax() {

                currentX +=
                    (
                        mouseX -
                        currentX
                    ) * 0.08;


                currentY +=
                    (
                        mouseY -
                        currentY
                    ) * 0.08;


                layers.forEach(
                    (layer, index) => {

                        const speed =
                            (index + 1) * 15;


                        layer.style.translate =
                            `${currentX * speed}px ${currentY * speed}px`;

                    }
                );


                requestAnimationFrame(
                    animateParallax
                );

            }


            animateParallax();

        }

    }


    /* =====================================================
       MOBILE GYROSCOPE PARALLAX
       HERO ONLY
    ===================================================== */

    if (
        window.matchMedia("(pointer:coarse)").matches
    ) {

        const layers =
            document.querySelectorAll(
                ".hero-section .back-2," +
                ".hero-section .back-3," +
                ".hero-section .back-4," +
                ".hero-section .back-5," +
                ".hero-section .cloud"
            );


        if (layers.length) {

            window.addEventListener(
                "deviceorientation",
                event => {

                    const tiltX =
                        (event.gamma || 0) / 45;

                    const tiltY =
                        (event.beta || 0) / 45;


                    layers.forEach(
                        (layer, index) => {

                            const speed =
                                (index + 1) * 10;


                            layer.style.translate =
                                `${tiltX * speed}px ${tiltY * speed}px`;

                        }
                    );

                }
            );

        }

    }


    /* =====================================================
       CINEMATIC HERO TRANSITION
       DESKTOP + TABLET ONLY

       IMPORTANT:
       This does NOT control page scrolling.
    ===================================================== */

    if (
        window.matchMedia("(min-width: 768px)").matches
    ) {

        const heroSection =
            document.querySelector(".hero-section");


        const heroContent =
            document.querySelector(
                ".hero-section .content"
            );


        const svgLayers =
            document.querySelectorAll(
                ".hero-section .back-2," +
                ".hero-section .back-3," +
                ".hero-section .back-4," +
                ".hero-section .back-5," +
                ".hero-section .cloud"
            );


        const nextSection =
            document.querySelector(
                ".featured-packages-section"
            );


        const lowerSections =
            document.querySelectorAll(
                ".featured-packages-section," +
                ".experiences-section," +
                ".why-choose-section," +
                ".reviews-section," +
                ".final-cta-section"
            );


        if (heroSection) {

            let ticking = false;


            function clamp(
                value,
                min,
                max
            ) {

                return Math.max(
                    min,
                    Math.min(
                        max,
                        value
                    )
                );

            }


            function easeInOut(t) {

                return (
                    t *
                    t *
                    (3 - 2 * t)
                );

            }


            function updatePageTransition() {

                const heroHeight =
                    heroSection.offsetHeight;


                const scrollY =
                    window.scrollY;


                if (!heroHeight) {

                    ticking = false;

                    return;

                }


                /* -----------------------------------------
                   HERO FADE
                ----------------------------------------- */

                const TRANSITION_PERCENT =
                    0.90;


                const triggerPoint =
                    heroHeight *
                    TRANSITION_PERCENT;


                let progress =
                    scrollY /
                    triggerPoint;


                progress =
                    clamp(
                        progress,
                        0,
                        1
                    );


                const eased =
                    easeInOut(progress);


                if (heroContent) {

                    heroContent.style.opacity =
                        String(1 - eased);


                    heroContent.style.filter =
                        `blur(${eased * 6}px)`;


                    heroContent.style.transform =
                        `scale(${1 + eased * 0.03})`;

                }


                /* -----------------------------------------
                   SVG FADE
                ----------------------------------------- */

                const SVG_FADE_START =
                    0.75;


                const svgFadeProgress =
                    clamp(
                        (
                            (scrollY / heroHeight) -
                            SVG_FADE_START
                        ) /
                        (1 - SVG_FADE_START),
                        0,
                        1
                    );


                const svgEased =
                    easeInOut(
                        svgFadeProgress
                    );


                svgLayers.forEach(
                    layer => {

                        layer.style.opacity =
                            String(
                                1 - svgEased
                            );


                        layer.style.transform =
                            `translateY(${svgEased * -40}px)`;

                    }
                );


                /* -----------------------------------------
                   FOREST OPACITY
                ----------------------------------------- */

                if (nextSection) {

                    nextSection.style.setProperty(
                        "--forest-opacity",
                        String(1 - svgEased)
                    );

                }


                /* -----------------------------------------
                   SECTION ENTRANCE
                   
                   This is ONLY visual.
                   It does NOT lock scrolling.
                ----------------------------------------- */

                lowerSections.forEach(
                    section => {

                        const sectionTop =
                            section.getBoundingClientRect().top;


                        const startPoint =
                            window.innerHeight * 0.90;


                        const endPoint =
                            window.innerHeight * 0.35;


                        let sectionProgress =
                            (
                                startPoint -
                                sectionTop
                            ) /
                            (
                                startPoint -
                                endPoint
                            );


                        sectionProgress =
                            clamp(
                                sectionProgress,
                                0,
                                1
                            );


                        const sectionEased =
                            easeInOut(
                                sectionProgress
                            );


                        const START_OFFSET =
                            60;


                        const moveY =
                            START_OFFSET *
                            (1 - sectionEased);


                        section.style.transform =
                            `translateY(${moveY}px)`;

                    }
                );


                ticking = false;

            }


            window.addEventListener(
                "scroll",
                () => {

                    if (ticking) {
                        return;
                    }


                    ticking = true;


                    requestAnimationFrame(
                        updatePageTransition
                    );

                },
                {
                    passive: true
                }
            );


            window.addEventListener(
                "resize",
                updatePageTransition
            );


            updatePageTransition();

        }

    }


    /* =====================================================
       CURSOR LIGHT TRAIL
    ===================================================== */

    const trail =
        document.querySelector(
            ".cursor-trail"
        );


    if (trail) {

        document.addEventListener(
            "mousemove",
            event => {

                trail.style.left =
                    event.clientX + "px";

                trail.style.top =
                    event.clientY + "px";

                trail.classList.add(
                    "active"
                );

            }
        );


        document.addEventListener(
            "mouseleave",
            () => {

                trail.classList.remove(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       PAGE LOADER
    ===================================================== */

    function hideLoader() {

        const loader =
            document.querySelector(
                ".loader"
            );


        if (!loader) {
            return;
        }


        setTimeout(
            () => {

                loader.classList.add(
                    "hide"
                );

            },
            500
        );

    }


    if (
        document.readyState === "complete"
    ) {

        hideLoader();

    }
    else {

        window.addEventListener(
            "load",
            hideLoader
        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuBtn =
        document.querySelector(
            "#menu-btn"
        );


    const menu =
        document.querySelector(
            "#menu"
        );


    if (
        menuBtn &&
        menu
    ) {

        menuBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                menu.classList.toggle(
                    "show"
                );

            }
        );

    }


    /* =====================================================
       SEARCH SYSTEM
    ===================================================== */

    const searchBtn =
        document.querySelector(
            "#search-btn"
        );


    const searchBox =
        document.querySelector(
            ".search-box"
        );


    const mobileSearch =
        document.querySelector(
            ".mobile-search-overlay"
        );


    const closeSearch =
        document.querySelector(
            "#close-search"
        );


    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (
                    window.innerWidth <= 768
                ) {

                    if (mobileSearch) {

                        mobileSearch.classList.add(
                            "active"
                        );

                    }

                }
                else {

                    if (searchBox) {

                        searchBox.classList.toggle(
                            "open"
                        );

                    }

                }

            }
        );

    }


    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            () => {

                if (mobileSearch) {

                    mobileSearch.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE SEARCH OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            const searchOverlay =
                document.querySelector(
                    ".mobile-search-overlay"
                );


            const currentSearchBtn =
                document.querySelector(
                    "#search-btn"
                );


            if (!searchOverlay) {
                return;
            }


            if (
                searchOverlay.classList.contains("active") &&
                !searchOverlay.contains(event.target) &&
                currentSearchBtn &&
                !currentSearchBtn.contains(event.target)
            ) {

                searchOverlay.classList.remove(
                    "active"
                );

            }

        }
    );


    /* =====================================================
       CLOSE MOBILE MENU OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            const currentMenu =
                document.querySelector(
                    "#menu"
                );


            const currentMenuBtn =
                document.querySelector(
                    "#menu-btn"
                );


            if (
                !currentMenu ||
                !currentMenuBtn
            ) {
                return;
            }


            if (
                currentMenu.classList.contains("show") &&
                !currentMenu.contains(event.target) &&
                !currentMenuBtn.contains(event.target)
            ) {

                currentMenu.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       LIGHTNING EFFECT
       Safe if lightning element exists
    ===================================================== */

    const lightning =
        document.querySelector(
            ".lightning"
        );


    if (lightning) {

        setInterval(
            () => {

                if (
                    Math.random() > 0.75
                ) {

                    lightning.classList.add(
                        "flash"
                    );


                    setTimeout(
                        () => {

                            lightning.classList.remove(
                                "flash"
                            );

                        },
                        120
                    );

                }

            },
            3000
        );

    }

});