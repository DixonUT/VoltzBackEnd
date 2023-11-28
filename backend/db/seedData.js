const client = require('./client');
const { createUser, getUser } = require('./models/users');
const { createProduct } = require('./models/product');

async function dropTables() {
    try {
        await client.query(`
            drop table if exists checkout;
            DROP TABLE IF EXISTS order_items;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS product;
            DROP TABLE IF EXISTS users;
        `);
    } catch (error) {
        throw error;
    }
}

async function createTables() {
    try {
        console.log('Starting to build tables...');

        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                firstName VARCHAR(200),
                lastName VARCHAR (200),
                username VARCHAR(200) UNIQUE NOT NULL,
                password VARCHAR(200) NOT NULL,
                isadmin BOOLEAN DEFAULT false
            );
        `);

        await client.query(`
            CREATE TABLE product (
                id SERIAL PRIMARY KEY,
                product VARCHAR(300),
                description TEXT,
                size VARCHAR(20),
                color VARCHAR(20),
                price DECIMAL(5,2),
                inventory INTEGER,
                img VARCHAR(200)
            );
        `);

        await client.query(`
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                userId INTEGER REFERENCES users(id),
                orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'Pending'
            );
        `);

        await client.query(`
            CREATE TABLE order_items (
                id SERIAL PRIMARY KEY,
                orderId INTEGER REFERENCES orders(id),
                productId INTEGER REFERENCES product(id),
                quantity INTEGER
            );
        `);
        await client.query(`
        CREATE TABLE checkout (
            id SERIAL PRIMARY KEY,
            userId INTEGER REFERENCES users(id),
            productId INTEGER REFERENCES product(id),
            quantity INTEGER
        );
    `);
        console.log('Tables created successfully.');
    } catch (error) {
        console.log('Error with creating tables');
        console.error(error);
    }
}

async function createInitialUsers() {

    try {
        const user = await getUser('user')

        const usersToCreate = [
            { username: 'littlebow30', password: 'littlebow30123', firstName: 'aj', lastName: 'bowman' },
            { username: 'dixonut', password: 'dixonut123', firstName: 'dixon', lastName: 'johnson' },
            { username: 'quinn-jensen', password: 'quinn-jensen123', firstName: 'quinn', lastName: 'jensen' },
            { username: 'admin', password: 'admin', firstName: 'default', lastName: 'admin', isadmin: true },
        ]


        const users = await Promise.all(usersToCreate.map(createUser));
        console.log(users);

    } catch (error) {
        console.error('Error creating user!');
        throw error;
    }
}

async function createInitialProduct() {

    try {

        const productToCreate = [
            { product: "baseball cap", description: 'A Black one size fits all baseball cap', size: 'one size fits all', color: 'black', price: 25.00, inventory: 10, img: 'pictures/baseballCaps/blackHat.jpg' },
            { product: "baseball cap", description: 'A Orange one size fits all baseball cap', size: 'one size fits all', color: 'orange', price: 25.00, inventory: 10, img: 'pictures/baseballCaps/orangeHat.jpg' },
            { product: "baseball cap", description: 'A Tan one size fits all baseball cap', size: 'one size fits all', color: 'tan', price: 25.00, inventory: 10, img: 'pictures/baseballCaps/tanHat.jpg' },
            { product: "stocking cap", description: 'A Black one size fits all stocking cap', size: 'one size fits all', color: 'black', price: 20.00, inventory: 10, img: 'pictures/stockingCaps/blackStockingCap.jpg' },
            { product: "stocking cap", description: 'A Grey one size fits all stocking cap', size: 'one size fits all', color: 'grey', price: 20.00, inventory: 10, img: 'pictures/stockingCaps/greyStockingCap.jpg' },
            { product: "stocking cap", description: 'A Red one size fits all stocking cap', size: 'one size fits all', color: 'red', price: 20.00, inventory: 10, img: 'pictures/stockingCaps/redStockingCap.jpg' },
            { product: "crew neck", description: 'A simple black crewneck with Embroidered Logo on the front', size: 'small', color: 'black', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blackCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple black crewneck with Embroidered Logo on the front', size: 'medium', color: 'black', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blackCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple black crewneck with Embroidered Logo on the front', size: 'large', color: 'black', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blackCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple black crewneck with Embroidered Logo on the front', size: 'x large', color: 'black', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blackCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple black crewneck with Embroidered Logo on the front', size: 'xx large', color: 'black', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blackCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple black crewneck with Embroidered Logo on the front', size: 'xxx large', color: 'black', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blackCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple blue crewneck with Embroidered Logo on the front', size: 'small', color: 'blue', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blueCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple blue crewneck with Embroidered Logo on the front', size: 'medium', color: 'blue', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blueCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple blue crewneck with Embroidered Logo on the front', size: 'large', color: 'blue', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blueCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple blue crewneck with Embroidered Logo on the front', size: 'x large', color: 'blue', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blueCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple blue crewneck with Embroidered Logo on the front', size: 'xx large', color: 'blue', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blueCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple blue crewneck with Embroidered Logo on the front', size: 'xxx large', color: 'blue', price: 39.99, inventory: 10, img: 'pictures/crewNeck/blueCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple green crewneck with Embroidered Logo on the front', size: 'small', color: 'green', price: 39.99, inventory: 10, img: 'pictures/crewNeck/greenCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple green crewneck with Embroidered Logo on the front', size: 'medium', color: 'green', price: 39.99, inventory: 10, img: 'pictures/crewNeck/greenCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple green crewneck with Embroidered Logo on the front', size: 'large', color: 'green', price: 39.99, inventory: 10, img: 'pictures/crewNeck/greenCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple green crewneck with Embroidered Logo on the front', size: 'x large', color: 'green', price: 39.99, inventory: 10, img: 'pictures/crewNeck/greenCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple green crewneck with Embroidered Logo on the front', size: 'xx large', color: 'green', price: 39.99, inventory: 10, img: 'pictures/crewNeck/greenCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple green crewneck with Embroidered Logo on the front', size: 'xxx large', color: 'green', price: 39.99, inventory: 10, img: 'pictures/crewNeck/greenCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple pink crewneck with Embroidered Logo on the front', size: 'small', color: 'pink', price: 39.99, inventory: 10, img: 'pictures/crewNeck/pinkCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple pink crewneck with Embroidered Logo on the front', size: 'medium', color: 'pink', price: 39.99, inventory: 10, img: 'pictures/crewNeck/pinkCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple pink crewneck with Embroidered Logo on the front', size: 'large', color: 'pink', price: 39.99, inventory: 10, img: 'pictures/crewNeck/pinkCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple pink crewneck with Embroidered Logo on the front', size: 'x large', color: 'pink', price: 39.99, inventory: 10, img: 'pictures/crewNeck/pinkCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple pink crewneck with Embroidered Logo on the front', size: 'xx large', color: 'pink', price: 39.99, inventory: 10, img: 'pictures/crewNeck/pinkCrewNeck.jpg' },
            { product: "crew neck", description: 'A simple pink crewneck with Embroidered Logo on the front', size: 'xxx large', color: 'pink', price: 39.99, inventory: 10, img: 'pictures/crewNeck/pinkCrewNeck.jpg' },
            { product: "hoodies", description: 'Black hoodie to keep you warm and looking good all year long!', size: 'small', color: 'black', price: 59.99, inventory: 10, img: 'pictures/hoodies/blackHoodie.jpg' },
            { product: "hoodies", description: 'Black hoodie to keep you warm and looking good all year long!', size: 'medium', color: 'black', price: 59.99, inventory: 10, img: 'pictures/hoodies/blackHoodie.jpg' },
            { product: "hoodies", description: 'Black hoodie to keep you warm and looking good all year long!', size: 'large', color: 'black', price: 59.99, inventory: 10, img: 'pictures/hoodies/blackHoodie.jpg' },
            { product: "hoodies", description: 'Black hoodie to keep you warm and looking good all year long!', size: 'x large', color: 'black', price: 59.99, inventory: 10, img: 'pictures/hoodies/blackHoodie.jpg' },
            { product: "hoodies", description: 'Black hoodie to keep you warm and looking good all year long!', size: 'xx large', color: 'black', price: 59.99, inventory: 10, img: 'pictures/hoodies/blackHoodie.jpg' },
            { product: "hoodies", description: 'Black hoodie to keep you warm and looking good all year long!', size: 'xxx large', color: 'black', price: 59.99, inventory: 10, img: 'pictures/hoodies/blackHoodie.jpg' },
            { product: "hoodies", description: 'Pink hoodie to keep you warm and looking good all year long!', size: 'small', color: 'pink', price: 59.99, inventory: 10, img: 'pictures/hoodies/pinkHoodie.jpg' },
            { product: "hoodies", description: 'Pink hoodie to keep you warm and looking good all year long!', size: 'medium', color: 'pink', price: 59.99, inventory: 10, img: 'pictures/hoodies/pinkHoodie.jpg' },
            { product: "hoodies", description: 'Pink hoodie to keep you warm and looking good all year long!', size: 'large', color: 'pink', price: 59.99, inventory: 10, img: 'pictures/hoodies/pinkHoodie.jpg' },
            { product: "hoodies", description: 'Pink hoodie to keep you warm and looking good all year long!', size: 'x large', color: 'pink', price: 59.99, inventory: 10, img: 'pictures/hoodies/pinkHoodie.jpg' },
            { product: "hoodies", description: 'Pink hoodie to keep you warm and looking good all year long!', size: 'xx large', color: 'pink', price: 59.99, inventory: 10, img: 'pictures/hoodies/pinkHoodie.jpg' },
            { product: "hoodies", description: 'Pink hoodie to keep you warm and looking good all year long!', size: 'xxx large', color: 'pink', price: 59.99, inventory: 10, img: 'pictures/hoodies/pinkHoodie.jpg' },
            { product: "hoodies", description: 'Purple hoodie to keep you warm and looking good all year long!', size: 'small', color: 'purple', price: 59.99, inventory: 10, img: 'pictures/hoodies/purpleHoodie.jpg' },
            { product: "hoodies", description: 'Purple hoodie to keep you warm and looking good all year long!', size: 'medium', color: 'purple', price: 59.99, inventory: 10, img: 'pictures/hoodies/purpleHoodie.jpg' },
            { product: "hoodies", description: 'Purple hoodie to keep you warm and looking good all year long!', size: 'large', color: 'purple', price: 59.99, inventory: 10, img: 'pictures/hoodies/purpleHoodie.jpg' },
            { product: "hoodies", description: 'Purple hoodie to keep you warm and looking good all year long!', size: 'x large', color: 'purple', price: 59.99, inventory: 10, img: 'pictures/hoodies/purpleHoodie.jpg' },
            { product: "hoodies", description: 'Purple hoodie to keep you warm and looking good all year long!', size: 'xx large', color: 'purple', price: 59.99, inventory: 10, img: 'pictures/hoodies/purpleHoodie.jpg' },
            { product: "hoodies", description: 'Purple hoodie to keep you warm and looking good all year long!', size: 'xxx large', color: 'purple', price: 59.99, inventory: 10, img: 'pictures/hoodies/purpleHoodie.jpg' },
            { product: "sweat pants", description: 'Black sweatpants to keep you warm on those cold days!', size: 'small', color: 'black', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blackSweatPants.jpg' },
            { product: "sweat pants", description: 'Black sweatpants to keep you warm on those cold days!', size: 'medium', color: 'black', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blackSweatPants.jpg' },
            { product: "sweat pants", description: 'Black sweatpants to keep you warm on those cold days!', size: 'large', color: 'black', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blackSweatPants.jpg' },
            { product: "sweat pants", description: 'Black sweatpants to keep you warm on those cold days!', size: 'x large', color: 'black', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blackSweatPants.jpg' },
            { product: "sweat pants", description: 'Black sweatpants to keep you warm on those cold days!', size: 'xx large', color: 'black', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blackSweatPants.jpg' },
            { product: "sweat pants", description: 'Black sweatpants to keep you warm on those cold days!', size: 'xxx large', color: 'black', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blackSweatPants.jpg' },
            { product: "sweat pants", description: 'Blue sweatpants to keep you warm on those cold days!', size: 'small', color: 'blue', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blueSweatPants.jpg' },
            { product: "sweat pants", description: 'Blue sweatpants to keep you warm on those cold days!', size: 'medium', color: 'blue', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blueSweatPants.jpg' },
            { product: "sweat pants", description: 'Blue sweatpants to keep you warm on those cold days!', size: 'large', color: 'blue', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blueSweatPants.jpg' },
            { product: "sweat pants", description: 'Blue sweatpants to keep you warm on those cold days!', size: 'x large', color: 'blue', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blueSweatPants.jpg' },
            { product: "sweat pants", description: 'Blue sweatpants to keep you warm on those cold days!', size: 'xx large', color: 'blue', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blueSweatPants.jpg' },
            { product: "sweat pants", description: 'Blue sweatpants to keep you warm on those cold days!', size: 'xxx large', color: 'blue', price: 29.99, inventory: 10, img: 'pictures/sweatPants/blueSweatPants.jpg' },
        ]


        const product = await Promise.all(productToCreate.map(createProduct));
        console.log(product)

    } catch (error) {
        console.error('Error creating product!');
        throw error;
    }
}


async function rebuildDB() {
    try {
        console.log('building data base...')
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialProduct();
        //   await createInitialCheckout();

    } catch (error) {
        console.log('Error during rebuildDB')
        throw error;
    }
}

module.exports = {
    rebuildDB
};
