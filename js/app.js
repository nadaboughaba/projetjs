// Application principale - Navigation SPA
class App {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadInitialSection();
    }

    setupNavigation() {
        // Navigation du sidebar
        const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Navigation navbar
        const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navbarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    showSection(sectionName) {
        // Masquer sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        this.updateActiveLinks(sectionName);

        this.loadSectionData(sectionName);
    }

    updateActiveLinks(activeSection) {
        const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        sidebarLinks.forEach(link => {
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navbarLinks.forEach(link => {
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    loadSectionData(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                if (typeof Dashboard !== 'undefined') {
                    Dashboard.updateKPIs();
                    Dashboard.updateChart();
                }
                break;
            case 'produits':
                if (typeof ProduitsManager !== 'undefined') {
                    ProduitsManager.displayProduits();
                }
                break;
            case 'categories':
                if (typeof CategoriesManager !== 'undefined') {
                    CategoriesManager.displayCategories();
                }
                break;
            case 'statistiques':
                break;
        }
    }

    loadInitialSection() {
        this.showSection('dashboard');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

