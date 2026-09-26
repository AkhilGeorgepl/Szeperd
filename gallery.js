const galleryGrid = document.getElementById("gallery-grid");
const galleryStatus = document.getElementById("gallery-status");

const menuButton = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCounter = document.getElementById("lightbox-counter");

const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

/* Gallery layout controls */
const layoutButton = document.getElementById("gallery-layout-button");
const seeAllLabel = document.getElementById("gallery-see-all");
const restoreButton = document.getElementById("gallery-restore-button");

const images = [];
let currentIndex = 0;


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuButton && menu) {
  menuButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = menu.classList.toggle("show");

    menuButton.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );
  });

  document.addEventListener("click", (event) => {
    if (
      menu.classList.contains("show") &&
      !menu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      menu.classList.remove("show");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

window.addEventListener("scroll", () => {
  const header = document.getElementById("site-header");

  if (header) {
    header.classList.toggle(
      "scrolled",
      window.scrollY > 20
    );
  }
});


/* =========================================================
   IMAGE PATH
========================================================= */

function getImagePath(filename) {
  return `gallery/${encodeURIComponent(filename)}`;
}


/* =========================================================
   IMAGE TITLE
========================================================= */

function titleFor(filename) {
  return filename
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}


/* =========================================================
   RENDER GALLERY
========================================================= */

function renderGallery() {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  images.forEach((image, index) => {
    const item = document.createElement("article");

    item.className = "gallery-item visible";

    const title = titleFor(image);

    const imageElement = document.createElement("img");

    imageElement.src = getImagePath(image);
    imageElement.alt = title;

    imageElement.loading =
      index < 6 ? "eager" : "lazy";

    imageElement.addEventListener("load", () => {
      item.classList.add("loaded");
    });

    imageElement.addEventListener("error", () => {
      console.error(
        "Unable to load gallery image:",
        image
      );

      item.classList.add("image-error");
    });

    const overlay = document.createElement("div");

    overlay.className = "gallery-overlay";

    const titleElement = document.createElement("span");

    titleElement.className = "gallery-title";
    titleElement.textContent = title;

    overlay.appendChild(titleElement);

    item.appendChild(imageElement);
    item.appendChild(overlay);

    item.addEventListener("click", () => {
      openLightbox(index);
    });

    galleryGrid.appendChild(item);
  });

  if (galleryStatus) {
    galleryStatus.classList.add("hidden");
  }
}


/* =========================================================
   GALLERY LAYOUT TOGGLE
========================================================= */

function updateLayoutButton() {
  if (!layoutButton || !galleryGrid) return;

  const isAligned =
    galleryGrid.classList.contains("tile-view");

  if (isAligned) {

    /* Button remains visible */

    layoutButton.style.opacity = "1";
    layoutButton.style.pointerEvents = "auto";

    layoutButton.setAttribute(
      "aria-label",
      "Restore collage"
    );

    layoutButton.setAttribute(
      "title",
      "Restore collage"
    );

    layoutButton.innerHTML =
      '<i class="fas fa-layer-group"></i>';

    /* Change the message */

    if (seeAllLabel) {
      seeAllLabel.textContent = "Restore collage";
      seeAllLabel.setAttribute(
        "aria-hidden",
        "false"
      );
    }

    /* Show restore button */

    if (restoreButton) {
      restoreButton.classList.add("visible");
      restoreButton.style.opacity = "1";
      restoreButton.style.pointerEvents = "auto";
    }

  } else {

    /* Button remains visible */

    layoutButton.style.opacity = "1";
    layoutButton.style.pointerEvents = "auto";

    layoutButton.setAttribute(
      "aria-label",
      "Align pictures"
    );

    layoutButton.setAttribute(
      "title",
      "Align pictures"
    );

    layoutButton.innerHTML =
      '<i class="fas fa-grip"></i>';

    /* Change the message */

    if (seeAllLabel) {
      seeAllLabel.textContent = "Align pictures";
      seeAllLabel.setAttribute(
        "aria-hidden",
        "false"
      );
    }

    /* Hide restore button */

    if (restoreButton) {
      restoreButton.classList.remove("visible");
      restoreButton.style.opacity = "0";
      restoreButton.style.pointerEvents = "none";
    }
  }
}


/* =========================================================
   TOGGLE BETWEEN COLLAGE AND ALIGNED GRID
========================================================= */

function toggleGalleryLayout() {
  if (!galleryGrid) return;

  galleryGrid.classList.toggle("tile-view");

  updateLayoutButton();
}


/* =========================================================
   RESTORE COLLAGE
========================================================= */

function restoreCollage() {
  if (!galleryGrid) return;

  galleryGrid.classList.remove("tile-view");

  updateLayoutButton();
}


/* =========================================================
   LAYOUT BUTTON
========================================================= */

if (layoutButton) {
  layoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleGalleryLayout();
  });
}


/* =========================================================
   RESTORE BUTTON
========================================================= */

if (restoreButton) {
  restoreButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    restoreCollage();
  });
}


/* =========================================================
   INITIAL LAYOUT
========================================================= */

updateLayoutButton();


/* =========================================================
   LIGHTBOX
========================================================= */

function openLightbox(index) {
  if (!images.length || !lightbox) return;

  currentIndex = index;

  updateLightbox();

  lightbox.classList.add("active");

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("no-scroll");
}


function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("active");

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("no-scroll");
}


function updateLightbox() {
  if (!images.length || !lightboxImage) return;

  const image = images[currentIndex];

  const title = titleFor(image);

  lightboxImage.src = getImagePath(image);

  lightboxImage.alt = title;

  if (lightboxTitle) {
    lightboxTitle.textContent = title;
  }

  if (lightboxCounter) {
    lightboxCounter.textContent =
      `${currentIndex + 1} / ${images.length}`;
  }
}


function moveLightbox(step) {
  if (!images.length) return;

  currentIndex =
    (currentIndex + step + images.length) %
    images.length;

  updateLightbox();
}


/* =========================================================
   LIGHTBOX BUTTONS
========================================================= */

if (lightboxClose) {
  lightboxClose.addEventListener(
    "click",
    closeLightbox
  );
}

if (lightboxPrev) {
  lightboxPrev.addEventListener(
    "click",
    () => moveLightbox(-1)
  );
}

if (lightboxNext) {
  lightboxNext.addEventListener(
    "click",
    () => moveLightbox(1)
  );
}


/* =========================================================
   CLOSE LIGHTBOX BY CLICKING OUTSIDE
========================================================= */

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", (event) => {
  if (
    !lightbox ||
    !lightbox.classList.contains("active")
  ) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    moveLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    moveLightbox(1);
  }
});


/* =========================================================
   LOAD IMAGES FROM YOUR EXISTING PHP
========================================================= */

/*
   IMPORTANT:
   Keep your existing PHP exactly as it is.

   This assumes the PHP file is named:
   gallery.php
*/

fetch("gallery.php", {
  cache: "no-store"
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        "Unable to load gallery.php"
      );
    }

    return response.json();
  })

  .then((fileNames) => {

    if (
      !Array.isArray(fileNames) ||
      !fileNames.length
    ) {
      throw new Error(
        "No gallery images found"
      );
    }

    /*
      PHP returns filenames such as:

      01.jpg
      02.jpg
      03.jpg

      We use them directly.
    */

    images.push(...fileNames);

    renderGallery();

    updateLayoutButton();
  })

  .catch((error) => {
    console.error(
      "Gallery error:",
      error
    );

    if (galleryStatus) {
      galleryStatus.textContent =
        "Unable to load the gallery right now.";

      galleryStatus.classList.remove(
        "hidden"
      );
    }
  });
