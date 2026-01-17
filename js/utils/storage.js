//LocalStorage
class StorageManager {
    constructor() {
        this.produitsKey = 'techstore_produits';
        this.categoriesKey = 'techstore_categories';
        this.initDefaultData();
    }

    initDefaultData() {
        // Initialiser les catégories par défaut si elles n'existent pas
        if (!this.getCategories() || this.getCategories().length === 0) {
            const defaultCategories = [
                { id: 1, nom: 'Ordinateurs', description: 'Ordinateurs portables et de bureau' },
                { id: 2, nom: 'Smartphones', description: 'Téléphones intelligents' },
                { id: 3, nom: 'Tablettes', description: 'Tablettes tactiles' },
                { id: 4, nom: 'Accessoires', description: 'Accessoires informatiques' }
            ];
            this.saveCategories(defaultCategories);
        }
    }

    // Gestion des produits
    getProduits() {
        const produits = localStorage.getItem(this.produitsKey);
        return produits ? JSON.parse(produits) : [];
    }

    saveProduits(produits) {
        localStorage.setItem(this.produitsKey, JSON.stringify(produits));
    }

    addProduit(produit) {
        const produits = this.getProduits();
        const newId = produits.length > 0 ? Math.max(...produits.map(p => p.id)) + 1 : 1;
        produit.id = newId;
        produit.dateCreation = new Date().toISOString();
        produits.push(produit);
        this.saveProduits(produits);
        return produit;
    }

    updateProduit(id, updatedProduit) {
        const produits = this.getProduits();
        const index = produits.findIndex(p => p.id === id);
        if (index !== -1) {
            produits[index] = { ...produits[index], ...updatedProduit };
            this.saveProduits(produits);
            return produits[index];
        }
        return null;
    }

    deleteProduit(id) {
        const produits = this.getProduits();
        const filtered = produits.filter(p => p.id !== id);
        this.saveProduits(filtered);
        return filtered.length < produits.length;
    }

    getProduitById(id) {
        const produits = this.getProduits();
        return produits.find(p => p.id === id);
    }

    // Gestion des catégories
    getCategories() {
        const categories = localStorage.getItem(this.categoriesKey);
        return categories ? JSON.parse(categories) : [];
    }

    saveCategories(categories) {
        localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
    }

    addCategorie(categorie) {
        const categories = this.getCategories();
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        categorie.id = newId;
        categories.push(categorie);
        this.saveCategories(categories);
        return categorie;
    }

    deleteCategorie(id) {
        const categories = this.getCategories();
        const filtered = categories.filter(c => c.id !== id);
        this.saveCategories(filtered);
        return filtered.length < categories.length;
    }

    getCategorieById(id) {
        const categories = this.getCategories();
        return categories.find(c => c.id === id);
    }

    // Statistiques
    getStats() {
        const produits = this.getProduits();
        const categories = this.getCategories();
        
        const totalProduits = produits.length;
        const stockTotal = produits.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
        const valeurStock = produits.reduce((sum, p) => sum + (parseFloat(p.prix) || 0) * (parseInt(p.stock) || 0), 0);
        const totalCategories = categories.length;

        return {
            totalProduits,
            stockTotal,
            valeurStock,
            totalCategories
        };
    }
}

window.storageManager = new StorageManager();

