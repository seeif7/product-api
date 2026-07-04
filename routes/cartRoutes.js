const express = require('express');
const router = express.Router();
const { 
    addToCart, 
    getCart, 
    removeItemFromCart, 
    clearCart 
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Secure all cart routes below with token authentication
router.use(protect); 

// Handles: POST /api/cart (Add/Update item) & GET /api/cart (Fetch user cart)
router.route('/')
    .post(addToCart)
    .get(getCart);

// Handles: DELETE /api/cart/remove (Remove a single product)
router.delete('/remove', removeItemFromCart);

// Handles: DELETE /api/cart/clear (Clear the entire cart)
router.delete('/clear', clearCart);

module.exports = router;