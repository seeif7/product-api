// Level 4 Web Development Project - Backend API
// Product API Backend System - Main Server File

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment config
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Body Parser Middleware (Crucial for reading req.body)
app.use(express.json());

// 1. Mount All Routing Files 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes')); 

// 2. Global Error Handler Middleware (MUST BE PLACED LAST IN THE PIPELINE)
app.use(errorHandler);

// 3. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port: ${PORT}`);
});