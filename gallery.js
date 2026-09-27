<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Explore beautiful moments captured during Szepred journeys and experiences.">
    <title>Gallery | Szepred</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Lora:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="gallery.css">
</head>
<body>
    <header id="site-header">
        <div class="logo">
            <a href="index.html">
                <img src="logo.png" alt="Szepred Logo">
            </a>
        </div>

        <nav id="menu">
            <a href="index.html">HOME</a>
            <a href="experiences.html">EXPERIENCES</a>
            <a href="packages.html">PACKAGES</a>
            <a href="gallery.html" class="active">GALLERY</a>
            <a href="about.html">ABOUT US</a>
            <a href="contact.html">CONTACT</a>
        </nav>

        <div class="header-icons">
            <button type="button" id="menu-btn" aria-label="Open navigation menu">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </header>

    <main>
        <section class="gallery-hero">
            <p class="gallery-eyebrow">SZEPRED JOURNEYS</p>
            <h1>Memories in Motion</h1>
            <p class="gallery-description">
                A hand-laid collage of travel memories. Tap any polaroid for a full view,
                switch to an aligned layout anytime, and browse smoothly on mobile with swipe navigation.
            </p>
        </section>

        <section class="gallery-shell" aria-label="Szepred gallery experience">
            <div class="gallery-toolbar">
                <div>
                    <h2>Travel Polaroids</h2>
                    <p>The latest photos appear one by one while the gallery settles into place.</p>
                </div>

                <button type="button" id="layout-toggle" class="layout-toggle" aria-pressed="false">
                    <i class="fas fa-grip"></i>
                    <span>Align photos</span>
                </button>
            </div>

            <div id="gallery-status" class="gallery-status" aria-live="polite">Loading gallery...</div>

            <div id="gallery-grid" class="gallery-grid"></div>
        </section>
    </main>

    <div id="lightbox" class="lightbox" aria-hidden="true" role="dialog" aria-modal="true">
        <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Close image viewer">
            <i class="fas fa-xmark"></i>
        </button>

        <button type="button" class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Previous image">
            <i class="fas fa-chevron-left"></i>
        </button>

        <div class="lightbox-panel">
            <img id="lightbox-image" class="lightbox-image" src="" alt="Gallery image">
            <div class="lightbox-meta">
                <p id="lightbox-title" class="lightbox-title"></p>
                <p id="lightbox-counter" class="lightbox-counter">1 / 1</p>
            </div>
        </div>

        <button type="button" class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Next image">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>

    <footer class="footer">
        <div class="footer-bottom">© 2026 Szepred. All Rights Reserved.</div>
    </footer>

    <a href="https://wa.me/" class="whatsapp-float" aria-label="Contact Szepred on WhatsApp" target="_blank" rel="noopener">
        <i class="fab fa-whatsapp"></i>
    </a>

    <script src="gallery.js"></script>
</body>
</html>
