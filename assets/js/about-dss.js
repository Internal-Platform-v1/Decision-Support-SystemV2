/* ============================================================
   BD Tools — About DSS page behavior

   1. Scroll-reveal for section content (fade + slide as it
      enters the viewport)
   2. Animated stat counters — parses the number from the
      visible text so no `data-count` attributes are needed
   3. CTA buttons → footer Feedback / Help modals
   ============================================================ */
(function () {
    "use strict";

    let initialized = false;

    /* ---------------------------------------------------------
       1. Scroll reveal
       --------------------------------------------------------- */
    function setupScrollReveal() {
        if (typeof IntersectionObserver === "undefined") return;

        const selectors = [
            ".about-split-copy",
            ".about-visual-card",
            ".about-mv-card",
            ".about-value",
            ".about-timeline-item",
            ".about-team-card",
            ".about-testimonial",
            ".about-cta"
        ].join(",");

        const blocks = document.querySelectorAll(selectors);
        if (!blocks.length) return;

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
       2. Animated stat counters
       Reads "75+" → target 75, suffix "+"
       Reads "200+" → target 200, suffix "+"
       Reads "6"   → target 6,   suffix ""
       --------------------------------------------------------- */
    function parseStatValue(el) {
        const text  = (el.textContent || "").trim();
        const match = text.match(/^(\d+)(.*)$/);
        if (!match) return null;
        return { target: Number(match[1]), suffix: match[2] || "" };
    }

    function animateCount(el, target, suffix) {
        if (!target || !isFinite(target)) return;

        const duration = 900;
        const start = performance.now();

        function step(now) {
            const elapsed  = Math.min(now - start, duration);
            const progress = elapsed / duration;
            const eased    = 1 - Math.pow(1 - progress, 3);   // easeOutCubic
            const value    = Math.round(target * eased);
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
        const counters = document.querySelectorAll(".stats-row .stat-card strong");
        if (!counters.length) return;

        if (typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                if (el.dataset.animated === "true") return;
                el.dataset.animated = "true";

                const parsed = parseStatValue(el);
                if (parsed) {
                    el.textContent = "0" + parsed.suffix;
                    animateCount(el, parsed.target, parsed.suffix);
                }

                observer.unobserve(el);
            });
        }, { threshold: 0.4 });

        counters.forEach(el => observer.observe(el));
    }

    /* ---------------------------------------------------------
       3. CTA — wire to footer's Feedback / Help modals
       --------------------------------------------------------- */
    function triggerFooterButton(id, tries) {
        tries = tries || 0;
        const btn = document.getElementById(id);
        if (btn) { btn.click(); return true; }
        if (tries > 40) return false;
        setTimeout(() => triggerFooterButton(id, tries + 1), 100);
        return false;
    }

    function setupCta() {
        const feedbackBtn = document.getElementById("aboutFeedbackBtn");
        const helpBtn     = document.getElementById("aboutHelpBtn");

        if (feedbackBtn) {
            feedbackBtn.addEventListener("click", function () {
                if (!triggerFooterButton("footerFeedbackBtn")) {
                    window.location.href = "index.html";
                }
            });
        }

        if (helpBtn) {
            helpBtn.addEventListener("click", function () {
                if (!triggerFooterButton("footerHelpBtn")) {
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

        setupScrollReveal();
        setupCounters();
        setupCta();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
