import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc Fetch product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Resource not found");
    }

});

// @desc Add product rating
// @route POST /api/products/:id/review
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Već ste ocenili ovaj proizvod');
        }

        const review = {
            rating: Number(rating),
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => acc + item.rating, 0) /
            product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Ocena je sačuvana' });
    } else {
        res.status(404);
        throw new Error('Proizvod nije pronađen');
    }
});

// @desc Create a new product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Test naziv',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        category: 'Test kategorija',
        countInStock: 0,
        numReviews: 0,
        description: 'Test opis',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Resource not found");
    }
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.status(200).json({ message: "Product removed" });
    }
    else {
        res.status(404);
        throw new Error("Resource not found");
    }
});


export { getProducts, getProductById, createProduct, createProductReview, updateProduct, deleteProduct };