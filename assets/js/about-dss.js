/* ============================================================
   BD Tools — About DSS page behavior

   1. Animated counter for the stats band
   2. Scroll-reveal for section content
   3. CTA buttons — wire to footer's Feedback / Help modals
   ============================================================ */
(function () {
    "use strict";

    let initialized = false;

    /* ---------------------------------------------------------
       1. Animated stat counters
       --------------------------------------------------------- */
    function animateCount(el) {
        const target = Number(el.dataset.count || 0);
        const suffix = el.dataset.suffix || "";
        if (!target || !isFinite(target)) return;

        const duration = 900;
        const start = performance.now();

        function step(now) {
            const elapsed = Math.min(now - start, duration);
            const progress = elapsed / duration;
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            el.textContent = value + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    function setupCounters() {
        const counters = document.querySelectorAll(".about-stat strong[data-count]");
        if (!counters.length) return;

        // If IntersectionObserver isn't available, just show final values
        if (typeof IntersectionObserver === "undefined") {
            counters.forEach(el => {
                el.textContent = (el.dataset.count || "0") + (el.dataset.suffix || "");
            });
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                if (el.dataset.animated === "true") return;
                el.dataset.animated = "true";
                animateCount(el);
                observer.unobserve(el);
            });
        }, { threshold: 0.35 });

        counters.forEach(el => observer.observe(el));
    }

    /* ---------------------------------------------------------
       2. Scroll reveal — fade sections in as they enter viewport
       --------------------------------------------------------- */
    function setupScrollReveal() {
        if (typeof IntersectionObserver === "undefined") return;

        // Sections we want to fade in as a whole
        const blocks = document.querySelectorAll(
            ".about-split, .about-section-heading, .about-mv-card, " +
            ".about-value, .about-timeline-item, .about-team-card, " +
            ".about-proof-card, .about-testimonial, .about-cta"
        );

        blocks.forEach(el => el.classList.add("about-reveal"));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

        blocks.forEach(el => observer.observe(el));
    }

    /* ---------------------------------------------------------
       3. CTA — wire to footer's Feedback / Help modals
       --------------------------------------------------------- */
    function clickWhenReady(btnId, tries) {
        tries = tries || 0;
        const target = document.getElementById(btnId);
        if (target) {
            target.click();
            return true;
        }
        if (tries > 40) return false;
        setTimeout(() => clickWhenReady(btnId, tries + 1), 100);
        return false;
    }

    function setupCta() {
        const feedbackBtn = document.getElementById("aboutFeedbackBtn");
        const helpBtn     = document.getElementById("aboutHelpBtn");

        if (feedbackBtn) {
            feedbackBtn.addEventListener("click", () => {
                // Try to trigger the footer's Give Feedback modal
                if (!clickWhenReady("footerFeedbackBtn")) {
                    window.location.href = "index.html";
                }
            });
        }

        if (helpBtn) {
            helpBtn.addEventListener("click", () => {
                if (!clickWhenReady("footerHelpBtn")) {
                    window.location.href = "index.html";
                }
            });
        }
    }

    /* ---------------------------------------------------------
       4. Init
       --------------------------------------------------------- */
    function init() {
        if (initialized) return;
        initialized = true;

        setupCounters();
        setupScrollReveal();
        setupCta();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
