const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// In-memory orders storage
let orders = [];

// Get all orders (admin only)
router.get('/', verifyToken, (req, res) => {
  try {
    if (req.user.role === 'admin') {
      res.json({ success: true, data: orders });
    } else {
      // Users see only their orders
      const userOrders = orders.filter(o => o.userId === req.user.id);
      res.json({ success: true, data: userOrders });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new order (user purchases product)
router.post('/', verifyToken, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const productController = require('../controllers/productController');
    
    // Get product data
    const products = productController.getProductsData();
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Calculate available stock (total - damaged)
    const availableStock = product.currentStock - (product.damaged || 0);
    
    if (availableStock < quantity) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient stock. Available: ${availableStock} units` 
      });
    }

    // Create order
    const order = {
      id: orders.length + 1,
      userId: req.user.id,
      username: req.user.username,
      productId: product.id,
      productName: product.name,
      quantity: parseInt(quantity),
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * parseInt(quantity),
      status: 'completed',
      orderDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(order);

    // Update product stock
    product.currentStock -= parseInt(quantity);
    product.totalSold = (product.totalSold || 0) + parseInt(quantity);
    product.lastSoldDate = new Date().toISOString();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', verifyToken, (req, res) => {
  try {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;