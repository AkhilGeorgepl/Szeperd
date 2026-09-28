/* =========================================================
   SZEPERD GALLERY
   Dynamic folder scanning + dynamic artistic collage
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const GALLERY_LIST_URL = "gallery-list.php";

    const galleryGrid =
        document.getElementById("gallery-grid");

    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightbox-image");

    const lightboxTitle =
        document.getElementById("lightbox-title");

    const lightboxClose =
        document.getElementById("lightbox-close");

    const lightboxPrev =
        document.getElementById("lightbox-prev");

    const lightboxNext =
        document.getElementById("lightbox-next");

    const menuBtn =
        document.getElementById("menu-btn");

    const menu =
        document.getElementById("menu");


    /* =====================================================
       STATE
       ===================================================== */

    let galleryImages = [];

    let currentIndex = 0;

    let tileView = false;

    let photoLayer = 1;

    let touchStartX = 0;

    let touchEndX = 0;

    let resizeTimer = null;

    let collageVersion = 0;

    /*
     * Hover layer.
     *
     * Gallery photos stay below the floating controls.
     * Controls use z-index 1100 / 1200.
     */
    let hoverLayer = 600;


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (menuBtn && menu) {

        menuBtn.addEventListener(
            "click",
            () => {

                menu.classList.toggle("open");

                const isOpen =
                    menu.classList.contains("open");

                menuBtn.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

                menuBtn.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close navigation menu"
                        : "Open navigation menu"
                );

                const icon =
                    menuBtn.querySelector("i");

                if (icon) {

                    icon.classList.toggle(
                        "fa-bars",
                        !isOpen
                    );

                    icon.classList.toggle(
                        "fa-xmark",
                        isOpen
                    );
                }

            }
        );


        menu.querySelectorAll("a").forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        menu.classList.remove(
                            "open"
                        );

                        menuBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        menuBtn.setAttribute(
                            "aria-label",
                            "Open navigation menu"
                        );

                        const icon =
                            menuBtn.querySelector("i");

                        if (icon) {

                            icon.classList.add(
                                "fa-bars"
                            );

                            icon.classList.remove(
                                "fa-xmark"
                            );
                        }

                    }
                );

            }
        );
    }


    /* =====================================================
       CREATE LAYOUT BUTTON
       ===================================================== */

    const layoutButton =
        document.createElement("button");

    layoutButton.type =
        "button";

    layoutButton.className =
        "gallery-layout-button";

    layoutButton.setAttribute(
        "aria-label",
        "View gallery as tiles"
    );

    layoutButton.innerHTML = `
        <i class="fas fa-grip"></i>
    `;

    document.body.appendChild(
        layoutButton
    );


    /* =====================================================
       CREATE VIEW-ALL BUTTON
       ===================================================== */

    const seeAllButton =
        document.createElement("button");

    seeAllButton.type =
        "button";

    seeAllButton.className =
        "gallery-see-all";

    seeAllButton.textContent =
        "Click here to view all";

    document.body.appendChild(
        seeAllButton
    );


    /* =====================================================
       GET DISPLAY NAME
       ===================================================== */

    function getDisplayName(filename) {

        return filename.replace(
            /\.(jpg|jpeg)$/i,
            ""
        );
    }


    /* =====================================================
       HOVER BRING TO TOP
       ===================================================== */

    function setupHoverBringToTop(item) {

        /*
         * Only activate this effect on devices
         * that actually support mouse hovering.
         */

        if (
            !window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches
        ) {
            return;
        }


        item.addEventListener(
            "mouseenter",
            () => {

                /*
                 * Do not restart the animation while
                 * the same photo is already animating.
                 */

                if (
                    item.dataset.hoverAnimating === "true"
                ) {
                    return;
                }


                item.dataset.hoverAnimating =
                    "true";


                /*
                 * Restart the CSS animation cleanly.
                 */

                item.classList.remove(
                    "hover-bring-to-top"
                );


                void item.offsetWidth;


                item.classList.add(
                    "hover-bring-to-top"
                );


                /*
                 * During the fade-out, move the photo
                 * to the top layer.
                 *
                 * The CSS animation fades the photo
                 * out first, so the z-index change is
                 * invisible to the viewer.
                 */

                setTimeout(
                    () => {

                        hoverLayer += 1;


                        /*
                         * Keep gallery photos below
                         * the floating controls.
                         */

                        if (
                            hoverLayer >= 1090
                        ) {

                            hoverLayer = 600;

                        }


                        item.style.zIndex =
                            hoverLayer;

                    },
                    190
                );


                /*
                 * Animation duration is 0.42 seconds.
                 */

                setTimeout(
                    () => {

                        item.classList.remove(
                            "hover-bring-to-top"
                        );

                        item.dataset.hoverAnimating =
                            "false";

                    },
                    430
                );

            }
        );
    }


    /* =====================================================
       GET COLLAGE SETTINGS
       ===================================================== */

    function getCollageSettings() {

        const width =
            galleryGrid.clientWidth ||
            window.innerWidth;


        /* =================================================
           DESKTOP
           ================================================= */

        if (width > 1100) {

            return {
                columns: 5,

                cardWidth: 300,
                cardHeight: 360,

                xStep: 195,
                yStep: 125,

                topOffset: 10,

                edgeOverflow: 0
            };
        }


        /* =================================================
           TABLET
           ================================================= */

        if (width > 800) {

            return {
                columns: 4,

                cardWidth: 260,
                cardHeight: 320,

                xStep: 168,
                yStep: 112,

                topOffset: 10,

                edgeOverflow: 0
            };
        }


        /* =================================================
           MOBILE
           ================================================= */

        if (width > 450) {

            return {
                columns: 2,

                cardWidth: 175,
                cardHeight: 215,

                xStep: 150,

                yStep: 98,

                topOffset: 5,

                edgeOverflow: 42
            };
        }


        /* =================================================
           SMALL PHONES
           ================================================= */

        return {
            columns: 2,

            cardWidth: 145,
            cardHeight: 180,

            xStep: 120,

            yStep: 82,

            topOffset: 5,

            edgeOverflow: 34
        };
    }


    /* =====================================================
       CALCULATE COLLAGE
       ===================================================== */

    function arrangeCollage() {

        if (
            tileView ||
            !galleryGrid
        ) {
            return;
        }


        const settings =
            getCollageSettings();


        const {
            columns,
            cardWidth,
            cardHeight,
            xStep,
            yStep,
            topOffset,
            edgeOverflow
        } = settings;


        const gridWidth =
            galleryGrid.clientWidth;


        const rows =
            Math.ceil(
                galleryImages.length /
                columns
            );


        const isMobile =
            gridWidth <= 800;


        /* =================================================
           COLLAGE GROUP WIDTH
           ================================================= */

        const groupWidth =
            (
                (columns - 1) *
                xStep
            ) +
            cardWidth;


        let groupLeft;


        if (isMobile) {

            groupLeft =
                (
                    gridWidth -
                    groupWidth
                ) / 2;

            groupLeft +=
                12;

        } else {

            groupLeft =
                Math.max(
                    0,
                    (
                        gridWidth -
                        groupWidth
                    ) / 2
                );
        }


        /* =================================================
           COLLAGE HEIGHT
           ================================================= */

        const collageHeight =
            Math.max(
                1050,
                topOffset +
                cardHeight +
                (
                    (rows - 1) *
                    yStep
                ) +
                100
            );


        galleryGrid.style.minHeight =
            `${collageHeight}px`;


        /* =================================================
           ITEMS
           ================================================= */

        const items =
            galleryGrid.querySelectorAll(
                ".gallery-item"
            );


        items.forEach(
            (item, index) => {

                const column =
                    index % columns;

                const row =
                    Math.floor(
                        index / columns
                    );


                let xOffset = 0;

                let yOffset = 0;


                /* =================================================
                   DESKTOP PATTERN
                   ================================================= */

                if (!isMobile) {

                    const patternA_X = [
                        -32, 24, -18, 31, -25,
                         17, -36, 28, -13, 23,
                        -27, 18, -34, 25, -15,
                         30, -22, 36, -19, 14
                    ];

                    const patternA_Y = [
                         0,  21, -15, 18, -24,
                        13, -20, 27, -11, 19,
                       -26, 14, -19, 25, -12,
                        22, -23, 16, -18, 24
                    ];


                    const patternB_X = [
                         21, -30, 28, -19, 35,
                        -14, 32, -25, 18, -34,
                         26, -16, 31, -28, 20,
                        -36, 15, -24, 29, -18
                    ];

                    const patternB_Y = [
                        17, -22, 12, -28, 21,
                       -10, 25, -18, 14, -24,
                        19, -13, 27, -20, 11,
                       -26, 16, -12, 23, -17
                    ];


                    const useSecondPattern =
                        collageVersion % 2 === 1;


                    if (useSecondPattern) {

                        xOffset =
                            patternB_X[
                                index %
                                patternB_X.length
                            ];

                        yOffset =
                            patternB_Y[
                                index %
                                patternB_Y.length
                            ];

                    } else {

                        xOffset =
                            patternA_X[
                                index %
                                patternA_X.length
                            ];

                        yOffset =
                            patternA_Y[
                                index %
                                patternA_Y.length
                            ];
                    }


                    if (row % 2 === 1) {

                        xOffset +=
                            xStep * 0.20;

                    } else {

                        xOffset -=
                            xStep * 0.07;

                    }


                    if (row % 3 === 1) {

                        yOffset += 13;

                    }

                    if (row % 3 === 2) {

                        yOffset -= 8;

                    }

                }


                /* =================================================
                   MOBILE PATTERN
                   ================================================= */

                if (isMobile) {

                    const mobileA_X = [
                        -30,
                         24,
                        -18,
                         29,
                        -26,
                         20,
                        -22,
                         28,
                        -16,
                         24
                    ];

                    const mobileA_Y = [
                         0,
                         8,
                        -6,
                        10,
                        -5,
                         7,
                        -8,
                         9,
                        -4,
                         6
                    ];


                    const mobileB_X = [
                         24,
                        -31,
                         29,
                        -21,
                         32,
                        -26,
                         20,
                        -29,
                         27,
                        -18
                    ];

                    const mobileB_Y = [
                         7,
                        -5,
                         11,
                         -7,
                         6,
                        -9,
                         8,
                        -4,
                         10,
                        -6
                    ];


                    const useSecondPattern =
                        collageVersion % 2 === 1;


                    if (useSecondPattern) {

                        xOffset =
                            mobileB_X[
                                index %
                                mobileB_X.length
                            ];

                        yOffset =
                            mobileB_Y[
                                index %
                                mobileB_Y.length
                            ];

                    } else {

                        xOffset =
                            mobileA_X[
                                index %
                                mobileA_X.length
                            ];

                        yOffset =
                            mobileA_Y[
                                index %
                                mobileA_Y.length
                            ];
                    }


                    if (row % 2 === 1) {

                        xOffset += 16;

                    } else {

                        xOffset -= 10;

                    }

                }


                /* =================================================
                   X POSITION
                   ================================================= */

                let x =
                    groupLeft +
                    (
                        column *
                        xStep
                    ) +
                    xOffset;


                /* =================================================
                   DESKTOP EDGE PROTECTION
                   ================================================= */

                if (!isMobile) {

                    if (
                        x +
                        cardWidth >
                        gridWidth
                    ) {

                        x =
                            gridWidth -
                            cardWidth -
                            5;
                    }


                    if (x < 5) {

                        x = 5;

                    }
                }


                /* =================================================
                   MOBILE EDGE PROTECTION
                   ================================================= */

                if (isMobile) {

                    const minimum =
                        -edgeOverflow;

                    const maximum =
                        gridWidth -
                        cardWidth +
                        edgeOverflow;


                    if (x < minimum) {

                        x = minimum;

                    }


                    if (x > maximum) {

                        x = maximum;

                    }
                }


                /* =================================================
                   Y POSITION
                   ================================================= */

                const y =
                    topOffset +
                    (
                        row *
                        yStep
                    ) +
                    yOffset;


                /* =================================================
                   SET POSITION
                   ================================================= */

                item.style.setProperty(
                    "--x",
                    `${x}px`
                );

                item.style.setProperty(
                    "--y",
                    `${y}px`
                );

                item.style.setProperty(
                    "--card-width",
                    `${cardWidth}px`
                );

                item.style.setProperty(
                    "--card-height",
                    `${cardHeight}px`
                );


                /* =================================================
                   ROTATION
                   ================================================= */

                let rotations;


                if (isMobile) {

                    const mobileRotationsA = [
                        "-7deg",
                         "5deg",
                        "-4deg",
                         "7deg",
                         "4deg",
                        "-6deg",
                         "5deg",
                        "-3deg",
                         "6deg",
                        "-5deg"
                    ];


                    const mobileRotationsB = [
                         "6deg",
                        "-5deg",
                         "8deg",
                        "-3deg",
                        "-7deg",
                         "4deg",
                        "-6deg",
                         "7deg",
                        "-4deg",
                         "5deg"
                    ];


                    rotations =
                        collageVersion % 2 === 1
                            ? mobileRotationsB
                            : mobileRotationsA;

                } else {

                    const desktopRotationsA = [
                        "-8deg",
                         "5deg",
                        "-4deg",
                         "9deg",
                         "3deg",
                        "-6deg",
                         "7deg",
                        "-2deg",
                         "6deg",
                        "-7deg",
                         "4deg",
                        "-5deg",
                         "8deg",
                        "-3deg",
                         "5deg",
                        "-9deg"
                    ];


                    const desktopRotationsB = [
                         "6deg",
                        "-7deg",
                         "3deg",
                        "-9deg",
                         "5deg",
                        "-4deg",
                         "8deg",
                        "-6deg",
                         "2deg",
                         "7deg",
                        "-5deg",
                         "9deg",
                        "-3deg",
                         "6deg",
                        "-8deg",
                         "4deg"
                    ];


                    rotations =
                        collageVersion % 2 === 1
                            ? desktopRotationsB
                            : desktopRotationsA;
                }


                item.style.setProperty(
                    "--rotation",
                    rotations[
                        index %
                        rotations.length
                    ]
                );


                item.style.transform =
                    `rotate(${item.style.getPropertyValue("--rotation")})`;

            }
        );
    }


    /* =====================================================
       TWO-STACK COLLAGE

       Used ONLY when returning from tile view.

       The initial collage does NOT use this function.
       ===================================================== */

    function arrangeTwoStackCollage() {

        if (
            tileView ||
            !galleryGrid
        ) {
            return;
        }


        const width =
            galleryGrid.clientWidth ||
            window.innerWidth;


        const settings =
            getCollageSettings();


        const {
            cardWidth,
            cardHeight
        } = settings;


        const items =
            galleryGrid.querySelectorAll(
                ".gallery-item"
            );


        if (items.length === 0) {
            return;
        }


        const isMobile =
            width <= 800;


        /* =================================================
           CARD / STACK SETTINGS
           ================================================= */

        let xStep;
        let yStep;
        let top;
        let leftBase;
        let rightBase;


        if (width > 1100) {

            xStep = 15;
            yStep = 4;
            top = 20;

            leftBase =
                width * 0.08;

            rightBase =
                width * 0.55;

        } else if (width > 800) {

            xStep = 13;
            yStep = 4;
            top = 15;

            leftBase =
                width * 0.05;

            rightBase =
                width * 0.56;

        } else if (width > 450) {

            xStep = 11;
            yStep = 3;
            top = 15;

            leftBase = -22;

            rightBase =
                width -
                cardWidth +
                22;

        } else {

            xStep = 8;
            yStep = 3;
            top = 12;

            leftBase = -18;

            rightBase =
                width -
                cardWidth +
                18;
        }


        /* =================================================
           TWO GROUPS
           ================================================= */

        const splitPoint =
            Math.ceil(
                items.length / 2
            );


        const leftItems =
            Math.min(
                splitPoint,
                items.length
            );


        const rightItems =
            items.length -
            leftItems;


        const maxStack =
            Math.max(
                leftItems,
                rightItems
            );


        const stackHeight =
            top +
            cardHeight +
            (
                Math.max(
                    0,
                    maxStack - 1
                ) *
                yStep
            ) +
            80;


        galleryGrid.style.minHeight =
            `${Math.max(
                1050,
                stackHeight
            )}px`;


        /* =================================================
           ROTATION PATTERNS
           ================================================= */

        const leftRotations = [
            "-8deg",
             "5deg",
            "-5deg",
             "7deg",
            "-3deg",
             "6deg",
            "-7deg",
             "4deg",
            "-6deg",
             "8deg",
            "-4deg",
             "5deg"
        ];


        const rightRotations = [
             "7deg",
            "-6deg",
             "4deg",
            "-8deg",
             "5deg",
            "-4deg",
             "8deg",
            "-5deg",
             "6deg",
            "-7deg",
             "3deg",
            "-6deg"
        ];


        /* =================================================
           POSITION EACH PHOTO
           ================================================= */

        items.forEach(
            (item, index) => {

                const isLeft =
                    index <
                    splitPoint;


                let stackIndex;


                if (isLeft) {

                    stackIndex =
                        index;

                } else {

                    stackIndex =
                        index -
                        splitPoint;

                }


                /* =================================================
                   X POSITION
                   ================================================= */

                let x;


                if (isLeft) {

                    x =
                        leftBase +
                        (
                            stackIndex *
                            xStep
                        );

                } else {

                    x =
                        rightBase -
                        (
                            stackIndex *
                            xStep
                        );
                }


                /* =================================================
                   Y POSITION
                   ================================================= */

                const y =
                    top +
                    (
                        stackIndex *
                        yStep
                    );


                /* =================================================
                   SET CARD SIZE
                   ================================================= */

                item.style.setProperty(
                    "--card-width",
                    `${cardWidth}px`
                );

                item.style.setProperty(
                    "--card-height",
                    `${cardHeight}px`
                );


                /* =================================================
                   SET POSITION
                   ================================================= */

                item.style.setProperty(
                    "--x",
                    `${x}px`
                );

                item.style.setProperty(
                    "--y",
                    `${y}px`
                );


                /* =================================================
                   SET ROTATION
                   ================================================= */

                const rotation =
                    isLeft
                        ? leftRotations[
                            stackIndex %
                            leftRotations.length
                        ]
                        : rightRotations[
                            stackIndex %
                            rightRotations.length
                        ];


                item.style.setProperty(
                    "--rotation",
                    rotation
                );


                item.style.zIndex =
                    100 +
                    stackIndex;


                item.style.transform =
                    `rotate(${rotation})`;


                item.style.opacity =
                    "1";

            }
        );
    }


    /* =====================================================
       CREATE GALLERY ITEM
       ===================================================== */

    function createGalleryItem(
        filename,
        index
    ) {

        const item =
            document.createElement("article");

        item.className =
            "gallery-item";

        item.dataset.index =
            index;


        /*
         * Set up the smooth hover effect.
         */

        setupHoverBringToTop(item);


        const image =
            document.createElement("img");


        image.alt =
            `Szeperd gallery photograph ${getDisplayName(filename)}`;


        image.loading =
            "eager";


        image.decoding =
            "async";


        const caption =
            document.createElement("div");

        caption.className =
            "polaroid-caption";


        const captionText =
            document.createElement("span");


        captionText.textContent =
            getDisplayName(filename);


        caption.appendChild(
            captionText
        );


        item.appendChild(
            image
        );

        item.appendChild(
            caption
        );


        /* =================================================
           IMAGE LOADED
           ================================================= */

        image.addEventListener(
            "load",
            () => {

                item.classList.add(
                    "loaded"
                );


                photoLayer += 1;

                item.style.zIndex =
                    photoLayer;


                if (!tileView) {

                    requestAnimationFrame(
                        () => {

                            item.classList.add(
                                "photo-fall"
                            );

                        }
                    );
                }

            }
        );


        /* =================================================
           IMAGE ERROR
           ================================================= */

        image.addEventListener(
            "error",
            () => {

                console.warn(
                    "Unable to load gallery image:",
                    filename
                );


                item.classList.add(
                    "loaded"
                );


                photoLayer += 1;

                item.style.zIndex =
                    photoLayer;

            }
        );


        image.src =
            `gallery/${encodeURIComponent(filename)}`;


        /* =================================================
           LIGHTBOX
           ================================================= */

        item.addEventListener(
            "click",
            () => {

                if (
                    !item.classList.contains(
                        "loaded"
                    )
                ) {
                    return;
                }


                openLightbox(index);

            }
        );


        return item;
    }


    /* =====================================================
       LOAD GALLERY
       ===================================================== */

    async function loadGallery() {

        try {

            const response =
                await fetch(
                    GALLERY_LIST_URL,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Gallery request failed: ${response.status}`
                );
            }


            const files =
                await response.json();


            if (!Array.isArray(files)) {

                throw new Error(
                    "Gallery list is not an array."
                );
            }


            galleryImages =
                files.filter(
                    file =>
                        typeof file === "string" &&
                        /\.(jpg|jpeg)$/i.test(file)
                );


            galleryGrid.innerHTML =
                "";


            photoLayer =
                1;


            collageVersion =
                0;


            hoverLayer =
                600;


            if (
                galleryImages.length === 0
            ) {
                return;
            }


            galleryImages.forEach(
                (filename, index) => {

                    const item =
                        createGalleryItem(
                            filename,
                            index
                        );


                    galleryGrid.appendChild(
                        item
                    );

                }
            );


            arrangeCollage();


            setCollageView(
                false
            );

        } catch (error) {

            console.error(
                "Gallery loading error:",
                error
            );

        }
    }


    /* =====================================================
       COLLAGE VIEW
       ===================================================== */

    function setCollageView(
        animateLoadedPhotos = false
    ) {

        /*
         * Remember whether we are coming from
         * tile view BEFORE changing tileView.
         */

        const comingFromTile =
            tileView;


        tileView =
            false;


        galleryGrid.classList.remove(
            "tile-view"
        );

        galleryGrid.classList.add(
            "collage-view"
        );


        const items =
            galleryGrid.querySelectorAll(
                ".gallery-item"
            );


        items.forEach(
            item => {

                item.style.display =
                    "block";


                item.style.transform =
                    "none";


                if (animateLoadedPhotos) {

                    item.classList.remove(
                        "photo-fall"
                    );

                }

            }
        );


        /* =================================================
           IMPORTANT

           Initial collage:
           KEEP arrangeCollage()

           Tile ? collage:
           USE TWO STACKS
           ================================================= */

        if (comingFromTile) {

            collageVersion += 1;

            arrangeTwoStackCollage();

        } else {

            arrangeCollage();

        }


        /* =================================================
           RESTORE FINAL ROTATION
           ================================================= */

        items.forEach(
            item => {

                item.style.transform =
                    `rotate(${
                        item.style.getPropertyValue(
                            "--rotation"
                        )
                    })`;

            }
        );


        seeAllButton.style.display =
            "block";


        layoutButton.innerHTML = `
            <i class="fas fa-grip"></i>
        `;


        layoutButton.setAttribute(
            "aria-label",
            "View gallery as tiles"
        );

    }


    /* =====================================================
       TILE VIEW
       ===================================================== */

    function setTileView() {

        tileView =
            true;


        galleryGrid.classList.remove(
            "collage-view"
        );

        galleryGrid.classList.add(
            "tile-view"
        );


        galleryGrid
            .querySelectorAll(
                ".gallery-item"
            )
            .forEach(
                item => {

                    item.style.display =
                        "block";


                    item.classList.remove(
                        "photo-fall"
                    );

                }
            );


        seeAllButton.style.display =
            "none";


        layoutButton.innerHTML = `
            <i class="fas fa-layer-group"></i>
        `;


        layoutButton.setAttribute(
            "aria-label",
            "View gallery as collage"
        );

    }


    /* =====================================================
       LAYOUT BUTTON
       ===================================================== */

    layoutButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (tileView) {

                setCollageView(
                    false
                );

            } else {

                setTileView();

            }

        }
    );


    /* =====================================================
       VIEW ALL BUTTON
       ===================================================== */

    seeAllButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            setTileView();

        }
    );


    /* =====================================================
       OPEN LIGHTBOX
       ===================================================== */

    function openLightbox(index) {

        if (
            index < 0 ||
            index >= galleryImages.length
        ) {
            return;
        }


        currentIndex =
            index;


        updateLightbox();


        lightbox.classList.add(
            "open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE LIGHTBOX
       ===================================================== */

    function closeLightbox() {

        lightbox.classList.remove(
            "open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        lightboxImage.src =
            "";


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       PREVIOUS IMAGE
       ===================================================== */

    function showPrevious() {

        if (
            galleryImages.length === 0
        ) {
            return;
        }


        currentIndex =
            (
                currentIndex -
                1 +
                galleryImages.length
            ) %
            galleryImages.length;


        updateLightbox();

    }


    /* =====================================================
       NEXT IMAGE
       ===================================================== */

    function showNext() {

        if (
            galleryImages.length === 0
        ) {
            return;
        }


        currentIndex =
            (
                currentIndex +
                1
            ) %
            galleryImages.length;


        updateLightbox();

    }


    /* =====================================================
       UPDATE LIGHTBOX
       ===================================================== */

    function updateLightbox() {

        const filename =
            galleryImages[
                currentIndex
            ];


        lightboxImage.src =
            `gallery/${encodeURIComponent(filename)}`;


        lightboxImage.alt =
            `Szeperd gallery photograph ${getDisplayName(filename)}`;


        lightboxTitle.textContent =
            getDisplayName(filename);

    }


    /* =====================================================
       LIGHTBOX BUTTONS
       ===================================================== */

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );


    lightboxPrev.addEventListener(
        "click",
        showPrevious
    );


    lightboxNext.addEventListener(
        "click",
        showNext
    );


    /* =====================================================
       BACKGROUND CLOSE
       ===================================================== */

    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* =====================================================
       KEYBOARD
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox.classList.contains(
                    "open"
                )
            ) {
                return;
            }


            if (
                event.key === "Escape"
            ) {

                closeLightbox();

                return;
            }


            if (
                event.key === "ArrowLeft"
            ) {

                showPrevious();

                return;
            }


            if (
                event.key === "ArrowRight"
            ) {

                showNext();

                return;
            }

        }
    );


    /* =====================================================
       TOUCH / SWIPE
       ===================================================== */

    lightbox.addEventListener(
        "touchstart",
        event => {

            if (
                event.touches.length !== 1
            ) {
                return;
            }


            touchStartX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        event => {

            if (
                event.changedTouches.length !== 1
            ) {
                return;
            }


            touchEndX =
                event.changedTouches[0].clientX;


            const difference =
                touchEndX -
                touchStartX;


            if (
                Math.abs(difference) < 50
            ) {
                return;
            }


            if (
                difference > 0
            ) {

                showPrevious();

            } else {

                showNext();

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       WINDOW RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        if (!tileView) {

                            arrangeCollage();

                        }

                    },
                    150
                );

        }
    );


    /* =====================================================
       START
       ===================================================== */

    loadGallery();

});