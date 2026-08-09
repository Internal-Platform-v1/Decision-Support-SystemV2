// shared/footer.js
(function() {
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            if (window.showToast) {
                window.showToast('Opening all guides');
            } else {
                console.log('Explore All Guides clicked');
            }
        });
    }
})();
