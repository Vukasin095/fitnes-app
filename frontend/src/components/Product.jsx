import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
const Product = ({ product }) => {
    let displayRating = product.rating;
    let displayNumReviews = product.numReviews;

    if (product?._id) {
        try {
            const savedData = localStorage.getItem(`product_rating_${product._id}`);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (typeof parsed.rating === 'number') {
                    displayRating = parsed.rating;
                }
                if (typeof parsed.numReviews === 'number') {
                    displayNumReviews = parsed.numReviews;
                }
            }
        } catch {
            // Ignore localStorage parsing issues and fall back to backend values
        }
    }

    const reviewLabel = `${displayNumReviews} ${
        displayNumReviews === 1
            ? 'recenzija'
            : displayNumReviews % 10 >= 2 && displayNumReviews % 10 <= 4 && (displayNumReviews % 100 < 10 || displayNumReviews % 100 >= 20)
            ? 'recenzije'
            : 'recenzija'
    }`;

    return (
        <Card className='my-3 p-3 product-card shadow-soft'>
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant='top'
                    style={{ height: '260px', objectFit: 'cover', borderRadius: '14px' }} />
            </Link>

            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as='div' className='product-title'><strong>{product.name}</strong></Card.Title>
                </Link>

                <Card.Text as="div">
                    <Rating value={displayRating} text={`Ocena: ${Number(displayRating).toFixed(2)} (${reviewLabel})`} />
                </Card.Text>
                <Card.Text as='h3' className='product-price'>{product.price} RSD</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
