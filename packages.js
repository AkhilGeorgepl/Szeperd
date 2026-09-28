/* =========================================================
   Szeperd — PACKAGES PAGE JAVASCRIPT
   ========================================================= */

(() => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const packagesGrid =
        document.getElementById("packages-grid");

    const emptyState =
        document.getElementById("packages-empty");

    const categoryFilter =
        document.getElementById("category-filter");

    const durationFilter =
        document.getElementById("duration-filter");

    const resetFilters =
        document.getElementById("reset-filters");

    const packageDetail =
        document.getElementById("package-detail");

    const closePackageDetail =
        document.getElementById("close-package-detail");

    const menuButton =
        document.getElementById("menu-btn");

    const menu =
        document.getElementById("menu");

    const reserveButton =
        document.getElementById("reserve-package-button");


    /* =====================================================
       STATE
    ===================================================== */

    let packages = [];

    let filteredPackages = [];

    let selectedPackage = null;


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!packagesGrid) {

        console.error(
            "Szeperd Packages: #packages-grid was not found."
        );

        return;

    }


    /* =====================================================
       HELPERS
    ===================================================== */

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function normalize(value) {

        return String(value || "")
            .trim()
            .toLowerCase();

    }


    function getArray(value) {

        if (Array.isArray(value)) {

            return value;

        }

        return [];

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function closeMobileMenu() {

        if (!menu || !menuButton) {

            return;

        }

        menu.classList.remove("show");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    if (menuButton && menu) {

        menuButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const isOpen =
                    menu.classList.toggle("show");

                menuButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !menu.contains(event.target) &&
                    !menuButton.contains(event.target)
                ) {

                    closeMobileMenu();

                }

            }
        );


        menu.querySelectorAll("a").forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );

            }
        );

    }


    /* =====================================================
       SCROLL TO TOP BUTTON
    ===================================================== */

    const scrollTopButton =
        document.createElement("button");

    scrollTopButton.type =
        "button";

    scrollTopButton.className =
        "scroll-top-button";

    scrollTopButton.setAttribute(
        "aria-label",
        "Scroll to top"
    );

    scrollTopButton.setAttribute(
        "title",
        "Scroll to top"
    );

    scrollTopButton.innerHTML =
        '<i class="fas fa-arrow-up" aria-hidden="true"></i>';

    document.body.appendChild(
        scrollTopButton
    );


    function updateScrollTopButton() {

        if (
            window.scrollY > 400
        ) {

            scrollTopButton.classList.add(
                "show"
            );

        } else {

            scrollTopButton.classList.remove(
                "show"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateScrollTopButton,
        {
            passive: true
        }
    );


    scrollTopButton.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    updateScrollTopButton();


    /* =====================================================
       LOAD PACKAGES
    ===================================================== */

    loadPackages();


    async function loadPackages() {

        showLoading();


        try {

            const response =
                await fetch(
                    "packages.json",
                    {
                        cache: "no-cache"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Unable to load packages.json (${response.status})`
                );

            }


            const data =
                await response.json();


            if (!Array.isArray(data)) {

                throw new Error(
                    "packages.json must contain an array."
                );

            }


            packages =
                data.filter(
                    packageItem =>
                        packageItem &&
                        packageItem.id &&
                        packageItem.title
                );


            if (!packages.length) {

                throw new Error(
                    "No valid packages were found in packages.json."
                );

            }


            populateFilters();

            filteredPackages =
                [...packages];

            renderPackages(
                filteredPackages
            );

            handleUrlPackage();


        } catch (error) {

            console.error(
                "Szeperd Packages Error:",
                error
            );

            showLoadError(error);

        }

    }


    /* =====================================================
       LOADING
    ===================================================== */

    function showLoading() {

        packagesGrid.innerHTML = `

            <div class="packages-loading">

                <p>
                    Loading tour packages...
                </p>

            </div>

        `;

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showLoadError(error) {

        packagesGrid.innerHTML = `

            <div class="packages-load-error">

                <h3>
                    Packages could not be loaded
                </h3>

                <p>
                    Please check that
                    <strong>packages.json</strong>
                    is in the same folder as
                    packages.html.
                </p>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>

        `;

        if (emptyState) {

            emptyState.hidden = true;

        }

    }


    /* =====================================================
       FILTERS
    ===================================================== */

    function populateFilters() {

        if (categoryFilter) {

            const categories = [
                ...new Set(
                    packages
                        .map(
                            item => item.category
                        )
                        .filter(Boolean)
                )
            ].sort();


            categoryFilter.innerHTML = `

                <option value="all">
                    All destinations
                </option>

            `;


            categories.forEach(
                category => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        category;

                    option.textContent =
                        category;

                    categoryFilter.appendChild(
                        option
                    );

                }
            );

        }


        if (durationFilter) {

            const durations = [
                ...new Set(
                    packages
                        .map(
                            item => item.duration
                        )
                        .filter(Boolean)
                )
            ];


            durations.sort(
                (a, b) => {

                    const daysA =
                        parseInt(a, 10) || 0;

                    const daysB =
                        parseInt(b, 10) || 0;

                    return daysA - daysB;

                }
            );


            durationFilter.innerHTML = `

                <option value="all">
                    All durations
                </option>

            `;


            durations.forEach(
                duration => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        duration;

                    option.textContent =
                        duration;

                    durationFilter.appendChild(
                        option
                    );

                }
            );

        }

    }


    /* =====================================================
       FILTER EVENTS
    ===================================================== */

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (durationFilter) {

        durationFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (resetFilters) {

        resetFilters.addEventListener(
            "click",
            () => {

                if (categoryFilter) {

                    categoryFilter.value =
                        "all";

                }


                if (durationFilter) {

                    durationFilter.value =
                        "all";

                }


                applyFilters();

            }
        );

    }


    function applyFilters() {

        const selectedCategory =
            categoryFilter
                ? normalize(
                    categoryFilter.value
                )
                : "all";


        const selectedDuration =
            durationFilter
                ? normalize(
                    durationFilter.value
                )
                : "all";


        filteredPackages =
            packages.filter(
                packageItem => {

                    const categoryMatches =
                        selectedCategory === "all" ||
                        normalize(
                            packageItem.category
                        ) === selectedCategory;


                    const durationMatches =
                        selectedDuration === "all" ||
                        normalize(
                            packageItem.duration
                        ) === selectedDuration;


                    return (
                        categoryMatches &&
                        durationMatches
                    );

                }
            );


        renderPackages(
            filteredPackages
        );

    }


    /* =====================================================
       RENDER CARDS
    ===================================================== */

    function renderPackages(packageList) {

        packagesGrid.innerHTML = "";


        if (!packageList.length) {

            if (emptyState) {

                emptyState.hidden = false;

            }

            return;

        }


        if (emptyState) {

            emptyState.hidden = true;

        }


        packageList.forEach(
            packageItem => {

                packagesGrid.appendChild(
                    createPackageCard(
                        packageItem
                    )
                );

            }
        );

    }


    /* =====================================================
       CREATE PACKAGE CARD
    ===================================================== */

    function createPackageCard(packageItem) {

        const card =
            document.createElement("article");


        card.className =
            "package-card";


        const highlights =
            getArray(
                packageItem.highlights
            );


        const highlightsHtml =
            highlights
                .slice(0, 3)
                .map(
                    item =>
                        `<li>${escapeHtml(item)}</li>`
                )
                .join("");


        const image =
            packageItem.image ||
            "images/golden-triangle.jpg";


        const status =
            packageItem.status
                ? `

                    <span class="package-card-status">

                        ${escapeHtml(
                            packageItem.status
                        )}

                    </span>

                  `
                : "";


        card.innerHTML = `

            <div class="package-card-image">

                <img
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(
                        packageItem.title
                    )}"
                    loading="lazy"
                >

                ${status}

            </div>


            <div class="package-card-content">


                <div class="package-card-category">

                    ${escapeHtml(
                        packageItem.category || ""
                    )}

                </div>


                <h2>

                    ${escapeHtml(
                        packageItem.title
                    )}

                </h2>


                <p class="package-card-subtitle">

                    ${escapeHtml(
                        packageItem.subtitle || ""
                    )}

                </p>


                <div class="package-card-meta">


                    <div>

                        <i class="far fa-calendar"></i>

                        <span>

                            ${escapeHtml(
                                packageItem.duration || ""
                            )}

                        </span>

                    </div>


                    <div>

                        <i class="fas fa-location-dot"></i>

                        <span>

                            ${escapeHtml(
                                packageItem.destinations || ""
                            )}

                        </span>

                    </div>


                </div>


                ${
                    highlightsHtml
                        ? `

                            <ul
                                class="package-card-highlights"
                            >

                                ${highlightsHtml}

                            </ul>

                          `
                        : ""
                }


                <div class="package-card-bottom">


                    <div class="package-card-price">

                        <span
                            class="package-card-price-label"
                        >
                            From
                        </span>


                        <span
                            class="package-card-price-value"
                        >

                            ${escapeHtml(
                                packageItem.price || ""
                            )}

                        </span>


                        <span
                            class="package-card-price-note"
                        >

                            ${escapeHtml(
                                packageItem.priceNote || ""
                            )}

                        </span>

                    </div>


                    <button
                        type="button"
                        class="view-package-button"
                        data-package-id="${escapeHtml(
                            packageItem.id
                        )}"
                    >
                        View Package
                    </button>


                </div>


            </div>

        `;


        /* IMAGE ERROR */

        const imageElement =
            card.querySelector("img");


        if (imageElement) {

            imageElement.addEventListener(
                "error",
                () => {

                    imageElement.style.display =
                        "none";

                    const imageContainer =
                        imageElement.closest(
                            ".package-card-image"
                        );


                    if (imageContainer) {

                        imageContainer.style.background =
                            "linear-gradient(135deg, #173c2a, #c97820)";

                    }

                }
            );

        }


        /* OPEN DETAIL */

        const viewButton =
            card.querySelector(
                ".view-package-button"
            );


        if (viewButton) {

            viewButton.addEventListener(
                "click",
                () => {

                    openPackageDetail(
                        packageItem
                    );

                }
            );

        }


        return card;

    }


    /* =====================================================
       OPEN DETAIL
    ===================================================== */

    function openPackageDetail(packageItem) {

        if (!packageDetail) {

            return;

        }


        selectedPackage =
            packageItem;


        const detailImage =
            document.getElementById(
                "package-detail-image"
            );

        const detailCategory =
            document.getElementById(
                "package-detail-category"
            );

        const detailTitle =
            document.getElementById(
                "package-detail-title"
            );

        const detailSubtitle =
            document.getElementById(
                "package-detail-subtitle"
            );

        const detailDuration =
            document.getElementById(
                "package-detail-duration"
            );

        const detailDestinations =
            document.getElementById(
                "package-detail-destinations"
            );

        const detailPrice =
            document.getElementById(
                "package-detail-price"
            );

        const detailDescription =
            document.getElementById(
                "package-detail-description"
            );

        const detailHighlights =
            document.getElementById(
                "package-detail-highlights"
            );

        const detailDestinationsList =
            document.getElementById(
                "package-detail-destinations-list"
            );

        const detailItinerary =
            document.getElementById(
                "package-detail-itinerary"
            );

        const detailIncluded =
            document.getElementById(
                "package-detail-included"
            );

        const detailNotIncluded =
            document.getElementById(
                "package-detail-not-included"
            );


        /* IMAGE */

        if (detailImage) {

            detailImage.src =
                packageItem.image || "";

            detailImage.alt =
                packageItem.title || "";

        }


        /* TEXT */

        if (detailCategory) {

            detailCategory.textContent =
                packageItem.category || "";

        }


        if (detailTitle) {

            detailTitle.textContent =
                packageItem.title || "";

        }


        if (detailSubtitle) {

            detailSubtitle.textContent =
                packageItem.subtitle || "";

        }


        if (detailDuration) {

            detailDuration.textContent =
                packageItem.duration || "";

        }


        if (detailDestinations) {

            detailDestinations.textContent =
                packageItem.destinations || "";

        }


        if (detailPrice) {

            detailPrice.textContent =
                packageItem.price || "";

        }


        if (detailDescription) {

            detailDescription.textContent =
                packageItem.description || "";

        }


        /* HIGHLIGHTS */

        populateList(
            detailHighlights,
            packageItem.highlights
        );


        /* DESTINATIONS */

        populateDestinations(
            detailDestinationsList,
            packageItem.destinations
        );


        /* ITINERARY */

        renderItinerary(
            detailItinerary,
            packageItem.itinerary
        );


        /* INCLUDED */

        populateList(
            detailIncluded,
            packageItem.included
        );


        /* NOT INCLUDED */

        populateList(
            detailNotIncluded,
            packageItem.notIncluded
        );


        /* RESERVATION */

        if (reserveButton) {

            reserveButton.href =
                `reservation.html?package=${encodeURIComponent(
                    packageItem.id
                )}`;

        }


        /* SHOW */

        packageDetail.hidden = false;


        /*
         * IMPORTANT:
         * Do NOT disable body scrolling here.
         */

        packageDetail.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        updateUrl(
            packageItem.id
        );

    }


    /* =====================================================
       POPULATE LIST
    ===================================================== */

    function populateList(
        element,
        items
    ) {

        if (!element) {

            return;

        }


        element.innerHTML = "";


        const list =
            getArray(items);


        list.forEach(
            item => {

                const li =
                    document.createElement(
                        "li"
                    );

                li.textContent =
                    typeof item === "object"
                        ? (
                            item.title ||
                            item.name ||
                            item.description ||
                            ""
                        )
                        : item;

                element.appendChild(li);

            }
        );

    }


    /* =====================================================
       DESTINATIONS
    ===================================================== */

    function populateDestinations(
        element,
        destinations
    ) {

        if (!element) {

            return;

        }


        element.innerHTML = "";


        let items = [];


        if (Array.isArray(destinations)) {

            items =
                destinations;

        } else if (
            typeof destinations === "string"
        ) {

            items =
                destinations
                    .split(",")
                    .map(
                        item =>
                            item.trim()
                    )
                    .filter(Boolean);

        }


        items.forEach(
            destination => {

                const item =
                    document.createElement(
                        "span"
                    );


                item.className =
                    "detail-destination-item";


                item.textContent =
                    typeof destination === "object"
                        ? (
                            destination.name ||
                            destination.title ||
                            ""
                        )
                        : destination;


                element.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       ITINERARY
    ===================================================== */

    function renderItinerary(
        element,
        itinerary
    ) {

        if (!element) {

            return;

        }


        element.innerHTML = "";


        const items =
            getArray(itinerary);


        items.forEach(
            day => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "itinerary-item";


                if (
                    typeof day === "string"
                ) {

                    item.innerHTML = `

                        <p>
                            ${escapeHtml(day)}
                        </p>

                    `;

                    element.appendChild(
                        item
                    );

                    return;

                }


                const dayNumber =
                    day.day
                        ? `Day ${escapeHtml(day.day)}`
                        : "";


                const title =
                    day.title
                        ? escapeHtml(day.title)
                        : "";


                const description =
                    day.description
                        ? escapeHtml(
                            day.description
                        )
                        : "";


                item.innerHTML = `

                    <strong>

                        ${dayNumber}

                        ${
                            title
                                ? ` — ${title}`
                                : ""
                        }

                    </strong>


                    ${
                        description
                            ? `

                                <p>
                                    ${description}
                                </p>

                              `
                            : ""
                    }

                `;


                element.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       CLOSE DETAIL
    ===================================================== */

    if (closePackageDetail) {

        closePackageDetail.addEventListener(
            "click",
            closeDetail
        );

    }


    function closeDetail() {

        if (!packageDetail) {

            return;

        }


        packageDetail.hidden = true;

        selectedPackage = null;


        const url =
            new URL(
                window.location.href
            );


        url.searchParams.delete(
            "package"
        );


        window.history.replaceState(
            {},
            "",
            url.pathname +
            url.search +
            url.hash
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                if (
                    packageDetail &&
                    !packageDetail.hidden
                ) {

                    closeDetail();

                }


                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       URL PACKAGE
    ===================================================== */

    function handleUrlPackage() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const packageId =
            params.get("package");


        if (!packageId) {

            return;

        }


        const packageItem =
            packages.find(
                item =>
                    normalize(item.id) ===
                    normalize(packageId)
            );


        if (!packageItem) {

            return;

        }


        setTimeout(
            () => {

                openPackageDetail(
                    packageItem
                );

            },
            50
        );

    }


    /* =====================================================
       UPDATE URL
    ===================================================== */

    function updateUrl(
        packageId
    ) {

        if (!packageId) {

            return;

        }


        const url =
            new URL(
                window.location.href
            );


        url.searchParams.set(
            "package",
            packageId
        );


        window.history.replaceState(
            {},
            "",
            url.pathname +
            url.search +
            url.hash
        );

    }


})();