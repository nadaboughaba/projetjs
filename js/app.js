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
        // Navigation depuis la sidebar
        const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Navigation depuis la navbar
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
        // Masquer toutes les sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section demandée
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Mettre à jour les liens actifs
        this.updateActiveLinks(sectionName);

        // Recharger les données si nécessaire
        this.loadSectionData(sectionName);
    }

    updateActiveLinks(activeSection) {
        // Mettre à jour la sidebar
        const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        sidebarLinks.forEach(link => {
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mettre à jour la navbar
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
                // Les statistiques seront chargées à la demande
                break;
        }
    }

    loadInitialSection() {
        // Charger la section dashboard par défaut
        this.showSection('dashboard');
    }
}

// Initialiser l'application au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

