const express = require('express');
const { getUsers, deleteUsers, updateUsers } = require('../db/models/users');
const { createProduct, getProduct, updateProduct, deleteProduct } = require('../db/models/product');
const client = require('../db/client');
const { requireAuth } = require('../middleware/auth');



const router = express.Router();

router.get('/users', requireAuth, async (req, res) => {
    try {
        const allUsers = await getUsers();
        res.json(allUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/users/:id', requireAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const userDelete = await deleteUsers(id);
        res.json({ status: 'successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.patch('/users/:id', requireAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const userObj = req.body;
        const userUpdate = await updateUsers(id, userObj);
        res.json(userUpdate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create product
router.post('/product', requireAuth, async (req, res) => {
    try {
        const { product, description, size, color, price, inventory, img } = req.body;
        console.log(req.body)
        const newProduct = await createProduct({ product, description, size, color, price, inventory, img });
        res.json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get All product
router.get('/product', requireAuth, async (req, res) => {
    try {
        const product = await getProduct();
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update product
router.patch('/product/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await updateProduct(id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete product
router.delete('/product/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await deleteProduct(id);
        res.json({ message: 'product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/orders', requireAuth, async (req, res) => {
    try {
        const result = await client.query(`
        SELECT orders.id, orders.userId, users.username, orders.orderDate, orders.status
        FROM orders
        INNER JOIN users ON orders.userId = users.id
      `);

        const orders = result.rows;
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.patch('/orders/:id', requireAuth, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required in the request body' });
        }

        const result = await client.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, orderId]
        );

        const updatedOrder = result.rows[0];
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router