/* ============================================================
   shared/header.js – dropdown with two items + smooth toggle
   ============================================================ */

(function() {
    'use strict';

    /* ---- 1. Profile toggle (unchanged) ---- */
    var profileBtn = document.getElementById('profileBtn');
    var profileChevron = document.getElementById('profileChevron');
    var profileMenu = document.getElementById('profileMenu');

    function toggleProfile() {
        if (profileMenu) {
            profileMenu.classList.toggle('open');
        }
    }

    if (profileBtn) profileBtn.addEventListener('click', toggleProfile);
    if (profileChevron) profileChevron.addEventListener('click', toggleProfile);

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.header-actions')) {
            if (profileMenu) profileMenu.classList.remove('open');
        }
    });

    /* ---- 2. Case Directory dropdown ---- */
    var caseWrapper = document.querySelector('.nav-dropdown-wrapper');
    var caseBtn = document.getElementById('caseDirectoryBtn');
    var caseDropdown = document.getElementById('caseDropdown');

    function toggleDropdown(e) {
        e.stopPropagation();
        if (caseDropdown) {
            caseDropdown.classList.toggle('open');
            if (caseBtn) caseBtn.classList.toggle('open');
        }
    }

    if (caseBtn) {
        caseBtn.addEventListener('click', toggleDropdown);
        // also open on chevron click
        var chevron = caseBtn.querySelector('.dropdown-chevron');
        if (chevron) {
            chevron.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleDropdown(e);
            });
        }
    }

    // Close dropdown when clicking outside the wrapper
    document.addEventListener('click', function(e) {
        if (caseWrapper && !caseWrapper.contains(e.target)) {
            if (caseDropdown) caseDropdown.classList.remove('open');
            if (caseBtn) caseBtn.classList.remove('open');
        }
    });

    // Handle clicks on dropdown items
    if (caseDropdown) {
        caseDropdown.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var label = this.textContent.trim();
                if (window.showToast) {
                    window.showToast('Opening ' + label);
                } else {
                    console.log('Opening ' + label);
                }
                // close dropdown
                caseDropdown.classList.remove('open');
                if (caseBtn) caseBtn.classList.remove('open');
            });
        });
    }

    /* ---- 3. Main nav clicks (Home, EBS Response, FBC Comments, Links) ---- */
    var allNavItems = document.querySelectorAll('.nav-item:not(.has-dropdown)');

    allNavItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // remove active from all nav items
            document.querySelectorAll('.nav-item').forEach(function(n) {
                n.classList.remove('active');
            });
            this.classList.add('active');

            var label = this.textContent.trim().replace(/[⌄]/g, '').trim();
            if (window.showToast) {
                window.showToast(label + ' selected');
            } else {
                console.log(label + ' selected');
            }
        });
    });

    /* ---- 4. Global search (bind to main script's performSearch) ---- */
    var globalSearchInput = document.getElementById('globalSearch');
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
