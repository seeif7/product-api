# Level 4 Product Ecosystem API - Backend Implementation Review

# Level 4 Product Ecosystem API - Backend Review

I built this backend REST API using Node.js, Express, postman, and MongoDB (via Mongoose) to handle user onboarding, product catalogs, shopping carts, and real-time inventory checks during checkout. The codebase uses a clean MVC structure.

---

## What I Built

### 1. Structure & Server Pipeline
* I split all core routing into clean files inside the `/routes` folder to keep the main entry point organized.
* I cleaned up the middleware pipeline in `server.js` to fix bugs with JSON parsing, route ordering, and added a global async error handler at the end.

### 2. Database & Relationships
* I created Mongoose schemas for Categories, Products, Carts, and Orders with strict data validation.
* I set up `.populate()` queries so product details (like name and price) automatically pull into the cart and order histories instead of just showing raw database IDs.

### 3. Shopping Cart Logic
* I wrote cart controllers that dynamically update total quantities and calculate prices on the fly.
* For security, I forced the cart to read the user's identity straight from their verified JWT token instead of accepting loose user IDs in the request body.

### 4. Inventory-Aware Checkout
* Before finalizing an order, my checkout function checks the database to verify the store has enough stock.
* If stock is available, it deducts the items from the Product inventory, clears out the user's active cart, and saves the new order details[cite: 1].
* I added a `PUT` endpoint to easily transition order tracking states (like changing an order status from Pending to Shipped)[cite: 1].

---

## Getting Started

### Installation & Environment
1. Run `npm install` in your terminal to grab dependencies[cite: 1].
2. Set up a `.env` file in the root directory
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_token_key

API Documentation end points

POST /api/auth/register & /login - User signup and token generation

GET /api/categories & /api/products - Browse catalog with active filtering[cite: 1]

GET /api/cart - View my active cart and grand total (Token Required)[cite: 1]

POST /api/cart - Add or update item quantities (Token Required)[cite: 1]

DELETE /api/cart/remove & /clear - Modify or wipe the cart array (Token Required)[cite: 1]

POST /api/orders/checkout - Convert cart to order + stock validation (Token Required)[cite: 1]

GET /api/orders - View my personal order checkout history (Token Required)[cite: 1]

PUT /api/orders/:id/status - Update an order's status tracking tag (Admin/Token Required)

my GitHub repo link

* https://github.com/seeif7/product-api 
