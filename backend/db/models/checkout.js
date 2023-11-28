const client = require('../client');

// Put id, product, size, price, quantity also would like total
async function createCheckout(userId, productsId, quantity) {
    try {
        const { rows: product } = await client.query(`
        INSERT INTO checkout(userId, productsId, quantity) VALUES($1, $2, $3)
        RETURNING *; `, [userId, productsId, quantity]);
        return product;       
        
    } catch(error) {
        throw error;
    }
}

async function getCheckout() {
    try {
        const { rows: checkout } = await client.query(`
            SELECT id, userId, productsId, quantity FROM checkout
            `);
        
            return checkout;
        
    } catch(error) {
        throw error;
    }
}
// after checkout, drop inventory number in product data base based on product bought

async function inventoryCheck(id, quantity) {
    try {
        const { rows: checkInventory } = await client.query(`
            SELECT id, inventory from product where id = $1 
            `,[id]);

            if(checkInventory.length === 0) {
                return false;
            }
            
            if (checkInventory[0].inventory >= quantity) {
                return checkInventory[0].inventory - quantity;
            }                

            return false
    } catch(error) {
        throw err;
    }

}

async function updateInventory(productId, inventoryNumber) {
    try {
        const { row: inventoryUpdate } = await client.query(`
        update product set inventory = $1 where id = $2`,[inventoryNumber, productId]);

    } catch(err) {
        throw err;
    }

}


module.exports = {
    createCheckout,
    inventoryCheck,
    getCheckout, 
    updateInventory
}