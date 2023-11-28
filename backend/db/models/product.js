const client = require('../client');

async function createProduct({ product, description, size, color, price, inventory, img }) {
    try {
        const { rows: [newProduct] } = await client.query(`
        INSERT INTO product(product, description, size, color, price, inventory, img) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, product, description, size, color, price, inventory, img`, [product, description, size, color, price, inventory, img]);

        return newProduct;
    
    } catch (error) {
        throw error;
    }
}

async function getProduct() {
    try {
        const { rows: product } = await client.query(`
            SELECT id, product, description, size, color, price, inventory, img FROM product
            `);

        return product;

    } catch (error) {
        throw error;
    }
}

async function deleteProduct(id) {
    try {
        console.log(id)
        const { rows } = await client.query(`
        DELETE from product WHERE id = $1`, [+id])

    } catch (error) {
        throw error;
    }
}

async function updateProduct(id, { product, description, size, color, price, inventory, img }) {
    try {
        const { rows: updatedProduct } = await client.query(
            `
        UPDATE product
        SET
          product = $2,
          description = $3,
          size = $4,
          color = $5,
          price = $6,
          inventory = $7,
          img = $8
        WHERE
          id = $1
        RETURNING *
        `,
            [id, product, description, size, color, price, inventory, img]
        );

        if (updatedProduct.length === 0) {
            throw new Error(`product with ID ${id} not found`);
        }

        return updatedProduct[0];
    } catch (error) {
        throw error;
    }
}



module.exports = {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
}