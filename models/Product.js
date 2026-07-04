const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a product price'],
        min: [0, 'Price must be a positive number']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);