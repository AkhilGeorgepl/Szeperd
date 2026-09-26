document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");

    if (menuBtn && menu) {

        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            menu.classList.toggle("show");
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.remove("show");
            });
        });

        document.addEventListener("click", (event) => {

            if (
                menu.classList.contains("show") &&
                !menu.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                menu.classList.remove("show");
            }

        });

    }


    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    const header = document.getElementById("site-header");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        };

        updateHeader();

        window.addEventListener("scroll", updateHeader);

    }


    /* =====================================================
       EXPERIENCES
    ===================================================== */

    const grid = document.getElementById("experiencesGrid");
    const message = document.getElementById("experiencesMessage");

    if (!grid) {
        return;
    }


    /* =====================================================
       LOADING MESSAGE
    ===================================================== */

    if (message) {
        message.textContent = "Loading experiences...";
    }


    /* =====================================================
       LOAD EXPERIENCES JSON
    ===================================================== */

    fetch("./experiences.json")

        .then((response) => {

            if (!response.ok) {
                throw new Error(
                    `Could not load experiences.json (${response.status})`
                );
            }

            return response.json();

        })

        .then((data) => {

            /*
             * Your JSON should normally be:
             *
             * [
             *   {
             *      "image": "...",
             *      "title": "...",
             *      "experienceType": "...",
             *      "description": "...",
             *      "link": "...",
             *      "buttonText": "..."
             *   }
             * ]
             *
             * This also supports:
             *
             * {
             *   "experiences": [...]
             * }
             */

            let experiences = data;

            if (
                !Array.isArray(experiences) &&
                data &&
                Array.isArray(data.experiences)
            ) {
                experiences = data.experiences;
            }


            /* ---------------------------------------------
               CHECK JSON
            --------------------------------------------- */

            if (!Array.isArray(experiences)) {

                throw new Error(
                    "The JSON format is not an array of experiences."
                );

            }


            /* ---------------------------------------------
               CLEAR GRID
            --------------------------------------------- */

            grid.innerHTML = "";


            if (message) {
                message.textContent = "";
            }


            /* ---------------------------------------------
               NO EXPERIENCES
            --------------------------------------------- */

            if (experiences.length === 0) {

                if (message) {
                    message.textContent =
                        "No experiences available.";
                }

                return;
            }


            /* ---------------------------------------------
               CREATE EACH CARD
            --------------------------------------------- */

            experiences.forEach((item) => {

                const card = document.createElement("article");

                card.className = "experience-card";


                /* =========================================
                   IMAGE
                ========================================= */

                const imageBox =
                    document.createElement("div");

                imageBox.className =
                    "experience-image";


                const image =
                    document.createElement("img");

                image.src =
                    item.image || "";

                image.alt =
                    item.title || "Travel experience";

                image.loading =
                    "lazy";


                imageBox.appendChild(image);


                /* =========================================
                   CONTENT
                ========================================= */

                const content =
                    document.createElement("div");

                content.className =
                    "experience-content";


                /* =========================================
                   EXPERIENCE TYPE
                ========================================= */

                const category =
                    document.createElement("span");

                category.className =
                    "experience-category";

                category.textContent =
                    item.experienceType ||
                    "EXPERIENCE";


                /* =========================================
                   TITLE
                ========================================= */

                const title =
                    document.createElement("h2");

                title.textContent =
                    item.title || "Experience";


                /* =========================================
                   DESCRIPTION
                ========================================= */

                const description =
                    document.createElement("p");

                description.textContent =
                    item.description || "";


                /* =========================================
                   BUTTON
                ========================================= */

                const button =
                    document.createElement("a");

                button.className =
                    "experience-button";

                button.href =
                    item.link || "#";

                button.textContent =
                    item.buttonText || "Explore";


                /* =========================================
                   ARROW
                ========================================= */

                const arrow =
                    document.createElement("span");

                arrow.textContent = "?";

                arrow.setAttribute(
                    "aria-hidden",
                    "true"
                );

                button.appendChild(arrow);


                /* =========================================
                   PUT CONTENT TOGETHER
                ========================================= */

                content.appendChild(category);
                content.appendChild(title);
                content.appendChild(description);
                content.appendChild(button);


                /* =========================================
                   PUT CARD TOGETHER
                ========================================= */

                card.appendChild(imageBox);
                card.appendChild(content);


                /* =========================================
                   ADD CARD TO GRID
                ========================================= */

                grid.appendChild(card);

            });

        })

        .catch((error) => {

            console.error(
                "Experiences error:",
                error
            );


            grid.innerHTML = "";


            if (message) {

                message.textContent =
                    "Unable to load experiences.";

            }

        });

});