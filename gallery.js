const GALLERY_FOLDER = "gallery/";
const GALLERY_SOURCES = [
    {
        type: "directory",
        url: GALLERY_FOLDER
    },
    {
        type: "json",
        url: "gallery-list.php"
    },
    {
        type: "json",
        url: "gallery-images.json"
    }
];

const galleryGrid = document.getElementById("gallery-grid");
const galleryStatus = document.getElementById("gallery-status");
const layoutToggle = document.getElementById("layout-toggle");

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

let galleryImages = [];
let currentImageIndex = 0;
let revealTimer = null;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let lastFocusedTrigger = null;

const COLLAGE_PATTERN = [
    { top: 20, left: "2%", rotation: -6 },
    { top: 84, left: "28%", rotation: 4 },
    { top: 14, right: "5%", rotation: -3 },
    { top: 320, left: "12%", rotation: 6 },
    { top: 400, left: "40%", rotation: -5 },
    { top: 320, right: "8%", rotation: 5 },
    { top: 680, left: "4%", rotation: -4 },
    { top: 720, left: "34%", rotation: 3 },
    { top: 650, right: "6%", rotation: -2 }
];

const COLLAGE_ROW_OFFSET = 1080;
const COLLAGE_BASE_HEIGHT = 1120;

if (menuBtn && menu) {
    menuBtn.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        menu.classList.toggle("show");
    });
}

document.addEventListener("click", function(event) {
    if (!menu || !menuBtn) {
        return;
    }

    if (
        menu.classList.contains("show") &&
        !menu.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {
        menu.classList.remove("show");
    }
});

window.addEventListener("scroll", function() {
    if (!header) {
        return;
    }

    header.classList.toggle("scrolled", window.scrollY > 20);
});

function createReadableTitle(filename) {
    return filename
        .replace(/\.[^.]+$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, function(character) {
            return character.toUpperCase();
        });
}

function normaliseFiles(files) {
    return files
        .filter(function(file) {
            return typeof file === "string";
        })
        .map(function(file) {
            return file.trim();
        })
        .filter(function(file) {
            return /\.(jpg|jpeg|png|webp)$/i.test(file);
        })
        .filter(Boolean);
}

function safelyDecodePath(path) {
    try {
        return path
            .split("/")
            .map(function(segment) {
                return decodeURIComponent(segment);
            })
            .join("/");
    } catch (error) {
        return null;
    }
}

async function loadJsonList(url) {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`Unable to load ${url}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(`Invalid gallery data from ${url}`);
    }

    return normaliseFiles(data);
}

async function loadDirectoryList(url) {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`Unable to load directory listing from ${url}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
        throw new Error("Directory listing is not available.");
    }

    const html = await response.text();
    const parser = new DOMParser();
    const documentNode = parser.parseFromString(html, "text/html");
    const links = Array.from(documentNode.querySelectorAll("a"));
    const listingUrl = new URL(url, window.location.href);
    const listingPath = listingUrl.pathname.endsWith("/")
        ? listingUrl.pathname
        : `${listingUrl.pathname}/`;

    const files = links
        .map(function(link) {
            return link.getAttribute("href") || "";
        })
        .map(function(href) {
            if (!href || href.startsWith("#")) {
                return null;
            }

            let resolvedUrl;

            try {
                resolvedUrl = new URL(href, listingUrl);
            } catch (error) {
                return null;
            }

            if (resolvedUrl.origin !== listingUrl.origin) {
                return null;
            }

            if (
                !resolvedUrl.pathname.startsWith(
                    listingPath
                )
            ) {
                return null;
            }

            const relativePath =
                resolvedUrl.pathname.slice(
                    listingPath.length
                );

            if (
                !relativePath ||
                relativePath.endsWith("/")
            ) {
                return null;
            }

            return safelyDecodePath(relativePath);
        });

    return normaliseFiles(files);
}

async function loadGalleryFiles() {
    for (const source of GALLERY_SOURCES) {
        try {
            if (source.type === "json") {
                const files = await loadJsonList(source.url);

                if (files.length) {
                    return files;
                }
            }

            if (source.type === "directory") {
                const files = await loadDirectoryList(source.url);

                if (files.length) {
                    return files;
                }
            }
        } catch (error) {
            console.warn(`Gallery source failed: ${source.url}`, error);
        }
    }

    return [];
}

function buildImageData(files) {
    return files.map(function(filename) {
        return {
            filename,
            title: createReadableTitle(filename),
            caption: createReadableTitle(filename),
            url: `${GALLERY_FOLDER}${filename
                .split("/")
                .map(function(segment) {
                    return encodeURIComponent(segment);
                })
                .join("/")}`
        };
    });
}

function applyCollagePosition(item, index) {
    const pattern =
        COLLAGE_PATTERN[
            index % COLLAGE_PATTERN.length
        ];

    const row =
        Math.floor(
            index / COLLAGE_PATTERN.length
        );

    item.style.top =
        `${pattern.top + (row * COLLAGE_ROW_OFFSET)}px`;

    item.style.left = pattern.left || "auto";
    item.style.right = pattern.right || "auto";

    item.style.setProperty(
        "--rotation",
        `${pattern.rotation}deg`
    );
}

function createGalleryItem(imageData, index) {
    const article = document.createElement("article");
    article.className = "gallery-item";
    article.dataset.index = index;
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute(
        "aria-label",
        `Open ${imageData.caption}`
    );

    applyCollagePosition(article, index);

    const photo = document.createElement("div");
    photo.className = "gallery-photo";

    const image = document.createElement("img");
    image.alt = imageData.title;
    image.loading = index < 6 ? "eager" : "lazy";
    image.decoding = "async";

    function markLoaded() {
        article.classList.add("loaded");
    }

    image.addEventListener("load", markLoaded);
    image.src = imageData.url;

    if (image.complete && image.naturalWidth > 0) {
        markLoaded();
    }

    const caption = document.createElement("p");
    caption.className = "gallery-caption";
    caption.textContent = imageData.caption;

    photo.appendChild(image);
    article.appendChild(photo);
    article.appendChild(caption);

    article.addEventListener("click", function() {
        openLightbox(index, article);
    });

    article.addEventListener("keydown", function(event) {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            openLightbox(index, article);
        }
    });

    return article;
}

function revealGalleryItems() {
    const items = Array.from(galleryGrid.querySelectorAll(".gallery-item"));
    let visibleCount = 0;

    clearInterval(revealTimer);

    revealTimer = window.setInterval(function() {
        const item = items[visibleCount];

        if (!item) {
            clearInterval(revealTimer);
            revealTimer = null;
            return;
        }

        item.classList.add("visible");
        visibleCount += 1;
    }, 140);
}

function renderGallery() {
    galleryGrid.innerHTML = "";

    galleryImages.forEach(function(imageData, index) {
        galleryGrid.appendChild(createGalleryItem(imageData, index));
    });

    updateGalleryHeight();
    revealGalleryItems();
}

function updateGalleryHeight() {
    if (!galleryGrid) {
        return;
    }

    if (
        galleryGrid.classList.contains("aligned") ||
        window.innerWidth <= 900
    ) {
        galleryGrid.style.minHeight = "0";
        return;
    }

    const rows =
        Math.max(
            1,
            Math.ceil(
                galleryImages.length /
                COLLAGE_PATTERN.length
            )
        );

    galleryGrid.style.minHeight =
        `${COLLAGE_BASE_HEIGHT + ((rows - 1) * COLLAGE_ROW_OFFSET)}px`;
}

function updateLayoutButton() {
    const aligned = galleryGrid.classList.contains("aligned");
    layoutToggle.setAttribute("aria-pressed", String(aligned));
    layoutToggle.innerHTML = aligned
        ? '<i class="fas fa-layer-group"></i><span>Back to collage</span>'
        : '<i class="fas fa-grip"></i><span>Align photos</span>';
}

function updateLightboxImage() {
    const imageData = galleryImages[currentImageIndex];

    if (!imageData) {
        return;
    }

    lightboxImage.src = imageData.url;
    lightboxImage.alt = imageData.title;
    lightboxTitle.textContent = imageData.caption;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

function openLightbox(index, triggerElement) {
    if (!galleryImages.length || !lightbox) {
        return;
    }

    currentImageIndex = index;
    lastFocusedTrigger = triggerElement || null;
    updateLightboxImage();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    if (lightboxClose) {
        lightboxClose.focus();
    }
}

function closeLightbox() {
    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    if (lastFocusedTrigger) {
        lastFocusedTrigger.focus();
        lastFocusedTrigger = null;
    }
}

function showPreviousImage() {
    if (!galleryImages.length) {
        return;
    }

    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

function showNextImage() {
    if (!galleryImages.length) {
        return;
    }

    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

async function loadGallery() {
    if (!galleryGrid || !galleryStatus) {
        return;
    }

    clearInterval(revealTimer);
    revealTimer = null;
    galleryGrid.innerHTML = "";

    try {
        const files = await loadGalleryFiles();
        galleryImages = buildImageData(files);

        if (!galleryImages.length) {
            galleryStatus.textContent = "No gallery images found.";
            return;
        }

        renderGallery();
        galleryStatus.classList.add("hidden");
    } catch (error) {
        console.error(error);
        galleryStatus.textContent = "Unable to load the gallery right now.";
    }
}

if (layoutToggle && galleryGrid) {
    updateLayoutButton();

    layoutToggle.addEventListener("click", function() {
        galleryGrid.classList.toggle("aligned");
        updateLayoutButton();
        updateGalleryHeight();
    });
}

window.addEventListener("resize", updateGalleryHeight);

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPreviousImage);
}

if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextImage);
}

if (lightbox) {
    lightbox.addEventListener("click", function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

if (lightboxImage) {
    lightboxImage.addEventListener("touchstart", function(event) {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    lightboxImage.addEventListener("touchend", function(event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;

        const horizontalDifference =
            touchEndX - touchStartX;

        const verticalDifference =
            touchEndY - touchStartY;

        if (
            Math.abs(horizontalDifference) < 50 ||
            Math.abs(horizontalDifference) <=
            Math.abs(verticalDifference)
        ) {
            return;
        }

        if (horizontalDifference < 0) {
            showNextImage();
            return;
        }

        showPreviousImage();
    }, { passive: true });
}

document.addEventListener("keydown", function(event) {
    if (!lightbox || !lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }
});

loadGallery();
