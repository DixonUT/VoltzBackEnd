const express = require('express');
const { requireAuth } = require('../middleware/auth');
const client = require('../db/client');
const router = express.Router();

// GET endpoint to get items in the user's cart
router.get('/', requireAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        // Assuming you have a 'checkout' table and a 'product' table
        const checkoutItems = await client.query(`
            SELECT * FROM checkout
            JOIN product ON checkout.productId = product.id
            WHERE checkout.userid = $1
        `, [userId]);

        res.json(checkoutItems.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const cartItems = req.body;
  
    try {
        // Delete existing cart items for the user
        await client.query('DELETE FROM checkout WHERE userid = $1', [userId]);

        // Insert new cart items
        const values = cartItems.map((item) => [userId, item.productId, item.quantity]);

        for (let v of values) {
            await client.query(
                'INSERT INTO checkout (userid, productId, quantity) VALUES ($1, $2, $3)',
                v
            );
        }


        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
