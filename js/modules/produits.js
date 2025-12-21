// Module 1 : Gestion des Produits (CRUD complet)
class ProduitsManager {
    constructor() {
        this.currentProduit = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCategories();
        this.displayProduits();
    }

    setupEventListeners() {
        // Bouton ajouter produit
        document.getElementById('btnAddProduit').addEventListener('click', () => {
            this.showForm();
        });

        // Bouton annuler
        document.getElementById('btnCancelProduit').addEventListener('click', () => {
            this.hideForm();
        });

        // Soumission du formulaire
        document.getElementById('formProduit').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduit();
        });

        // Recherche
        document.getElementById('searchProduit').addEventListener('input', (e) => {
            this.displayProduits(e.target.value);
        });

        // Tri
        document.getElementById('sortProduit').addEventListener('change', (e) => {
            this.displayProduits();
        });
    }

    loadCategories() {
        const categories = storageManager.getCategories();
        const select = document.getElementById('produitCategorie');
        select.innerHTML = '<option value="">Sélectionner une catégorie</option>';
        
        categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie.id;
            option.textContent = categorie.nom;
            select.appendChild(option);
        });
    }

    showForm(produit = null) {
        const formCard = document.getElementById('formProduitCard');
        const formTitle = document.getElementById('formProduitTitle');
        const form = document.getElementById('formProduit');

        if (produit) {
            // Mode édition
            this.currentProduit = produit;
            formTitle.textContent = 'Modifier le Produit';
            document.getElementById('produitId').value = produit.id;
            document.getElementById('produitNom').value = produit.nom || '';
            document.getElementById('produitCategorie').value = produit.categorieId || '';
            document.getElementById('produitPrix').value = produit.prix || '';
            document.getElementById('produitStock').value = produit.stock || '';
            document.getElementById('produitImage').value = produit.image || '';
            document.getElementById('produitDescription').value = produit.description || '';
        } else {
            // Mode ajout
            this.currentProduit = null;
            formTitle.textContent = 'Ajouter un Produit';
            form.reset();
            document.getElementById('produitId').value = '';
        }

        formCard.style.display = 'block';
        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    hideForm() {
        document.getElementById('formProduitCard').style.display = 'none';
        document.getElementById('formProduit').reset();
        this.currentProduit = null;
    }

    validateForm() {
        const form = document.getElementById('formProduit');
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        // Validation du prix
        const prix = parseFloat(document.getElementById('produitPrix').value);
        if (isNaN(prix) || prix < 0) {
            document.getElementById('produitPrix').classList.add('is-invalid');
            isValid = false;
        }

        // Validation du stock
        const stock = parseInt(document.getElementById('produitStock').value);
        if (isNaN(stock) || stock < 0) {
            document.getElementById('produitStock').classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    saveProduit() {
        if (!this.validateForm()) {
            return;
        }

        const produitData = {
            nom: document.getElementById('produitNom').value.trim(),
            categorieId: parseInt(document.getElementById('produitCategorie').value),
            prix: parseFloat(document.getElementById('produitPrix').value),
            stock: parseInt(document.getElementById('produitStock').value),
            image: document.getElementById('produitImage').value.trim(),
            description: document.getElementById('produitDescription').value.trim()
        };

        if (this.currentProduit) {
            // Mise à jour
            storageManager.updateProduit(this.currentProduit.id, produitData);
            this.showAlert('Produit modifié avec succès!', 'success');
        } else {
            // Ajout
            storageManager.addProduit(produitData);
            this.showAlert('Produit ajouté avec succès!', 'success');
        }

        this.hideForm();
        this.displayProduits();
        
        // Mettre à jour le dashboard si visible
        if (typeof Dashboard !== 'undefined') {
            Dashboard.updateKPIs();
        }
    }

    displayProduits(searchTerm = '') {
        let produits = storageManager.getProduits();
        
        // Recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            produits = produits.filter(p => 
                p.nom.toLowerCase().includes(term) ||
                (p.description && p.description.toLowerCase().includes(term))
            );
        }

        // Tri
        const sortValue = document.getElementById('sortProduit').value;
        produits = this.sortProduits(produits, sortValue);

        // Affichage
        const container = document.getElementById('produitsList');
        document.getElementById('produitCount').textContent = produits.length;

        if (produits.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-info-circle me-2"></i>
                        Aucun produit trouvé. Ajoutez votre premier produit!
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = produits.map(produit => this.createProduitCard(produit)).join('');
        
        // Ajouter les event listeners pour les boutons
        this.attachProduitEventListeners();
    }

    sortProduits(produits, sortValue) {
        const [field, order] = sortValue.split('-');
        
        return produits.sort((a, b) => {
            let aVal, bVal;
            
            switch(field) {
                case 'nom':
                    aVal = a.nom.toLowerCase();
                    bVal = b.nom.toLowerCase();
                    return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                case 'prix':
                    aVal = parseFloat(a.prix) || 0;
                    bVal = parseFloat(b.prix) || 0;
                    return order === 'asc' ? aVal - bVal : bVal - aVal;
                case 'stock':
                    aVal = parseInt(a.stock) || 0;
                    bVal = parseInt(b.stock) || 0;
                    return order === 'asc' ? aVal - bVal : bVal - aVal;
                default:
                    return 0;
            }
        });
    }

    createProduitCard(produit) {
        const categorie = storageManager.getCategorieById(produit.categorieId);
        const categorieNom = categorie ? categorie.nom : 'Non catégorisé';
        
        const stockClass = produit.stock === 0 ? 'out-of-stock' : 
                          produit.stock < 10 ? 'low-stock' : 'in-stock';
        const stockText = produit.stock === 0 ? 'Rupture' : 
                         produit.stock < 10 ? 'Stock faible' : 'En stock';

        return `
            <div class="col-md-4 col-lg-3">
                <div class="card produit-card">
                    ${produit.image ? 
                        `<img src="${produit.image}" class="produit-image" alt="${produit.nom}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : 
                        ''
                    }
                    <div class="produit-image" style="display: ${produit.image ? 'none' : 'flex'};">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${this.escapeHtml(produit.nom)}</h5>
                        <p class="card-text">
                            <span class="badge bg-secondary">${this.escapeHtml(categorieNom)}</span>
                        </p>
                        <div class="produit-price">${parseFloat(produit.prix).toFixed(2)}€</div>
                        <p class="produit-stock ${stockClass}">
                            <i class="fas fa-${produit.stock === 0 ? 'times' : 'check'}-circle me-1"></i>
                            ${produit.stock} unités - ${stockText}
                        </p>
                        <div class="d-flex gap-2 mt-3">
                            <button class="btn btn-sm btn-info btn-view-produit" data-id="${produit.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning btn-edit-produit" data-id="${produit.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-delete-produit" data-id="${produit.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachProduitEventListeners() {
        // Voir les détails
        document.querySelectorAll('.btn-view-produit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.showProduitDetail(id);
            });
        });

        // Modifier
        document.querySelectorAll('.btn-edit-produit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                const produit = storageManager.getProduitById(id);
                if (produit) {
                    this.showForm(produit);
                }
            });
        });

        // Supprimer
        document.querySelectorAll('.btn-delete-produit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.deleteProduit(id);
            });
        });
    }

    showProduitDetail(id) {
        const produit = storageManager.getProduitById(id);
        if (!produit) return;

        const categorie = storageManager.getCategorieById(produit.categorieId);
        const modalBody = document.getElementById('modalProduitDetailBody');
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    ${produit.image ? 
                        `<img src="${produit.image}" class="img-fluid rounded" alt="${produit.nom}" onerror="this.style.display='none'; document.getElementById('imgPlaceholder').style.display='flex';">` : 
                        ''
                    }
                    <div id="imgPlaceholder" class="produit-image rounded" style="display: ${produit.image ? 'none' : 'flex'}; height: 300px;">
                        <i class="fas fa-box" style="font-size: 4rem;"></i>
                    </div>
                </div>
                <div class="col-md-8">
                    <h3>${this.escapeHtml(produit.nom)}</h3>
                    <p class="text-muted">
                        <span class="badge bg-primary">${this.escapeHtml(categorie ? categorie.nom : 'Non catégorisé')}</span>
                    </p>
                    <hr>
                    <h4 class="text-success">${parseFloat(produit.prix).toFixed(2)}€</h4>
                    <p><strong>Stock:</strong> ${produit.stock} unités</p>
                    ${produit.description ? `<p><strong>Description:</strong><br>${this.escapeHtml(produit.description)}</p>` : ''}
                    ${produit.dateCreation ? `<p class="text-muted"><small>Créé le: ${new Date(produit.dateCreation).toLocaleDateString('fr-FR')}</small></p>` : ''}
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('modalProduitDetail'));
        modal.show();
    }

    deleteProduit(id) {
        const produit = storageManager.getProduitById(id);
        if (!produit) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${produit.nom}" ?`)) {
            if (storageManager.deleteProduit(id)) {
                this.showAlert('Produit supprimé avec succès!', 'success');
                this.displayProduits();
                
                // Mettre à jour le dashboard
                if (typeof Dashboard !== 'undefined') {
                    Dashboard.updateKPIs();
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

// Initialiser le gestionnaire de produits
document.addEventListener('DOMContentLoaded', () => {
    window.ProduitsManager = new ProduitsManager();
});

