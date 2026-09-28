/* =========================================================
   SZEPPERD RESERVATION
========================================================= */

const RESERVATION_API =
    "https://api.szeperd.pl/api/reservation";


document.addEventListener("DOMContentLoaded", initReservation);


/* =========================================================
   MAIN
========================================================= */

async function initReservation() {

    setupMobileMenu();

    const form =
        document.getElementById("reservation-form");

    if (!form) {
        return;
    }

    const packageId =
        new URLSearchParams(window.location.search)
            .get("package");


    try {

        const [
            packagesResponse,
            reservationResponse
        ] = await Promise.all([

            fetch(
                "packages.json",
                {
                    cache: "no-store"
                }
            ),

            fetch(
                "reservation.json",
                {
                    cache: "no-store"
                }
            )

        ]);


        if (!packagesResponse.ok) {
            throw new Error(
                "Could not load packages.json"
            );
        }


        if (!reservationResponse.ok) {
            throw new Error(
                "Could not load reservation.json"
            );
        }


        const packages =
            await packagesResponse.json();

        const reservation =
            await reservationResponse.json();


        const packageList =
            Array.isArray(packages)
                ? packages
                : Array.isArray(packages.packages)
                    ? packages.packages
                    : [];


        const selectedPackage =
            packageList.find(
                item =>
                    String(item.id) ===
                    String(packageId)
            );


        renderReservation(
            reservation,
            selectedPackage
        );


        setupForm(
            reservation,
            selectedPackage
        );


    } catch (error) {

        console.error(
            "Reservation loading error:",
            error
        );


        /*
         * IMPORTANT:
         * Do NOT hide the form.
         */

        showReservationError(
            "Unable to load some reservation information. Please refresh the page and try again."
        );


        /*
         * Keep the basic form visible.
         */

        const form =
            document.getElementById(
                "reservation-form"
            );

        if (form) {
            form.style.display = "block";
            form.style.visibility = "visible";
            form.style.opacity = "1";
        }
    }
}


/* =========================================================
   RENDER
========================================================= */

function renderReservation(
    reservation,
    selectedPackage
) {

    const form =
        reservation.form || {};


    /* -----------------------------------------
       HEADER
    ----------------------------------------- */

    setText(
        "reservation-title",
        form.title ||
        "Reserve Your Package"
    );


    setText(
        "reservation-subtitle",
        form.subtitle ||
        ""
    );


    /* -----------------------------------------
       INFORMATION
    ----------------------------------------- */

    const information =
        form.information;


    const informationBox =
        document.getElementById(
            "reservation-information"
        );


    if (informationBox && information) {

        setText(
            "reservation-information-title",
            information.title || ""
        );


        setText(
            "reservation-information-text",
            information.text || ""
        );


        setText(
            "reservation-information-important",
            information.important || ""
        );


        informationBox.hidden = false;
    }


    /* -----------------------------------------
       SELECTED PACKAGE
    ----------------------------------------- */

    const packageName =
        selectedPackage
            ? (
                selectedPackage.title ||
                selectedPackage.name ||
                "Selected Package"
            )
            : "No package selected";


    setText(
        "reservation-package-name",
        packageName
    );


    setText(
        "selected-package-label",
        form.selectedPackage?.label ||
        "Selected Package"
    );


    /* -----------------------------------------
       SECTION TITLES
    ----------------------------------------- */

    const sections =
        form.sections || {};


    setText(
        "traveller-details-title",
        sections.travellerDetails ||
        "Traveller Details"
    );


    setText(
        "travel-preferences-title",
        sections.travelPreferences ||
        "Travel Preferences"
    );


    setText(
        "additional-information-title",
        sections.additionalInformation ||
        "Additional Information"
    );


    setText(
        "declarations-title",
        sections.declarations ||
        "Declarations & Agreements"
    );


    /* -----------------------------------------
       FIELDS
    ----------------------------------------- */

    renderFields(
        form.fields || []
    );


    /* -----------------------------------------
       OPTIONS
    ----------------------------------------- */

    renderOptions(
        form.options || []
    );


    /* -----------------------------------------
       NOTES
    ----------------------------------------- */

    renderNotes(
        form.notes || []
    );


    /* -----------------------------------------
       DECLARATIONS
    ----------------------------------------- */

    renderDeclarations(
        form.declarations || []
    );


    /* -----------------------------------------
       BUTTONS
    ----------------------------------------- */

    setText(
        "submit-reservation",
        form.submitButton ||
        "Send Reservation Request"
    );


    setText(
        "reservation-back-button",
        form.backButton ||
        "Back to Packages"
    );


    /* -----------------------------------------
       FOOTER
    ----------------------------------------- */

    setText(
        "footer-copyright",
        reservation.footer?.copyright ||
        "© 2026 Szeperd. All Rights Reserved."
    );


    /* -----------------------------------------
       PAGE TITLE
    ----------------------------------------- */

    document.title =
        "Szeperd | Reservation";
}


/* =========================================================
   FIELDS
========================================================= */

function renderFields(fields) {

    const container =
        document.getElementById(
            "reservation-fields"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    fields.forEach(field => {

        if (!field || !field.id) {
            return;
        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "reservation-field";


        const label =
            document.createElement("label");


        label.htmlFor =
            field.id;


        label.textContent =
            field.label || field.id;


        if (field.required) {

            const required =
                document.createElement("span");

            required.className =
                "required-mark";

            required.textContent =
                "*";

            label.appendChild(required);
        }


        let input;


        if (field.type === "textarea") {

            input =
                document.createElement(
                    "textarea"
                );

        } else {

            input =
                document.createElement(
                    "input"
                );

            input.type =
                field.type || "text";
        }


        input.id =
            field.id;


        input.name =
            field.id;


        if (field.placeholder) {

            input.placeholder =
                field.placeholder;
        }


        if (field.required) {

            input.required = true;
        }


        wrapper.appendChild(label);

        wrapper.appendChild(input);

        container.appendChild(wrapper);
    });
}


/* =========================================================
   OPTIONS
========================================================= */

function renderOptions(options) {

    const container =
        document.getElementById(
            "reservation-options"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    options.forEach(option => {

        if (!option || !option.id) {
            return;
        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "reservation-option";


        const input =
            document.createElement("input");


        input.type =
            option.type || "checkbox";


        input.id =
            option.id;


        input.name =
            option.id;


        input.value =
            "true";


        input.checked =
            Boolean(option.checked);


        if (option.required) {
            input.required = true;
        }


        const label =
            document.createElement("label");


        label.htmlFor =
            option.id;


        label.textContent =
            option.label || option.id;


        wrapper.appendChild(input);

        wrapper.appendChild(label);

        container.appendChild(wrapper);
    });
}


/* =========================================================
   NOTES
========================================================= */

function renderNotes(notes) {

    const container =
        document.getElementById(
            "reservation-notes"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    notes.forEach(note => {

        if (!note || !note.id) {
            return;
        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "reservation-note";


        const label =
            document.createElement("label");


        label.htmlFor =
            note.id;


        label.textContent =
            note.title || note.id;


        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.id =
            note.id;


        textarea.name =
            note.id;


        textarea.placeholder =
            note.placeholder || "";


        if (note.required) {
            textarea.required = true;
        }


        wrapper.appendChild(label);

        wrapper.appendChild(textarea);


        if (note.helperText) {

            const helper =
                document.createElement("span");


            helper.className =
                "reservation-note-helper";


            helper.textContent =
                note.helperText;


            wrapper.appendChild(helper);
        }


        container.appendChild(wrapper);
    });
}


/* =========================================================
   DECLARATIONS
========================================================= */

function renderDeclarations(
    declarations
) {

    const container =
        document.getElementById(
            "reservation-declarations"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    declarations.forEach(declaration => {

        if (
            !declaration ||
            !declaration.id
        ) {
            return;
        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "reservation-declaration";


        const input =
            document.createElement("input");


        input.type =
            "checkbox";


        input.id =
            declaration.id;


        input.name =
            declaration.id;


        input.value =
            "true";


        if (declaration.required) {
            input.required = true;
        }


        const label =
            document.createElement("label");


        label.htmlFor =
            declaration.id;


        label.textContent =
            declaration.label || "";


        /*
         * Supports current flat JSON:
         *
         * "link": "terms.html",
         * "linkText": "Read Terms & Conditions"
         *
         * Also supports the older nested format
         * just in case.
         */

        let linkUrl = "";
        let linkText = "";


        if (
            declaration.link &&
            typeof declaration.link === "string"
        ) {

            linkUrl =
                declaration.link;

            linkText =
                declaration.linkText ||
                declaration.link;
        }


        if (
            declaration.link &&
            typeof declaration.link === "object"
        ) {

            linkUrl =
                declaration.link.url ||
                "";

            linkText =
                declaration.link.text ||
                declaration.linkText ||
                linkUrl;
        }


        if (linkUrl) {

            const link =
                document.createElement("a");


            link.href =
                linkUrl;


            link.textContent =
                ` ${linkText}`;


            link.target =
                "_blank";


            link.rel =
                "noopener noreferrer";


            label.appendChild(link);
        }


        wrapper.appendChild(input);

        wrapper.appendChild(label);

        container.appendChild(wrapper);
    });
}


/* =========================================================
   FORM
========================================================= */

function setupForm(
    reservation,
    selectedPackage
) {

    const form =
        document.getElementById(
            "reservation-form"
        );


    if (!form) {
        return;
    }


    const validationMessages =
        reservation.form?.validationMessages ||
        {};


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearMessage();

            clearInvalidStates();


            const valid =
                validateForm(
                    form,
                    validationMessages
                );


            if (!valid) {
                return;
            }


            if (!selectedPackage) {

                showReservationError(
                    "Please select a package before sending your reservation request."
                );

                return;
            }


            const submitButton =
                document.getElementById(
                    "submit-reservation"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Sending...";
            }


            try {

                const formData =
                    collectReservationData(
                        form
                    );


                const payload = {

                    package: {

                        id:
                            selectedPackage.id,

                        title:
                            selectedPackage.title ||
                            selectedPackage.name ||
                            ""

                    },

                    traveller:
                        formData,

                    submittedAt:
                        new Date().toISOString(),

                    source:
                        "szeperd-website"
                };


                const response =
                    await fetch(
                        RESERVATION_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );
                }


                showReservationSuccess(
                    reservation.form?.successMessage ||
                    "Thank you. Your reservation request has been received."
                );


                form.reset();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


            } catch (error) {

                console.error(
                    "Reservation submission error:",
                    error
                );


                showReservationError(
                    validationMessages.submissionError ||
                    "Something went wrong. Please try again later."
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        reservation.form?.submitButton ||
                        "Send Reservation Request";
                }
            }
        }
    );


    /*
     * Remove invalid state as user corrects fields.
     */

    form.addEventListener(
        "input",
        event => {

            const field =
                event.target.closest(
                    ".reservation-field"
                );

            if (field) {
                field.classList.remove(
                    "invalid"
                );
            }
        }
    );


    form.addEventListener(
        "change",
        event => {

            const declaration =
                event.target.closest(
                    ".reservation-declaration"
                );

            if (declaration) {
                declaration.classList.remove(
                    "invalid"
                );
            }
        }
    );
}


/* =========================================================
   VALIDATION
========================================================= */

function validateForm(
    form,
    messages
) {

    let valid = true;


    const requiredInputs =
        form.querySelectorAll(
            "input[required], textarea[required], select[required]"
        );


    requiredInputs.forEach(input => {

        if (
            input.type === "checkbox" &&
            !input.checked
        ) {

            valid = false;

            markInvalid(input);
            return;
        }


        if (
            input.type !== "checkbox" &&
            !input.value.trim()
        ) {

            valid = false;

            markInvalid(input);
        }
    });


    const email =
        form.querySelector(
            "#email"
        );


    const confirmEmail =
        form.querySelector(
            "#confirmEmail"
        );


    if (email && email.value.trim()) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                email.value.trim()
            )
        ) {

            valid = false;

            markInvalid(email);

            showReservationError(
                messages.invalidEmail ||
                "Please enter a valid email address."
            );

            return false;
        }
    }


    if (
        email &&
        confirmEmail &&
        email.value.trim() !==
        confirmEmail.value.trim()
    ) {

        valid = false;

        markInvalid(email);

        markInvalid(confirmEmail);

        showReservationError(
            messages.emailMismatch ||
            "Email addresses do not match."
        );

        return false;
    }


    if (!valid) {

        showReservationError(
            messages.required ||
            "Please complete all required fields."
        );
    }


    return valid;
}


/* =========================================================
   COLLECT DATA
========================================================= */

function collectReservationData(form) {

    const data = {};


    const elements =
        form.querySelectorAll(
            "input, textarea, select"
        );


    elements.forEach(element => {

        if (!element.name) {
            return;
        }


        if (
            element.type === "checkbox"
        ) {

            data[element.name] =
                element.checked;

        } else {

            data[element.name] =
                element.value.trim();
        }
    });


    return data;
}


/* =========================================================
   INVALID
========================================================= */

function markInvalid(input) {

    const field =
        input.closest(
            ".reservation-field"
        );


    if (field) {

        field.classList.add(
            "invalid"
        );

        return;
    }


    const declaration =
        input.closest(
            ".reservation-declaration"
        );


    if (declaration) {

        declaration.classList.add(
            "invalid"
        );
    }
}


function clearInvalidStates() {

    document
        .querySelectorAll(
            ".invalid"
        )
        .forEach(element => {

            element.classList.remove(
                "invalid"
            );
        });
}


/* =========================================================
   MESSAGE
========================================================= */

function showReservationError(message) {

    const box =
        document.getElementById(
            "reservation-message"
        );


    if (!box) {
        return;
    }


    box.hidden = false;

    box.className =
        "reservation-message error";

    box.textContent =
        message;
}


function showReservationSuccess(message) {

    const box =
        document.getElementById(
            "reservation-message"
        );


    if (!box) {
        return;
    }


    box.hidden = false;

    box.className =
        "reservation-message success";

    box.textContent =
        message;
}


function clearMessage() {

    const box =
        document.getElementById(
            "reservation-message"
        );


    if (!box) {
        return;
    }


    box.hidden = true;

    box.textContent = "";

    box.className =
        "reservation-message";
}


function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";
    }
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "menu-toggle"
        );


    const navigation =
        document.getElementById(
            "mobile-navigation"
        );


    if (
        !button ||
        !navigation
    ) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const isOpen =
                navigation.classList.toggle(
                    "open"
                );


            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            navigation.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );
        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navigation.classList.remove(
                        "open"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    navigation.setAttribute(
                        "aria-hidden",
                        "true"
                    );
                }
            );
        });
}