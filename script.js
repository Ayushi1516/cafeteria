/**
 * Cafeteria Project Core Script
 */
const App = {
    init() {
        this.highlightNavbar();
        if (document.querySelector('.side-navbar')) {
            this.initDashboard();
        }
    },

    highlightNavbar() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.navbar a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === currentPath);
        });
    },

    initDashboard() {
        const syncSidebar = () => {
            const currentHash = window.location.hash || '#menu';
            this.updateActiveLinks(currentHash);
            this.toggleSections(currentHash);
        };

        window.addEventListener('hashchange', syncSidebar);
        syncSidebar(); // Initial run
    },

    updateActiveLinks(hash) {
        document.querySelectorAll('.side-navbar a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });
    },

    toggleSections(hash) {
        document.querySelectorAll('.dashboard-wrapper > section').forEach(section => {
            section.style.display = (`#${section.id}` === hash) ? 'block' : 'none';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());