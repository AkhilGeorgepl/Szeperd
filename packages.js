/* =========================================================
   SZEPRED — PACKAGES PAGE JAVASCRIPT
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


    /* =====================================================
       DATA
       ===================================================== */

    let packages = [];

    let filteredPackages = [];


    /* =====================================================
       BASIC SAFETY CHECK
       ===================================================== */

    if (!packagesGrid) {

        console.error(
            "Szepred Packages: #packages-grid was not found."
        );

        return;

    }


    /* =====================================================
       MENU
       ===================================================== */

    if (menuButton && menu) {

        menuButton.addEventListener("click", (event) => {

            event.stopPropagation();

            menu.classList.toggle("show");

        });


        document.addEventListener("click", (event) => {

            if (
                !menu.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                menu.classList.remove("show");

            }

        });


        menu.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                menu.classList.remove("show");

            });

        });

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHtml(value) {

        if (value === null || value === undefined) {

            return "";

        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       NORMALIZE VALUE
       ===================================================== */

    function normalize(value) {

        return String(value || "")
            .trim()
            .toLowerCase();

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadPackages();


    async function loadPackages() {

        showLoading();


        try {

            const response =
                await fetch("packages.json", {
                    cache: "no-cache"
                });


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


            packages = data.filter(
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

            filteredPackages = [...packages];

            renderPackages(filteredPackages);

            handleUrlPackage();


        } catch (error) {

            console.error(
                "Szepred Packages Error:",
                error
            );

            showLoadError(error);

        }

    }


    /* =====================================================
       LOADING STATE
       ===================================================== */

    function showLoading() {

        packagesGrid.innerHTML = `
            <div class="packages-loading"
                 style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 70px 20px;
                    color: #6d685f;
                 ">
                <p>Loading tour packages...</p>
            </div>
        `;

        if (emptyState) {

            emptyState.hidden = true;

        }

    }


    /* =====================================================
       ERROR STATE
       ===================================================== */

    function showLoadError(error) {

        packagesGrid.innerHTML = `
            <div class="packages-load-error"
                 style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                 ">

                <h3 style="
                    margin-bottom: 12px;
                    color: #173c2a;
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 28px;
                ">
                    Packages could not be loaded
                </h3>

                <p style="
                    margin-bottom: 10px;
                    color: #6d685f;
                    line-height: 1.6;
                ">
                    Please check that <strong>packages.json</strong>
                    is in the same folder as packages.html.
                </p>

                <p style="
                    color: #9a7560;
                    font-size: 13px;
                ">
                    ${escapeHtml(error.message)}
                </p>

            </div>
        `;

        if (emptyState) {

            emptyState.hidden = true;

        }

    }


    /* =====================================================
       POPULATE FILTERS
       ===================================================== */

    function populateFilters() {

        if (categoryFilter) {

            const categories = [
                ...new Set(
                    packages
                        .map(item => item.category)
                        .filter(Boolean)
                )
            ].sort();


            categoryFilter.innerHTML = `
                <option value="all">
                    All destinations
                </option>
            `;


            categories.forEach(category => {

                const option =
                    document.createElement("option");

                option.value = category;

                option.textContent = category;

                categoryFilter.appendChild(option);

            });

        }


        if (durationFilter) {

            const durations = [
                ...new Set(
                    packages
                        .map(item => item.duration)
                        .filter(Boolean)
                )
            ];


            durations.sort((a, b) => {

                const daysA =
                    parseInt(a, 10) || 0;

                const daysB =
                    parseInt(b, 10) || 0;

                return daysA - daysB;

            });


            durationFilter.innerHTML = `
                <option value="all">
                    All durations
                </option>
            `;


            durations.forEach(duration => {

                const option =
                    document.createElement("option");

                option.value = duration;

                option.textContent = duration;

                durationFilter.appendChild(option);

            });

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

                    categoryFilter.value = "all";

                }


                if (durationFilter) {

                    durationFilter.value = "all";

                }


                applyFilters();

            }
        );

    }


    function applyFilters() {

        const selectedCategory =
            categoryFilter
                ? normalize(categoryFilter.value)
                : "all";


        const selectedDuration =
            durationFilter
                ? normalize(durationFilter.value)
                : "all";


        filteredPackages =
            packages.filter(packageItem => {

                const categoryMatches =
                    selectedCategory === "all" ||
                    normalize(packageItem.category) ===
                    selectedCategory;


                const durationMatches =
                    selectedDuration === "all" ||
                    normalize(packageItem.duration) ===
                    selectedDuration;


                return (
                    categoryMatches &&
                    durationMatches
                );

            });


        renderPackages(filteredPackages);

    }


    /* =====================================================
       RENDER PACKAGES
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


        packageList.forEach((packageItem) => {

            const card =
                createPackageCard(packageItem);

            packagesGrid.appendChild(card);

        });

    }


    /* =====================================================
       CREATE PACKAGE CARD
       ===================================================== */

    function createPackageCard(packageItem) {

        const card =
            document.createElement("article");


        card.className = "package-card";


        const highlights =
            Array.isArray(packageItem.highlights)
                ? packageItem.highlights
                : [];


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
                        ${escapeHtml(packageItem.status)}
                    </span>
                  `
                : "";


        card.innerHTML = `

            <div class="package-card-image">

                <img
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(packageItem.title)}"
                    loading="lazy"
                >

                ${status}

            </div>


            <div class="package-card-content">

                <div class="package-card-category">
                    ${escapeHtml(packageItem.category || "")}
                </div>


                <h2>
                    ${escapeHtml(packageItem.title)}
                </h2>


                <p class="package-card-subtitle">
                    ${escapeHtml(packageItem.subtitle || "")}
                </p>


                <div class="package-card-meta">

                    <div>
                        <i class="far fa-calendar"></i>

                        <span>
                            ${escapeHtml(packageItem.duration || "")}
                        </span>
                    </div>


                    <div>
                        <i class="fas fa-location-dot"></i>

                        <span>
                            ${escapeHtml(packageItem.destinations || "")}
                        </span>
                    </div>

                </div>


                ${
                    highlightsHtml
                        ? `
                            <ul class="package-card-highlights">
                                ${highlightsHtml}
                            </ul>
                          `
                        : ""
                }


                <div class="package-card-bottom">

                    <div class="package-card-price">

                        <span class="package-card-price-label">
                            From
                        </span>

                        <span class="package-card-price-value">
                            ${escapeHtml(packageItem.price || "")}
                        </span>

                        <span class="package-card-price-note">
                            ${escapeHtml(packageItem.priceNote || "")}
                        </span>

                    </div>


                    <button
                        type="button"
                        class="view-package-button"
                        data-package-id="${escapeHtml(packageItem.id)}"
                    >
                        View Package
                    </button>

                </div>

            </div>
        `;


        const imageElement =
            card.querySelector("img");


        if (imageElement) {

            imageElement.addEventListener(
                "error",
                () => {

                    imageElement.style.display = "none";

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
       OPEN PACKAGE DETAIL
       ===================================================== */

    function openPackageDetail(packageItem) {

        if (!packageDetail) {

            return;

        }


        const detailImage =
            document.getElementById("detail-image");

        const detailCategory =
            document.getElementById("detail-category");

        const detailTitle =
            document.getElementById("detail-title");

        const detailSubtitle =
            document.getElementById("detail-subtitle");

        const detailDuration =
            document.getElementById("detail-duration");

        const detailDestinations =
            document.getElementById("detail-destinations");

        const detailPrice =
            document.getElementById("detail-price");

        const detailDescription =
            document.getElementById("detail-description");

        const detailHighlights =
            document.getElementById("detail-highlights");

        const detailItinerary =
            document.getElementById("detail-itinerary");

        const detailIncluded =
            document.getElementById("detail-included");

        const detailNotIncluded =
            document.getElementById("detail-not-included");


        if (detailImage) {

            detailImage.src =
                packageItem.image || "";

            detailImage.alt =
                packageItem.title || "";

        }


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


        /* -----------------------------------------------
           HIGHLIGHTS
           ----------------------------------------------- */

        if (detailHighlights) {

            detailHighlights.innerHTML = "";


            const highlights =
                Array.isArray(packageItem.highlights)
                    ? packageItem.highlights
                    : [];


            highlights.forEach(item => {

                const li =
                    document.createElement("li");

                li.textContent = item;

                detailHighlights.appendChild(li);

            });

        }


        /* -----------------------------------------------
           ITINERARY
           ----------------------------------------------- */

        if (detailItinerary) {

            detailItinerary.innerHTML = "";


            const itinerary =
                Array.isArray(packageItem.itinerary)
                    ? packageItem.itinerary
                    : [];


            itinerary.forEach(day => {

                const item =
                    document.createElement("div");


                item.className =
                    "itinerary-item";


                const dayNumber =
                    day.day
                        ? `Day ${day.day}`
                        : "";


                item.innerHTML = `

                    <strong>
                        ${escapeHtml(dayNumber)}
                        ${
                            day.title
                                ? ` — ${escapeHtml(day.title)}`
                                : ""
                        }
                    </strong>

                    <p>
                        ${escapeHtml(day.description || "")}
                    </p>

                `;


                detailItinerary.appendChild(item);

            });

        }


        /* -----------------------------------------------
           INCLUDED
           ----------------------------------------------- */

        populateList(
            detailIncluded,
            packageItem.included
        );


        /* -----------------------------------------------
           NOT INCLUDED
           ----------------------------------------------- */

        populateList(
            detailNotIncluded,
            packageItem.notIncluded
        );


        /* -----------------------------------------------
           ENQUIRY LINK
           ----------------------------------------------- */

        const enquiryButton =
            packageDetail.querySelector(
                ".package-enquiry-button"
            );


        if (enquiryButton) {

            enquiryButton.href =
                `../contact.html?package=${encodeURIComponent(
                    packageItem.id
                )}`;

        }


        /* -----------------------------------------------
           SHOW DETAIL
           ----------------------------------------------- */

        packageDetail.hidden = false;

        packageDetail.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        document.body.style.overflow = "hidden";


        /*
         * Remove the URL package parameter when opening
         * from a normal card click.
         */

        updateUrl(packageItem.id);

    }


    /* =====================================================
       POPULATE DETAIL LIST
       ===================================================== */

    function populateList(element, items) {

        if (!element) {

            return;

        }


        element.innerHTML = "";


        if (!Array.isArray(items)) {

            return;

        }


        items.forEach(item => {

            const li =
                document.createElement("li");

            li.textContent = item;

            element.appendChild(li);

        });

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

        document.body.style.overflow = "";


        const url =
            new URL(window.location.href);


        url.searchParams.delete("package");


        window.history.replaceState(
            {},
            "",
            url.pathname +
            url.search +
            url.hash
        );

    }


    /* =====================================================
       ESC KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                packageDetail &&
                !packageDetail.hidden
            ) {

                closeDetail();

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


        if (packageItem) {

            /*
             * Wait until the page has rendered before
             * opening the detail section.
             */

            setTimeout(() => {

                openPackageDetail(
                    packageItem
                );

            }, 50);

        }

    }


    /* =====================================================
       UPDATE URL
       ===================================================== */

    function updateUrl(packageId) {

        if (!packageId) {

            return;

        }


        const url =
            new URL(window.location.href);


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