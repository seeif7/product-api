const express = require('express');
const router = express.Router();
const { checkout, getUserOrders } = require('../controllers/orderController');

// @route   POST /api/orders/checkout
router.post('/checkout', checkout);

// @route   GET /api/orders/:userId
router.get('/:userId', getUserOrders);

module.exports = router;