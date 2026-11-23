"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SELECT HTML ELEMENTS
    // ==========================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const themeToggle = document.getElementById("themeToggle");

    const projectModal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalStatus = document.getElementById("modalStatus");
    const closeModal = document.getElementById("modalClose");

    const currentYear = document.getElementById("currentYear");
    const backToTop = document.getElementById("backToTop");
    const progressBar = document.getElementById("scrollProgress");


    // ==========================================
    // 2. COPYRIGHT YEAR
    // ==========================================

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


// ==========================================
// 3. MOBILE NAVIGATION
// ==========================================

function closeMobileMenu() {

    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

}

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

    });

    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", closeMobileMenu);

    });

    document.addEventListener("click", (event) => {

        if (
            navLinks.classList.contains("active") &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }

    });

}


    // ==========================================
    // 4. DARK AND LIGHT THEME
    // ==========================================

    function getSavedTheme() {

        try {
            return localStorage.getItem("portfolio-theme");
        } catch (error) {
            return null;
        }

    }

    function saveTheme(theme) {

        try {
            localStorage.setItem("portfolio-theme", theme);
        } catch (error) {
            console.warn("Theme preference could not be saved.");
        }

    }

    const savedTheme = getSavedTheme();

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    function updateThemeButton() {

        if (!themeToggle) return;

        const isLight =
            document.body.classList.contains("light-theme");

        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(isLight)
        );

    }

    updateThemeButton();

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("light-theme");

            const currentTheme =
                document.body.classList.contains("light-theme")
                    ? "light"
                    : "dark";

            saveTheme(currentTheme);
            updateThemeButton();

        });

    }


    // ==========================================
    // 5. PROJECT MODAL
    // ==========================================

    const projectButtons =
    document.querySelectorAll(".project-details");

    let previousFocus = null;
    let previousBodyOverflow = "";

    function openProjectModal(button) {

        if (!projectModal) return;

        previousFocus = button;
        previousBodyOverflow = document.body.style.overflow;

        if (modalTitle) {
            modalTitle.textContent =
                button.dataset.title || "Project Details";
        }

        if (modalDescription) {
            modalDescription.textContent =
                button.dataset.description || "Project information.";
        }

        if (modalStatus) {
            modalStatus.textContent =
                button.dataset.status || "Completed";
        }

        projectModal.hidden = false;

        projectModal.classList.add("active");

        projectModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");
        document.body.style.overflow = "hidden";

        if (closeModal) {
            closeModal.focus();
        }

    }

    function closeProjectModal() {

        if (!projectModal || projectModal.hidden) return;

        projectModal.classList.remove("active");

        projectModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");

        document.body.style.overflow = previousBodyOverflow;

        projectModal.hidden = true;

        if (previousFocus) {
            previousFocus.focus();
            previousFocus = null;
        }

    }

    projectButtons.forEach((button) => {

        button.addEventListener("click", () => {
            openProjectModal(button);
        });

    });

    if (closeModal) {

        closeModal.addEventListener("click", closeProjectModal);

    }

    if (projectModal) {

        projectModal.addEventListener("click", (event) => {

            if (event.target === projectModal) {
                closeProjectModal();
            }

        });

    }


    // ==========================================
    // 6. MODAL KEYBOARD ACCESSIBILITY
    // ==========================================

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            projectModal &&
            !projectModal.hidden
        ) {
            closeProjectModal();
        }

    });

    if (projectModal) {

        projectModal.addEventListener("keydown", (event) => {

            if (event.key !== "Tab") return;

            const focusableElements = [
                ...projectModal.querySelectorAll(
                    'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ].filter((element) => {
                return element.getClientRects().length > 0;
            });

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];

            const lastElement =
                focusableElements[focusableElements.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {

                event.preventDefault();
                lastElement.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {

                event.preventDefault();
                firstElement.focus();

            }

        });

    }


    // ==========================================
    // 7. BACK TO TOP
    // ==========================================

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // ==========================================
    // 8. SCROLL PROGRESS
    // ==========================================

    function updateScrollProgress() {

        if (!progressBar) return;

        const scrollTop =
            window.scrollY || document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const percentage = scrollHeight > 0
            ? Math.min(100, (scrollTop / scrollHeight) * 100)
            : 0;

        progressBar.style.width = percentage + "%";

    }


    // ==========================================
    // 9. ACTIVE NAVIGATION
    // ==========================================

    const sections = document.querySelectorAll("section[id]");

    const allNavLinks = document.querySelectorAll(
        "#navLinks a[href^='#']"
    );

    function updateActiveNavigation() {

        let currentSection = "";

        sections.forEach((section) => {

            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                currentSection = section.id;
            }

        });

        allNavLinks.forEach((link) => {

            const isActive =
                link.getAttribute("href") === "#" + currentSection;

            link.classList.toggle("active", isActive);

        });

    }


    // ==========================================
    // 10. SCROLL REVEAL ANIMATIONS
    // ==========================================

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


        // ==========================================
    // 11. SKILL PROGRESS ANIMATIONS
    // ==========================================

    const skillBars = document.querySelectorAll(".skill-fill");

    function animateSkillBar(bar) {

        const progress = Number(bar.dataset.progress);

        if (!Number.isFinite(progress)) {
            console.warn("Invalid skill progress value:", bar);
            return;
        }

        const safeProgress = Math.min(
            100,
            Math.max(0, progress)
        );

        bar.style.setProperty(
            "--skill-progress",
            `${safeProgress}%`
        );

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                bar.classList.add("animate");
            });
        });

    }

    if ("IntersectionObserver" in window) {

        const skillObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        animateSkillBar(entry.target);

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.2
            }
        );

        skillBars.forEach((bar) => {
            skillObserver.observe(bar);
        });

    } else {

        skillBars.forEach(animateSkillBar);

    }

    // ==========================================
// 12. STATISTICS COUNTERS
// ==========================================

const counters = document.querySelectorAll(".stat-counter");

function startCounter(counter) {

    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target) || target < 0) return;

    const duration = 1500;
    const startTime = performance.now();

    const digits = Number(counter.dataset.digits || 0);
    const suffix = counter.dataset.suffix || "";

    function updateCounter(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const easedProgress =
            1 - Math.pow(1 - progress, 3);

        const currentValue =
            Math.floor(target * easedProgress);

        counter.textContent =
            currentValue.toString().padStart(digits, "0") + suffix;

        if (progress < 1) {

            requestAnimationFrame(updateCounter);

        } else {

            counter.textContent =
                target.toString().padStart(digits, "0") + suffix;

        }

    }

    requestAnimationFrame(updateCounter);

}

if ("IntersectionObserver" in window) {

    const counterObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    startCounter(entry.target);

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.5
        }
    );

    counters.forEach((counter) => {
        counterObserver.observe(counter);
    });

} else {

    counters.forEach(startCounter);

}


    // ==========================================
    // 13. OPTIMIZED SCROLL HANDLER
    // ==========================================

    let scrollScheduled = false;

    function handleScroll() {

        if (scrollScheduled) return;

        scrollScheduled = true;

        requestAnimationFrame(() => {

            updateScrollProgress();
            updateActiveNavigation();

            if (backToTop) {

                backToTop.classList.toggle(
                    "visible",
                    window.scrollY > 400
                );

            }

            scrollScheduled = false;

        });

    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });


    // ==========================================
    // 14. INITIAL PAGE CHECK
    // ==========================================
handleScroll();


// ==========================================
// 15. PREMIUM TYPING ANIMATION
// ==========================================

const typingText = document.getElementById("typingText");

if (typingText) {

    const roles = [
        "Cybersecurity Enthusiast",
        "Software Developer",
        "Python Programmer",
        "Digital Innovator",
        "Technology Entrepreneur"
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeRole() {

        const currentRole = roles[roleIndex];

        if (!deleting) {

            typingText.textContent =
                currentRole.substring(0, characterIndex + 1);

            characterIndex++;

            if (characterIndex === currentRole.length) {

                deleting = true;

                setTimeout(typeRole, 1800);
                return;

            }

        } else {

            typingText.textContent =
                currentRole.substring(0, characterIndex - 1);

            characterIndex--;

            if (characterIndex === 0) {

                deleting = false;

                roleIndex = (roleIndex + 1) % roles.length;

            }

        }

        setTimeout(typeRole, deleting ? 45 : 90);

    }

    typeRole();

}







// ==========================================
// 16. PORTFOLIO ASSISTANT
// ==========================================

const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantChat = document.getElementById("assistantChat");

function addAssistantMessage(message, type) {

    if (!assistantChat) return;

    const messageElement = document.createElement("div");

    messageElement.className =
    type === "user" ? "assistant-message user" : "assistant-message";
    messageElement.textContent = message;

    assistantChat.appendChild(messageElement);

    assistantChat.scrollTop = assistantChat.scrollHeight;
}

function getAssistantResponse(question) {

    const text = question.toLowerCase();

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("sannu") ||
        text.includes("ina kwana")
    ) {
        return "Hello! Sannu da zuwa AUWALMB Portfolio. How can I help you?";
    }

    if (
        text.includes("who is auwal") ||
        text.includes("about auwal") ||
        text.includes("waye auwal") ||
        text.includes("about me")
    ) {
        return "Auwal Mohammed Bello is a Computer Science graduate, Founder and Lead Developer with interests in Cybersecurity, Software Engineering and Artificial Intelligence.";
    }

    if (
        text.includes("skill") ||
        text.includes("skills") ||
        text.includes("fasaha")
    ) {
        return "Auwal's skills include HTML, CSS, JavaScript, Python, PHP, database management, cybersecurity fundamentals, IT support and data processing.";
    }

    if (
        text.includes("project") ||
        text.includes("projects") ||
        text.includes("ayyuka")
    ) {
        return "Auwal is developing CyberGuard, a digital safety platform, and DigitalPay, a fintech application project. Both projects are still in development.";
    }

    if (
        text.includes("cyberguard")
    ) {
        return "CyberGuard is a digital safety project designed to analyze suspicious URLs, detect potentially fraudulent messages and promote cybersecurity awareness.";
    }

    if (
        text.includes("digitalpay")
    ) {
        return "DigitalPay is a fintech application project focused on wallet management, authentication, transaction history and planned payment integrations.";
    }

    if (
        text.includes("education") ||
        text.includes("school") ||
        text.includes("karatu")
    ) {
        return "Auwal studied Computer Science at Al-Qalam University Katsina, where he earned a BSc degree (2018–2022), and also obtained a Computer Science Diploma from Federal Polytechnic Mubi (2014–2017).";
    }

    if (
        text.includes("certificate") ||
        text.includes("certification") ||
        text.includes("takardar shaida")
    ) {
        return "Auwal has completed technology training in Cybersecurity, Generative AI, Digital Skills, Fiber Optics, Data Center Fundamentals and other professional development areas. Visit the Certificates page to explore them.";
    }

    if (
        text.includes("experience") ||
        text.includes("work") ||
        text.includes("aiki")
    ) {
        return "Auwal completed his NYSC programme at New Nigeria Development Company Limited (NNDC), Kaduna, from 2022 to 2023. He also received technical training at Shams Fast Connect Centre, NITDA RITC and Hairat Computer Center.";
    }

    if (
        text.includes("contact") ||
        text.includes("email") ||
        text.includes("lamba")
    ) {
        return "You can contact Auwal through auwalmb@gmail.com or visit the Contact section of this portfolio.";
    }

    if (
        text.includes("hausa") ||
        text.includes("language")
    ) {
        return "I can respond to some common questions in English and Hausa. Sannu da zuwa!";
    }

    if (
        text.includes("thank") ||
        text.includes("nagode")
    ) {
        return "You're welcome! Thank you for visiting AUWALMB Portfolio.";
    }

    return "Thank you for your question! I am Auwal's local portfolio assistant. You can ask me about his skills, education, experience, certificates, CyberGuard or DigitalPay.";
}

if (assistantForm && assistantInput && assistantChat) {

    assistantForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const question = assistantInput.value.trim();

        if (!question) return;

        addAssistantMessage(question, "user");

        assistantInput.value = "";

        setTimeout(() => {

            const response = getAssistantResponse(question);

            addAssistantMessage(response, "assistant");

        }, 500);

    });

}







// ==========================================
// 17. CONTACT FORM - WHATSAPP INTEGRATION
// ==========================================

const contactForm = document.getElementById("contactForm");

const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactMessage = document.getElementById("contactMessage");
const contactNotice = document.getElementById("contactNotice");

if (
    contactForm &&
    contactName &&
    contactEmail &&
    contactMessage &&
    contactNotice
) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const message = contactMessage.value.trim();

        // Validate empty fields
        if (!name || !email || !message) {
            contactNotice.textContent =
                "Please complete all fields.";

            return;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            contactNotice.textContent =
                "Please enter a valid email address.";

            return;
        }

        // Prepare WhatsApp message
        const whatsappMessage =
            "Hello Auwal Mohammed Bello,\n\n" +
            "I contacted you through your portfolio.\n\n" +
            "Name: " + name + "\n" +
            "Email: " + email + "\n\n" +
            "Message:\n" + message;

        const encodedMessage =
            encodeURIComponent(whatsappMessage);

        // Your WhatsApp number
        const whatsappLink =
            "https://wa.me/2348035464511?text=" +
            encodedMessage;

        // Show notification
        contactNotice.textContent =
            "Opening WhatsApp. Please send your message.";

        // Open WhatsApp
        const whatsappWindow = window.open(
            whatsappLink,
            "_blank"
        );

        // Fallback if browser blocks the new window
        if (!whatsappWindow) {
            contactNotice.innerHTML =
                'WhatsApp did not open. ' +
                '<a href="' + whatsappLink +
                '" target="_blank" rel="noopener noreferrer">' +
                'Click here to continue.</a>';
        }

    });

}
    

console.log("AUWALMB JavaScript is working!");
console.log("Menu button:", menuToggle);
console.log("Theme button:", themeToggle);



    console.info(
        "AUWALMB Premium Portfolio loaded successfully."
    );

}); 





