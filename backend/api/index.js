require('dotenv').config();
const express = require('express');
const { getProduct } = require('../db/models/product');
const adminRouter = require("./admin")
const authRouter = require("./auth")
const cartRouter = require("./cart")
const { requireAuth } = require("../middleware/auth")

const client = require('../db/client');

const router = express.Router();

router.use("/admin", adminRouter)
router.use("/auth", authRouter)
router.use("/cart", cartRouter)

router.get('/products/', async (req, res) => {
    try {
        const products = await getProduct();
        res.json(products);
    } catch (err) {
        throw err;
    }
})


router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await client.query('SELECT * FROM product WHERE id = $1', [id]);
        const product = result.rows[0];

        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/checkout', requireAuth, async (req, res) => {
    try {
        const items = req.body;
        const user = req.user;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty items array in the request body' });
        }

        const cart = {
            purchases: [],
            userId: user.id
        }

        for (const item of items) {
            const result = await client.query('SELECT * FROM product WHERE id = $1', [item.productid]);
            const product = result.rows[0];

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productid} not found` });
            }

            // Add the purchase details to the cart
            cart.purchases.push({
                productid: item.productid,
                quantity: item.quantity,
            });
        }

        // Save the cart to the database
        const cartResult = await client.query('INSERT INTO orders (userId, status) VALUES ($1, $2) RETURNING *', [cart.userId, 'Pending']);
        const orderId = cartResult.rows[0].id;

        for (const purchase of cart.purchases) {
            await client.query('INSERT INTO order_items (orderId, productid, quantity) VALUES ($1, $2, $3)', [orderId, purchase.productid, purchase.quantity]);
        }
        // Clear cart
        await client.query('DELETE FROM checkout WHERE userid = $1', [cart.userId]);

        res.status(200).json({ message: 'Purchase successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/checkout-history', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch orders for the user
        const ordersResult = await client.query('SELECT * FROM orders WHERE userId = $1', [userId]);
        const purchaseHistory = ordersResult.rows;

        // For each order, fetch associated order items with product details
        for (const order of purchaseHistory) {
            const orderItemsResult = await client.query(`
                SELECT order_items.id, order_items.quantity, product.product AS name, product.size, product.color, product.price
                FROM order_items
                JOIN product ON order_items.productid = product.id
                WHERE order_items.orderId = $1
            `, [order.id]);

            // Assign the order items to the purchases property of the order
            order.purchases = orderItemsResult.rows;
        }

        res.json(purchaseHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await client.query(
            'SELECT id, firstName, lastName, username, isadmin FROM users WHERE id = $1',
            [userId]
        );

        if (profile.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(profile.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router