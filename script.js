/**
 * Cafeteria Project Core Script
 */

const App = {

    init() {
        this.highlightNavbar();
        if (document.querySelector('.side-navbar')) {
            this.initDashboard();
        }
        this.showMenu();
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
    },

    showMenu() {
        // Select all cards in the menu overview
        const menuCards = document.querySelectorAll('.menu-card .card');
        const subSections = document.querySelectorAll('#menu section[id$="-items"]');

        // Hide all sub-sections initially
        subSections.forEach(section => section.style.display = 'none');
        
        menuCards.forEach(card => {
            card.addEventListener('click', () => {
                // 1. Hide all open sub-sections first
                subSections.forEach(section => section.style.display = 'none');
                
                // 2. Target ID based on card ID (e.g., "breakfast" -> "breakfast-items")
                const targetId = `${card.id}-items`;
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.style.display = 'block';
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
};



document.addEventListener('DOMContentLoaded', () => App.init());