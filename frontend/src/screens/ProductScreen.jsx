import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, Row, Col, Image, Card, Button, Badge } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {
    useGetProductDetailsQuery,
    useAddProductReviewMutation,
} from '../slices/productsApiSlice'
import { addToCart } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { FaArrowLeft } from 'react-icons/fa'
const ProductScreen = () => {
    const { id: productId } = useParams();
    const [qty, setQty] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: product, isLoading, error } =
        useGetProductDetailsQuery(productId);
    const [selectedRating, setSelectedRating] = useState(0);
    const [currentRating, setCurrentRating] = useState(product?.rating || 0);
    const [currentNumReviews, setCurrentNumReviews] = useState(product?.numReviews || 0);
    const [userPreviousVote, setUserPreviousVote] = useState(0);
    const [reviewError, setReviewError] = useState('');
    const [addProductReview] = useAddProductReviewMutation();
    const userLogin = useSelector((state) => state.auth);
    const { userInfo } = userLogin;

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    }

    useEffect(() => {
        if (!product || !product._id) return;

        const storageKey = `product_rating_${product._id}`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (typeof parsed.rating === 'number' && typeof parsed.numReviews === 'number' && typeof parsed.previousVote === 'number') {
                    setCurrentRating(parsed.rating);
                    setCurrentNumReviews(parsed.numReviews);
                    setUserPreviousVote(parsed.previousVote);
                } else {
                    setCurrentRating(product.rating || 0);
                    setCurrentNumReviews(product.numReviews || 0);
                    setUserPreviousVote(0);
                }
            } catch {
                setCurrentRating(product.rating || 0);
                setCurrentNumReviews(product.numReviews || 0);
                setUserPreviousVote(0);
            }
        } else {
            setCurrentRating(product.rating || 0);
            setCurrentNumReviews(product.numReviews || 0);
            setUserPreviousVote(0);
        }

        setSelectedRating(0);
    }, [product]);

    const handleRatingClick = async (value) => {
        if (!userInfo) {
            navigate('/login?redirect=/product/' + productId);
            return;
        }

        setReviewError('');
        const chosenRating = value;
        setSelectedRating(chosenRating);

        const storageKey = product?._id ? `product_rating_${product._id}` : null;
        const prevRating = currentRating || 0;
        const prevCount = currentNumReviews || 0;
        const prevUserVote = userPreviousVote || 0;
        let newRating = prevRating;
        let newCount = prevCount;
        let newUserVote = prevUserVote;

        if (!prevUserVote) {
            newCount = prevCount + 1;
            newRating = ((prevRating * prevCount) + chosenRating) / newCount;
            newUserVote = chosenRating;
            setCurrentRating(newRating);
            setCurrentNumReviews(newCount);
            setUserPreviousVote(newUserVote);
        } else {
            newCount = prevCount;
            const totalScore = prevRating * prevCount;
            newRating = prevCount > 0 ? ((totalScore - prevUserVote + chosenRating) / prevCount) : chosenRating;
            newUserVote = chosenRating;
            setCurrentRating(newRating);
            setUserPreviousVote(newUserVote);
        }

        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify({ rating: newRating, numReviews: newCount, previousVote: newUserVote }));
        }

        try {
            await addProductReview({ productId, rating: chosenRating }).unwrap();
        } catch (err) {
            const errorMsg = err?.data?.message || err?.error || 'Greška pri ocenjivanju';
            if (errorMsg.includes('Već ste ocenili')) {
                setReviewError('');
            } else {
                setReviewError(errorMsg);
            }
        }
    };

    const ratingValue = selectedRating || currentRating || 0;

    return (<>
        <div className='breadcrumb-line'>Početna / Proizvodi / Detalji proizvoda</div>
        <Link className='product-back-link btn btn-outline-secondary mb-4' to='/'>
            <FaArrowLeft className='product-back-icon' /> Nazad na proizvode
        </Link>

        {isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant="danger">
                {error?.data?.message || error.error}
            </Message>
        ) : (
            <Row className='gy-5 align-items-stretch'>
                {/* LEFT: Large Product Image Display */}
                <Col lg={7}>
                    <Card className='product-image-card'>
                        <div className='product-image-wrap'>
                            <Image src={product.image} alt={product.name} fluid className='product-large-image' />
                        </div>
                    </Card>
                </Col>

                {/* RIGHT: Compact Action Block */}
                <Col lg={5}>
                    <Card className='product-action-card'>
                        <Card.Body>
                            {/* Product Title */}
                            <h1 className='product-detail-title'>{product.name}</h1>

                            {/* Price - Bold & Prominent */}
                            <div className='product-detail-price'>{product.price.toFixed(2)} RSD</div>

                            {/* Rating Component with Interactive Stars */}
                            <div className='product-detail-rating'>
                                {(() => {
                                    const count = currentNumReviews || 0;
                                    const pluralForm = count === 1 ? 'recenzija' : (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) ? 'recenzije' : 'recenzija';
                                    return `Ocena: ${Number(currentRating || 0).toFixed(2)} (${count} ${pluralForm})`;
                                })()}
                                <div className='product-rating-value'>
                                    <Rating
                                        value={ratingValue}
                                        text=''
                                        interactive={!!userInfo}
                                        onRate={handleRatingClick}
                                        userRating={selectedRating}
                                    />
                                </div>
                                {reviewError && (
                                    <div className='product-review-error'>
                                        {reviewError}
                                    </div>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className='product-detail-stock mb-4'>
                                <span className='product-category-label'>Dostupnost:</span>
                                {product.countInStock > 0 ? (
                                    <Badge className='product-status-badge available'>
                                        ✓ Dostupno
                                    </Badge>
                                ) : (
                                    <Badge className='product-status-badge unavailable'>
                                        ✗ Nije dostupno
                                    </Badge>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {product.countInStock > 0 && (
                                <div className='product-qty-row'>
                                    <span className='product-qty-label'>Količina:</span>
                                    <Form.Control as='select' value={qty} onChange={(e) => setQty(Number(e.target.value))} className='product-qty-select'>
                                        {[...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <div className='product-action-buttons'>
                                <Button className='add-to-cart-btn neon-submit-btn' type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}>DODAJ U KORPU</Button>
                            </div>

                            {/* Category Badge */}
                            <div className='product-category-box'>
                                <span className='product-category-label'>Kategorija</span>
                                <span className='product-category-value'>{product.category}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )}

        {product && (
            <Row className='gy-4 mt-4'>
                <Col lg={12}>
                    <Card className='border-0 shadow-soft product-description-card'>
                        <h3 className='product-description-title'>
                            📝 Opis proizvoda
                        </h3>
                        <p className='product-description-text'>
                            {product.description}
                        </p>
                    </Card>
                </Col>
            </Row>
        )}
    </>)
}
export default ProductScreen