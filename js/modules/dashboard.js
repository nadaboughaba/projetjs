// Module 3 : Dashboard & Statistiques
class Dashboard {
    constructor() {
        this.chartProduits = null;
        this.init();
    }

    init() {
        this.updateKPIs();
        this.setupAPI();
    }

    updateKPIs() {
        const stats = storageManager.getStats();
        
        document.getElementById('kpi-total-produits').textContent = stats.totalProduits;
        document.getElementById('kpi-stock-total').textContent = stats.stockTotal;
        document.getElementById('kpi-valeur-stock').textContent = stats.valeurStock.toFixed(2) + '€';
        document.getElementById('kpi-total-categories').textContent = stats.totalCategories;
    }

    updateChart() {
        const produits = storageManager.getProduits();
        const categories = storageManager.getCategories();
        
        // Compter les produits par catégorie
        const dataByCategorie = {};
        categories.forEach(cat => {
            dataByCategorie[cat.nom] = produits.filter(p => p.categorieId === cat.id).length;
        });

        // Produits sans catégorie
        const produitsSansCategorie = produits.filter(p => !p.categorieId || !storageManager.getCategorieById(p.categorieId)).length;
        if (produitsSansCategorie > 0) {
            dataByCategorie['Non catégorisé'] = produitsSansCategorie;
        }

        const ctx = document.getElementById('chartProduits');
        if (!ctx) return;

        // Détruire le graphique existant s'il existe
        if (this.chartProduits) {
            this.chartProduits.destroy();
        }

        this.chartProduits = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(dataByCategorie),
                datasets: [{
                    label: 'Nombre de produits',
                    data: Object.values(dataByCategorie),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    setupAPI() {
        const btnLoadAPI = document.getElementById('btnLoadAPI');
        if (btnLoadAPI) {
            btnLoadAPI.addEventListener('click', () => {
                this.loadFakeStoreAPI();
            });
        }
    }

    async loadFakeStoreAPI() {
        const btnLoadAPI = document.getElementById('btnLoadAPI');
        const apiData = document.getElementById('apiData');
        
        btnLoadAPI.disabled = true;
        btnLoadAPI.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Chargement...';
        apiData.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div></div>';

        try {
            const response = await fetch('https://fakestoreapi.com/products?limit=5');
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement de l\'API');
            }

            const products = await response.json();
            
            // Afficher les données
            let html = '<h5 class="mb-3">Produits de l\'API FakeStore</h5>';
            html += '<div class="row">';
            
            products.forEach(product => {
                html += `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="${product.image}" class="card-img-top" style="height: 200px; object-fit: contain;" alt="${product.title}">
                            <div class="card-body">
                                <h6 class="card-title">${product.title.substring(0, 50)}...</h6>
                                <p class="text-success fw-bold">${product.price}€</p>
                                <p class="text-muted"><small>Catégorie: ${product.category}</small></p>
                                <button class="btn btn-sm btn-primary btn-import-produit" 
                                        data-title="${this.escapeHtml(product.title)}"
                                        data-price="${product.price}"
                                        data-category="${product.category}"
                                        data-image="${product.image}"
                                        data-description="${this.escapeHtml(product.description)}">
                                    <i class="fas fa-download me-1"></i>Importer
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            apiData.innerHTML = html;

            // Ajouter les event listeners pour les boutons d'import
            document.querySelectorAll('.btn-import-produit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.importProduitFromAPI(e.target.closest('button'));
                });
            });

        } catch (error) {
            apiData.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Erreur lors du chargement de l'API: ${error.message}
                </div>
            `;
        } finally {
            btnLoadAPI.disabled = false;
            btnLoadAPI.innerHTML = '<i class="fas fa-download me-2"></i>Charger les données de l\'API';
        }
    }

    importProduitFromAPI(btn) {
        const title = btn.getAttribute('data-title');
        const price = btn.getAttribute('data-price');
        const category = btn.getAttribute('data-category');
        const image = btn.getAttribute('data-image');
        const description = btn.getAttribute('data-description');

        // Trouver ou créer la catégorie
        let categories = storageManager.getCategories();
        let categorie = categories.find(c => c.nom.toLowerCase() === category.toLowerCase());
        
        if (!categorie) {
            // Créer la catégorie si elle n'existe pas
            categorie = storageManager.addCategorie({
                nom: category.charAt(0).toUpperCase() + category.slice(1),
                description: 'Importée depuis l\'API'
            });
            
            // Recharger les catégories dans le formulaire produits
            if (typeof ProduitsManager !== 'undefined') {
                ProduitsManager.loadCategories();
            }
            if (typeof CategoriesManager !== 'undefined') {
                CategoriesManager.displayCategories();
            }
        }

        // Créer le produit
        const produit = storageManager.addProduit({
            nom: title,
            categorieId: categorie.id,
            prix: parseFloat(price),
            stock: Math.floor(Math.random() * 50) + 1, // Stock aléatoire
            image: image,
            description: description.substring(0, 200) // Limiter la description
        });

        btn.innerHTML = '<i class="fas fa-check me-1"></i>Importé!';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
        btn.disabled = true;

        // Mettre à jour les affichages
        if (typeof ProduitsManager !== 'undefined') {
            ProduitsManager.displayProduits();
        }
        this.updateKPIs();
        this.updateChart();

        // Afficher une alerte
        this.showAlert('Produit importé avec succès!', 'success');
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

// Initialiser le dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.Dashboard = new Dashboard();
    // Mettre à jour le graphique après un court délai pour s'assurer que Chart.js est chargé
    setTimeout(() => {
        Dashboard.updateChart();
    }, 100);
});

