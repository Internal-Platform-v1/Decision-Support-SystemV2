// shared/include.js
(function() {
    const basePath = 'shared/';

    function loadComponent(placeholderId, htmlFile, cssFile, jsFile) {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        // 1. Load HTML
        fetch(basePath + htmlFile)
            .then(res => res.text())
            .then(html => {
                placeholder.innerHTML = html;

                // 2. Load CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = basePath + cssFile;
                document.head.appendChild(link);

                // 3. Load JS
                if (jsFile) {
                    const script = document.createElement('script');
                    script.src = basePath + jsFile;
                    document.body.appendChild(script);
                }
            })
            .catch(err => console.warn(`Failed to load ${htmlFile}:`, err));
    }

    // Load header
    loadComponent('header-placeholder', 'header.html', 'header.css', 'header.js');

    // Load footer
    loadComponent('footer-placeholder', 'footer.html', 'footer.css', 'footer.js');
})();
