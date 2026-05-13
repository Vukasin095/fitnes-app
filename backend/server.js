import dns from 'node:dns/promises';
import Product from './models/productModel.js';
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import products from './data/products.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/products', async (req, res) => {
    const productsFromDB = await Product.find({});
    res.json(productsFromDB);
});

app.get('/api/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);  
});

app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
);