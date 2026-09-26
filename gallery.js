const galleryGrid = document.getElementById("gallery-grid");
const galleryStatus = document.getElementById("gallery-status");
const menuButton = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCounter = document.getElementById("lightbox-counter");
const images = [];
let currentIndex = 0;

if (menuButton && menu) {
  menuButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    menu.classList.toggle("show");
  });
  document.addEventListener("click", (event) => {
    if (menu.classList.contains("show") && !menu.contains(event.target) && !menuButton.contains(event.target)) {
      menu.classList.remove("show");
    }
  });
}

window.addEventListener("scroll", () => {
  const header = document.getElementById("site-header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 20);
});

function titleFor(filename) {
  return filename.replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderGallery() {
  galleryGrid.innerHTML = "";
  images.forEach((image, index) => {
    const item = document.createElement("article");
    item.className = "gallery-item visible";
    const title = titleFor(image);
    item.innerHTML = `<img src="gallery/${encodeURIComponent(image)}" alt="${title}" loading="${index < 6 ? "eager" : "lazy"}" /><div class="gallery-overlay"><span class="gallery-title">${title}</span></div>`;
    item.addEventListener("click", () => openLightbox(index));
    galleryGrid.appendChild(item);
  });
  galleryStatus.classList.add("hidden");
}

function openLightbox(index) {
  if (!images.length) return;
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function updateLightbox() {
  const image = images[currentIndex];
  const title = titleFor(image);
  lightboxImage.src = `gallery/${encodeURIComponent(image)}`;
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;
  lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function moveLightbox(step) {
  if (!images.length) return;
  currentIndex = (currentIndex + step + images.length) % images.length;
  updateLightbox();
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev").addEventListener("click", () => moveLightbox(-1));
document.getElementById("lightbox-next").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("active")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

fetch("gallery-images.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Unable to load gallery-images.json");
    return response.json();
  })
  .then((fileNames) => {
    if (!Array.isArray(fileNames) || !fileNames.length) throw new Error("No gallery images found");
    images.push(...fileNames);
    renderGallery();
  })
  .catch((error) => {
    console.error(error);
    galleryStatus.textContent = "Unable to load the gallery right now.";
  });
