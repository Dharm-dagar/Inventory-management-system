class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.sku = data.sku;
    this.category = data.category;
    this.currentStock = data.currentStock;
    this.minStock = data.minStock;
    this.maxStock = data.maxStock;
    this.unitPrice = data.unitPrice;
    this.damaged = data.damaged || 0;
    this.totalSold = data.totalSold || 0;
    this.lastRestocked = data.lastRestocked;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt;
  }

  getStockStatus() {
    const stockPercent = (this.currentStock / this.maxStock) * 100;
    if (this.currentStock <= this.minStock) return 'LOW_STOCK';
    if (stockPercent > 80) return 'OVERSTOCK';
    return 'HEALTHY';
  }

  getTotalValue() {
    return this.currentStock * this.unitPrice;
  }

  getDamagedValue() {
    return this.damaged * this.unitPrice;
  }
}

module.exports = Product;

