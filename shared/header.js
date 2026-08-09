/* ============================================================
   shared/header.js – with refined animation coordination
   ============================================================ */

(function() {
    'use strict';

    /* ---- 1. Profile toggle ---- */
    var profileBtn = document.getElementById('profileBtn');
    var profileChevron = document.getElementById('profileChevron');
    var profileMenu = document.getElementById('profileMenu');

    function toggleProfile(e) {
        e.stopPropagation();
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
            var isOpen = caseDropdown.classList.contains('open');
            if (isOpen) {
                caseDropdown.classList.remove('open');
                if (caseBtn) caseBtn.classList.remove('open');
            } else {
                // close any other open dropdowns first
                document.querySelectorAll('.dropdown-panel.open').forEach(function(d) {
                    if (d !== caseDropdown) d.classList.remove('open');
                });
                document.querySelectorAll('.nav-item.has-dropdown.open').forEach(function(d) {
                    if (d !== caseBtn) d.classList.remove('open');
                });
                caseDropdown.classList.add('open');
                if (caseBtn) caseBtn.classList.add('open');
            }
        }
    }

    if (caseBtn) {
        caseBtn.addEventListener('click', toggleDropdown);
        var chevron = caseBtn.querySelector('.dropdown-chevron');
        if (chevron) {
            chevron.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleDropdown(e);
            });
        }
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (caseWrapper && !caseWrapper.contains(e.target)) {
            if (caseDropdown) caseDropdown.classList.remove('open');
            if (caseBtn) caseBtn.classList.remove('open');
        }
    });

    // Handle dropdown item clicks
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
                caseDropdown.classList.remove('open');
                if (caseBtn) caseBtn.classList.remove('open');
            });
        });
    }

    /* ---- 3. Main nav clicks ---- */
    var allNavItems = document.querySelectorAll('.nav-item:not(.has-dropdown)');

    allNavItems.forEach(function(item) {
        item.addEventListener('click', function() {
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

    /* ---- 4. Global search ---- */
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
