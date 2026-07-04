const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to provide a fallback dummy userId if none is passed in the request
const getFallbackUserId = (id) => id || "6686b0000000000000000001";

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @desc    Add item to cart or update quantity
// @route   POST /api/cart
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; // ⚡ Read directly from the authenticated user token!

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += Number(quantity);
        } else {
            cart.items.push({ productId, quantity: Number(quantity) });
        }

        let total = 0;
        for (let item of cart.items) {
            const itemProduct = await Product.findById(item.productId);
            if (itemProduct) {
                total += itemProduct.price * item.quantity;
            }
        }
        cart.totalPrice = total;

        await cart.save();
        res.status(200).json({ success: true, message: 'Cart updated successfully', data: cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's cart with populated product details
// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user.id; // ⚡ No more url path params needed!

        const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price image');
        if (!cart) {
            return res.status(404).json({ message: 'No cart found for this user' });
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove a single item from the cart
// @route   DELETE /api/cart/remove
// @desc    Remove a single item from the cart
// @route   DELETE /api/cart/remove
exports.removeItemFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; // ⚡ Read directly from the token!

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Filter out the item to remove it
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Recalculate total price robustly using the database loop method
        let total = 0;
        for (let item of cart.items) {
            const itemProduct = await Product.findById(item.productId);
            if (itemProduct) {
                total += itemProduct.price * item.quantity;
            }
        }
        cart.totalPrice = total;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Manually clear the entire cart
// @route   DELETE /api/cart/clear
exports.clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id; // ⚡ Read directly from the token!

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Reset items and price
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared completely",
            data: cart
        });
    } catch (error) {
        next(error);
    }
};