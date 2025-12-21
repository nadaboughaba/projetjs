// Module 2 : Gestion des Catégories (CRUD simplifié)
class CategoriesManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayCategories();
    }

    setupEventListeners() {
        // Bouton ajouter catégorie
        document.getElementById('btnAddCategorie').addEventListener('click', () => {
            this.showForm();
        });

        // Bouton annuler
        document.getElementById('btnCancelCategorie').addEventListener('click', () => {
            this.hideForm();
        });

        // Soumission du formulaire
        document.getElementById('formCategorie').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategorie();
        });
    }

    showForm() {
        const formCard = document.getElementById('formCategorieCard');
        formCard.style.display = 'block';
        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    hideForm() {
        document.getElementById('formCategorieCard').style.display = 'none';
        document.getElementById('formCategorie').reset();
    }

    saveCategorie() {
        const nom = document.getElementById('categorieNom').value.trim();
        
        if (!nom) {
            document.getElementById('categorieNom').classList.add('is-invalid');
            return;
        }

        document.getElementById('categorieNom').classList.remove('is-invalid');

        const categorieData = {
            nom: nom,
            description: document.getElementById('categorieDescription').value.trim()
        };

        storageManager.addCategorie(categorieData);
        this.showAlert('Catégorie ajoutée avec succès!', 'success');
        this.hideForm();
        this.displayCategories();
        
        // Recharger les catégories dans le formulaire produits
        if (typeof ProduitsManager !== 'undefined') {
            ProduitsManager.loadCategories();
        }
    }

    displayCategories() {
        const categories = storageManager.getCategories();
        const container = document.getElementById('categoriesList');
        document.getElementById('categorieCount').textContent = categories.length;

        if (categories.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-info-circle me-2"></i>
                        Aucune catégorie. Ajoutez votre première catégorie!
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = categories.map(categorie => this.createCategorieCard(categorie)).join('');
        
        // Ajouter les event listeners pour les boutons de suppression
        this.attachCategorieEventListeners();
    }

    createCategorieCard(categorie) {
        // Compter les produits dans cette catégorie
        const produits = storageManager.getProduits();
        const produitCount = produits.filter(p => p.categorieId === categorie.id).length;

        const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-info', 'bg-danger'];
        const colorIndex = categorie.id % colors.length;

        return `
            <div class="col-md-4 col-lg-3">
                <div class="card categorie-card">
                    <div class="card-body text-center">
                        <div class="categorie-icon ${colors[colorIndex]} text-white mx-auto">
                            <i class="fas fa-tag"></i>
                        </div>
                        <h5 class="card-title mt-3">${this.escapeHtml(categorie.nom)}</h5>
                        ${categorie.description ? `<p class="card-text text-muted">${this.escapeHtml(categorie.description)}</p>` : ''}
                        <p class="text-muted"><small>${produitCount} produit${produitCount > 1 ? 's' : ''}</small></p>
                        <button class="btn btn-sm btn-danger btn-delete-categorie" data-id="${categorie.id}">
                            <i class="fas fa-trash me-1"></i>Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachCategorieEventListeners() {
        document.querySelectorAll('.btn-delete-categorie').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.deleteCategorie(id);
            });
        });
    }

    deleteCategorie(id) {
        const categorie = storageManager.getCategorieById(id);
        if (!categorie) return;

        // Vérifier si des produits utilisent cette catégorie
        const produits = storageManager.getProduits();
        const produitsUsingCategorie = produits.filter(p => p.categorieId === id);

        if (produitsUsingCategorie.length > 0) {
            alert(`Impossible de supprimer cette catégorie car ${produitsUsingCategorie.length} produit(s) l'utilise(nt).`);
            return;
        }

        if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categorie.nom}" ?`)) {
            if (storageManager.deleteCategorie(id)) {
                this.showAlert('Catégorie supprimée avec succès!', 'success');
                this.displayCategories();
                
                // Recharger les catégories dans le formulaire produits
                if (typeof ProduitsManager !== 'undefined') {
                    ProduitsManager.loadCategories();
                }
            } else {
                this.showAlert('Erreur lors de la suppression', 'danger');
            }
        }
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialiser le gestionnaire de catégories
document.addEventListener('DOMContentLoaded', () => {
    window.CategoriesManager = new CategoriesManager();
});

