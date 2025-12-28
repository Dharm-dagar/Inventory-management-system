const Product = require('../models/Product');

// In-memory storage (replace with database in production)
let products = [
  {
    id: 1,
    name: 'Vitrified Tiles 600x600mm',
    sku: 'VT-600-001',
    category: 'Flooring',
    currentStock: 450,
    minStock: 200,
    maxStock: 1000,
    unitPrice: 450,
    lastRestocked: '2024-12-20',
    totalSold: 2340,
    damaged: 12,
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'LED Panel Light 2x2',
    sku: 'LED-2X2-002',
    category: 'Lighting',
    currentStock: 85,
    minStock: 100,
    maxStock: 500,
    unitPrice: 1200,
    lastRestocked: '2024-12-15',
    totalSold: 456,
    damaged: 3,
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Laminate Sheet Glossy',
    sku: 'LAM-GL-003',
    category: 'Laminates',
    currentStock: 750,
    minStock: 300,
    maxStock: 1200,
    unitPrice: 850,
    lastRestocked: '2024-12-22',
    totalSold: 1890,
    damaged: 8,
    createdAt: new Date()
  }
];

// Get all products
exports.getAllProducts = (req, res) => {
  try {
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single product
exports.getProduct = (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create product
exports.createProduct = (req, res) => {
  try {
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...req.body,
      totalSold: 0,
      lastRestocked: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    };
    
    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update product
exports.updateProduct = (req, res) => {
  try {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    products[index] = { ...products[index], ...req.body, updatedAt: new Date() };
    res.json({ success: true, data: products[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete product
exports.deleteProduct = (req, res) => {
  try {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const deleted = products.splice(index, 1);
    res.json({ success: true, data: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get low stock alerts
exports.getLowStockAlerts = (req, res) => {
  try {
    const lowStock = products.filter(p => p.currentStock <= p.minStock);
    res.json({ success: true, data: lowStock, count: lowStock.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get analytics
exports.getAnalytics = (req, res) => {
  try {
    const analytics = {
      totalProducts: products.length,
      lowStockCount: products.filter(p => p.currentStock <= p.minStock).length,
      overstockCount: products.filter(p => (p.currentStock / p.maxStock) > 0.8).length,
      totalInventoryValue: products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0),
      damagedValue: products.reduce((sum, p) => sum + (p.damaged * p.unitPrice), 0),
      topPerformers: products.sort((a, b) => b.totalSold - a.totalSold).slice(0, 5)
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export products data for orders module
exports.getProductsData = () => products;

// Get low demand products (not sold in last 30 days)
exports.getLowDemandProducts = (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lowDemandProducts = products.filter(p => {
      if (!p.lastSoldDate) return true; // Never sold
      const lastSold = new Date(p.lastSoldDate);
      return lastSold < thirtyDaysAgo;
    });

    res.json({ 
      success: true, 
      data: lowDemandProducts,
      count: lowDemandProducts.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get available stock (total - damaged)
exports.getAvailableStock = (req, res) => {
  try {
    const productsWithAvailable = products.map(p => ({
      ...p,
      availableStock: p.currentStock - (p.damaged || 0),
      damagedStock: p.damaged || 0
    }));

    res.json({ success: true, data: productsWithAvailable });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};