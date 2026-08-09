// shared/header.js
(function() {
    // Profile toggle
    const profileBtn = document.getElementById('profileBtn');
    const profileChevron = document.getElementById('profileChevron');
    const profileMenu = document.getElementById('profileMenu');

    function toggleProfile() {
        profileMenu.classList.toggle('open');
    }
    if (profileBtn) profileBtn.addEventListener('click', toggleProfile);
    if (profileChevron) profileChevron.addEventListener('click', toggleProfile);

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.header-actions')) {
            if (profileMenu) profileMenu.classList.remove('open');
        }
    });

    // Navigation items
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(function(n) {
                n.classList.remove('active');
            });
            item.classList.add('active');
            // Show toast is defined in main script – we'll call a global function if available
            if (window.showToast) {
                window.showToast(item.textContent.trim() + ' selected');
            } else {
                console.log(item.textContent.trim() + ' selected');
            }
        });
    });

    // Global search (bind to main script's performSearch)
    const globalSearchInput = document.getElementById('globalSearch');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (window.performSearch) {
                    window.performSearch(e.target.value);
                } else {
                    console.log('Search:', e.target.value);
                }
            }
        });
    }
})();
