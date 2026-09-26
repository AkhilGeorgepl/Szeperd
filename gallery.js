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
   Important for GitHub Pages
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

    /*
      Add loaded class when image is ready.
      Your CSS already supports .gallery-item.loaded
    */
    imageElement.addEventListener("load", () => {
      item.classList.add("loaded");
    });

    /*
      Prevent broken images from looking completely empty.
    */
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
   ALIGN PICTURES
========================================================= */

function alignPictures() {
  if (!galleryGrid) return;

  galleryGrid.classList.add("tile-view");

  /*
    Hide the alignment button after switching
    to the clean grid layout.
  */
  if (layoutButton) {
    layoutButton.style.opacity = "0";
    layoutButton.style.pointerEvents = "none";
  }

  /*
    Hide the "Align pictures" label.
  */
  if (seeAllLabel) {
    seeAllLabel.style.opacity = "0";
    seeAllLabel.style.pointerEvents = "none";
    seeAllLabel.setAttribute("aria-hidden", "true");
  }

  /*
    Show restore button.
  */
  if (restoreButton) {
    restoreButton.classList.add("visible");
    restoreButton.style.opacity = "1";
    restoreButton.style.pointerEvents = "auto";
  }
}


/* =========================================================
   RESTORE COLLAGE
========================================================= */

function restoreCollage() {
  if (!galleryGrid) return;

  galleryGrid.classList.remove("tile-view");

  /*
    Show alignment button again.
  */
  if (layoutButton) {
    layoutButton.style.opacity = "1";
    layoutButton.style.pointerEvents = "auto";
  }

  /*
    Show alignment label again.
  */
  if (seeAllLabel) {
    seeAllLabel.style.opacity = "1";
    seeAllLabel.style.pointerEvents = "none";
    seeAllLabel.setAttribute("aria-hidden", "false");
  }

  /*
    Hide restore button.
  */
  if (restoreButton) {
    restoreButton.classList.remove("visible");
    restoreButton.style.opacity = "0";
    restoreButton.style.pointerEvents = "none";
  }
}


/* =========================================================
   ALIGNMENT BUTTON EVENTS
========================================================= */

if (layoutButton) {
  layoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    alignPictures();
  });
}

if (restoreButton) {
  restoreButton.addEventListener("click", (event) => {
    event.preventDefault();
    restoreCollage();
  });
}


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
   CLOSE LIGHTBOX BY CLICKING OUTSIDE IMAGE
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
  if (!lightbox || !lightbox.classList.contains("active")) {
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
   LOAD GALLERY IMAGES
========================================================= */

fetch("gallery-images.json", {
  cache: "no-store"
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        "Unable to load gallery-images.json"
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

    images.push(...fileNames);

    renderGallery();
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
