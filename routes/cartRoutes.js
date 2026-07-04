const express = require('express');
const router = express.Router();
const { 
    addToCart, 
    getCart, 
    removeItemFromCart, 
    clearCart 
} = require('../controllers/cartController');

// @route   POST /api/cart
router.post('/', addToCart);

// @route   GET /api/cart/:userId
router.get('/:userId', getCart);

// @route   DELETE /api/cart/remove
router.delete('/remove', removeItemFromCart);

// @route   DELETE /api/cart/clear/:userId
router.delete('/clear/:userId', clearCart);

module.exports = router;