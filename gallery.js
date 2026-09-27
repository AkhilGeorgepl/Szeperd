const GALLERY_FOLDER = "gallery/";
const GALLERY_LIST_URL = "gallery-list.php";

const galleryGrid = document.getElementById("gallery-grid");
const galleryStatus = document.getElementById("gallery-status");

const header = document.getElementById("site-header");
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxCounter = document.getElementById("lightbox-counter");


/* =========================================================
   GALLERY BUTTONS
   ========================================================= */

const restoreButton = document.createElement("button");

restoreButton.type = "button";

restoreButton.className = "gallery-restore-button";

restoreButton.setAttribute(
    "aria-label",
    "Bring previous photo back to front"
);

restoreButton.setAttribute(
    "title",
    "Bring previous photo back to front"
);

restoreButton.innerHTML =
    '<i class="fas fa-rotate-left"></i>';

document.body.appendChild(restoreButton);


/* =========================================================
   LAYOUT SWITCH BUTTON
   ========================================================= */

const layoutButton = document.createElement("button");

layoutButton.type = "button";

layoutButton.className = "gallery-layout-button";

layoutButton.setAttribute(
    "aria-label",
    "Switch to square tile view"
);

layoutButton.setAttribute(
    "title",
    "Switch to square tile view"
);

layoutButton.innerHTML =
    '<i class="fas fa-table-cells-large"></i>';

document.body.appendChild(layoutButton);


/* =========================================================
   SEE ALL LABEL
   ========================================================= */

const seeAllLabel = document.createElement("div");

seeAllLabel.className = "gallery-see-all";

seeAllLabel.innerHTML =
    'See all <span>Click here</span>';

document.body.appendChild(seeAllLabel);


/* =========================================================
   GALLERY STATE
   ========================================================= */

let galleryImages = [];

let currentImageIndex = 0;

let frontPhotoIndex = 0;

let sentBackPhotos = [];


/* =========================================================
   MOBILE MENU
   ========================================================= */

if (menuBtn && menu) {

    menuBtn.addEventListener("click", function(e) {

        e.preventDefault();

        e.stopPropagation();

        menu.classList.toggle("show");

    });

}


document.addEventListener("click", function(e) {

    if (!menu || !menuBtn) return;

    if (
        menu.classList.contains("show") &&
        !menu.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) {

        menu.classList.remove("show");

    }

});


/* =========================================================
   HEADER SCROLL
   ========================================================= */

window.addEventListener("scroll", function() {

    if (!header) return;

    if (window.scrollY > 20) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* =========================================================
   CREATE READABLE PHOTO TITLE
   ========================================================= */

function createReadableTitle(filename) {

    return filename

        .replace(/\.(jpg|jpeg)$/i, "")

        .replace(/[-_]+/g, " ")

        .replace(/\s+/g, " ")

        .trim()

        .replace(/\b\w/g, function(char) {

            return char.toUpperCase();

        });

}


/* =========================================================
   CREATE GALLERY ITEM
   ========================================================= */

function createGalleryItem(imageData, index) {

    const article = document.createElement("article");

    article.className = "gallery-item";

    article.dataset.index = index;

    article.dataset.title = imageData.title;


    const image = document.createElement("img");

    image.src = imageData.url;

    image.alt = imageData.title;

    image.loading = index < 6 ? "eager" : "lazy";

    image.decoding = "async";


    image.addEventListener("load", function() {

        article.classList.add("loaded");

    });


    const overlay = document.createElement("div");

    overlay.className = "gallery-overlay";


    const title = document.createElement("span");

    title.className = "gallery-title";

    title.textContent = imageData.title;


    overlay.appendChild(title);

    article.appendChild(image);

    article.appendChild(overlay);


    /*

       BOTH COLLAGE AND TILE MODE:

       Clicking any photo opens the lightbox.

    */

    article.addEventListener("click", function() {

        openLightbox(index);

    });


    return article;

}


/* =========================================================
   UPDATE COLLAGE ORDER
   ========================================================= */

function updateCollageOrder() {

    const items =
        galleryGrid.querySelectorAll(".gallery-item");


    items.forEach(function(item, index) {

        item.classList.toggle(
            "front-photo",
            index === frontPhotoIndex
        );


        item.classList.toggle(
            "sent-back",
            sentBackPhotos.includes(index)
        );

    });


    if (sentBackPhotos.length > 0) {

        restoreButton.classList.add("visible");

    } else {

        restoreButton.classList.remove("visible");

    }

}


/* =========================================================
   PHOTO CLICK — COLLAGE MODE
   ========================================================= */

/*

   Kept in the file because the collage state system
   still exists and may be used by the gallery layout.

*/

function handlePhotoClick(index) {

    if (index === frontPhotoIndex) {

        sendPhotoBack(index);

        return;

    }


    frontPhotoIndex = index;


    sentBackPhotos =
        sentBackPhotos.filter(function(item) {

            return item !== index;

        });


    updateCollageOrder();

}


/* =========================================================
   SEND FRONT PHOTO BACK
   ========================================================= */

function sendPhotoBack(index) {

    if (!sentBackPhotos.includes(index)) {

        sentBackPhotos.push(index);

    }


    let nextIndex = null;


    for (
        let i = 0;
        i < galleryImages.length;
        i++
    ) {

        if (!sentBackPhotos.includes(i)) {

            nextIndex = i;

            break;

        }

    }


    if (nextIndex === null) {

        sentBackPhotos = [];

        nextIndex =
            (index + 1) % galleryImages.length;

    }


    frontPhotoIndex = nextIndex;


    updateCollageOrder();

}


/* =========================================================
   RESTORE PREVIOUS PHOTO
   ========================================================= */

function restorePreviousPhoto() {

    if (sentBackPhotos.length === 0) {

        return;

    }


    const previousIndex =
        sentBackPhotos.pop();


    frontPhotoIndex =
        previousIndex;


    updateCollageOrder();

}


restoreButton.addEventListener(
    "click",
    function(e) {

        e.stopPropagation();

        restorePreviousPhoto();

    }
);


/* =========================================================
   SWITCH BETWEEN COLLAGE / TILE VIEW
   ========================================================= */

function toggleGalleryLayout() {

    const tileView =
        galleryGrid.classList.toggle("tile-view");


    if (tileView) {

        /* =========================================
           TILE VIEW
        ========================================= */

        layoutButton.innerHTML =
            '<i class="fas fa-images"></i>';


        layoutButton.setAttribute(
            "aria-label",
            "Switch to collage view"
        );


        layoutButton.setAttribute(
            "title",
            "Switch to collage view"
        );


        restoreButton.classList.remove(
            "visible"
        );


    } else {

        /* =========================================
           COLLAGE VIEW
        ========================================= */

        layoutButton.innerHTML =
            '<i class="fas fa-table-cells-large"></i>';


        layoutButton.setAttribute(
            "aria-label",
            "Switch to square tile view"
        );


        layoutButton.setAttribute(
            "title",
            "Switch to square tile view"
        );


        updateCollageOrder();

    }

}


layoutButton.addEventListener(
    "click",
    function(e) {

        e.stopPropagation();

        toggleGalleryLayout();

    }
);


/* =========================================================
   LOAD GALLERY
   ========================================================= */

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
                "Unable to load gallery list."
            );

        }


        const files =
            await response.json();


        if (
            !Array.isArray(files) ||
            files.length === 0
        ) {

            galleryStatus.textContent =
                "No gallery images found.";

            return;

        }


        galleryImages =
            files.map(function(filename) {

                return {

                    filename: filename,

                    title:
                        createReadableTitle(filename),

                    url:
                        GALLERY_FOLDER +
                        encodeURIComponent(filename)

                };

            });


        galleryGrid.innerHTML = "";


        galleryImages.forEach(
            function(imageData, index) {

                const item =
                    createGalleryItem(
                        imageData,
                        index
                    );


                galleryGrid.appendChild(item);


                requestAnimationFrame(
                    function() {

                        item.classList.add(
                            "visible"
                        );

                    }
                );

            }
        );


        galleryStatus.classList.add(
            "hidden"
        );


        updateCollageOrder();


    } catch (error) {

        console.error(error);

        galleryStatus.textContent =
            "Unable to load the gallery right now.";

    }

}


/* =========================================================
   LIGHTBOX
   ========================================================= */

function openLightbox(index) {

    if (!galleryImages.length) {

        return;

    }


    currentImageIndex = index;


    updateLightboxImage();


    lightbox.classList.add("active");


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "no-scroll"
    );

}


function closeLightbox() {

    lightbox.classList.remove(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "no-scroll"
    );

}


function updateLightboxImage() {

    const imageData =
        galleryImages[currentImageIndex];


    lightboxImage.src =
        imageData.url;


    lightboxImage.alt =
        imageData.title;


    lightboxTitle.textContent =
        imageData.title;


    lightboxCounter.textContent =
        `${currentImageIndex + 1} / ${galleryImages.length}`;

}


/* =========================================================
   LIGHTBOX PREVIOUS
   ========================================================= */

function showPreviousImage() {

    if (!galleryImages.length) {

        return;

    }


    currentImageIndex =
        (
            currentImageIndex -
            1 +
            galleryImages.length
        ) %
        galleryImages.length;


    updateLightboxImage();

}


/* =========================================================
   LIGHTBOX NEXT
   ========================================================= */

function showNextImage() {

    if (!galleryImages.length) {

        return;

    }


    currentImageIndex =
        (
            currentImageIndex +
            1
        ) %
        galleryImages.length;


    updateLightboxImage();

}


/* =========================================================
   LIGHTBOX BUTTONS
   ========================================================= */

lightboxClose.addEventListener(
    "click",
    closeLightbox
);


lightboxPrev.addEventListener(
    "click",
    showPreviousImage
);


lightboxNext.addEventListener(
    "click",
    showNextImage
);


/* =========================================================
   CLICK OUTSIDE LIGHTBOX
   ========================================================= */

lightbox.addEventListener(
    "click",
    function(e) {

        if (e.target === lightbox) {

            closeLightbox();

        }

    }
);


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

document.addEventListener(
    "keydown",
    function(e) {

        if (
            !lightbox.classList.contains(
                "active"
            )
        ) {

            return;

        }


        if (e.key === "Escape") {

            closeLightbox();

        }


        if (e.key === "ArrowLeft") {

            showPreviousImage();

        }


        if (e.key === "ArrowRight") {

            showNextImage();

        }

    }
);


/* =========================================================
   MOBILE SWIPE
   ========================================================= */

let touchStartX = 0;

let touchEndX = 0;


lightbox.addEventListener(
    "touchstart",
    function(e) {

        touchStartX =
            e.changedTouches[0].screenX;

    }
);


lightbox.addEventListener(
    "touchend",
    function(e) {

        touchEndX =
            e.changedTouches[0].screenX;


        const difference =
            touchEndX - touchStartX;


        if (
            Math.abs(difference) < 50
        ) {

            return;

        }


        if (difference < 0) {

            showNextImage();

        } else {

            showPreviousImage();

        }

    }
);


/* =========================================================
   START GALLERY
   ========================================================= */

loadGallery();