// Level 4 Web Development Project - Backend API
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

// Load environment config
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Mount Routing Files
app.use('/api/products', productRoutes);

const PORT = process.env.PORT ||5000;
const errorHandler = require('./middleware/errorMiddleware');

app.use(errorHandler);

app.use('/api/cart', require('./routes/cartRoutes'));

// Mount Routing Files
app.use('/api/products', productRoutes);
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes')); // 👈 Add this line here!

app.listen(PORT, () => {
  console.log(`Server running in environment mode on port: ${PORT}`);
});

