const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Checkout cart and create an order
// @route   POST /api/orders/checkout
exports.checkout = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 1. Fetch user's cart and populate product details to check inventory
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // 2. Validate stock availability for all items first
        for (let item of cart.items) {
            const product = item.productId; // This is the populated product document
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} items left.` 
                });
            }
        }

        // 3. Deduct stock from the Product collection
        for (let item of cart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.quantity } // Decrement stock quantity
            });
        }

        // 4. Create the final Order document
        const order = new Order({
            userId: cart.userId,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity
            })),
            totalAmount: cart.totalPrice
        });
        await order.save();

        // 5. Reset the user's cart back to empty
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders
exports.getUserOrders = async (req, res, next) => {
    try {
        // ⚡ Read directly from the verified token instead of req.params
        const userId = req.user.id; 

        // Find all orders matching this specific user
        const orders = await Order.find({ userId }).populate('items.productId', 'name price');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Update order status (Admin feature)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        // Validate the incoming status value
        const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status value' });
        }

        // Find the order by ID and update its status
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order
        });
    } catch (error) {
        next(error);
    }
};