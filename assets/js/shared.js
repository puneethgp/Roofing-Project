// =========================================
// SHARED - Loaded on all public pages
// =========================================

// --- Back-to-Top Button ---
(function () {
    const btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.title = 'Back to top';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    btn.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });
})();

// --- Shareable Project URL Handler ---
// Call this after projects are loaded on the page
window.checkProjectUrlParam = function () {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    if (projectId && typeof openProjectModal === 'function') {
        // Small delay to ensure data is loaded
        setTimeout(() => openProjectModal(projectId), 300);
    }
};
