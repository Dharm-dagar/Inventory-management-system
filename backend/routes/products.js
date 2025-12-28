const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes (anyone can view products)
router.get('/', productController.getAllProducts);
router.get('/available', productController.getAvailableStock);
router.get('/:id', productController.getProduct);

// Protected routes (require authentication)
router.get('/alerts/low-stock', verifyToken, productController.getLowStockAlerts);
router.get('/alerts/low-demand', verifyToken, productController.getLowDemandProducts);
router.get('/analytics/summary', verifyToken, productController.getAnalytics);

// Admin only routes
router.post('/', verifyToken, isAdmin, productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;