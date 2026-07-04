
const express = require('express');
const router = express.Router();
const { checkout, getUserOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Secure all order routes with protection middleware
router.post('/checkout', protect, checkout);
router.get('/', protect, getUserOrders);

// ⚡ 7.4: Update Order Status Route
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;