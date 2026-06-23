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
        <div style={{
            marginBottom: '1rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
            letterSpacing: '0.08em'
        }}>
            Početna / Proizvodi / Detalji proizvoda
        </div>
        <Link className='btn btn-outline-secondary mb-4' to='/' style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.2rem',
            borderRadius: '12px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            fontSize: '0.95rem'
        }}>
            <FaArrowLeft style={{ fontSize: '1rem' }} /> Nazad na proizvode
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
                    <Card className='border-0 shadow-soft h-100' style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '2.5rem',
                        background: 'linear-gradient(135deg, #1c1f2a, #141720)'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image
                                src={product.image}
                                alt={product.name}
                                fluid
                                style={{
                                    maxHeight: '600px',
                                    objectFit: 'contain',
                                    borderRadius: '20px'
                                }}
                            />
                        </div>
                    </Card>
                </Col>

                {/* RIGHT: Compact Action Block */}
                <Col lg={5}>
                    <Card className='border-0 shadow-soft' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2rem',
                        borderRadius: '20px'
                    }}>
                        <Card.Body style={{ padding: 0 }}>
                            {/* Product Title */}
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: 900,
                                color: '#ffffff',
                                marginBottom: '1rem',
                                lineHeight: 1.2
                            }}>
                                {product.name}
                            </h1>

                            {/* Price - Bold & Prominent */}
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: 900,
                                color: '#ccff00',
                                letterSpacing: '0.04em',
                                marginBottom: '1.5rem',
                                textTransform: 'uppercase'
                            }}>
                                {product.price.toFixed(2)} RSD
                            </div>

                            {/* Rating Component with Interactive Stars */}
                            <div style={{ marginBottom: '2rem' }}>
                                {(() => {
                                    const count = currentNumReviews || 0;
                                    const pluralForm = count === 1 ? 'recenzija' : (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) ? 'recenzije' : 'recenzija';
                                    return `Ocena: ${Number(currentRating || 0).toFixed(2)} (${count} ${pluralForm})`;
                                })()}
                                <div style={{ marginTop: '0.8rem' }}>
                                    <Rating
                                        value={ratingValue}
                                        text=''
                                        interactive={!!userInfo}
                                        onRate={handleRatingClick}
                                        userRating={selectedRating}
                                    />
                                </div>
                                {reviewError && (
                                    <div style={{
                                        color: '#ff6b6b',
                                        fontSize: '0.9rem',
                                        marginTop: '0.8rem'
                                    }}>
                                        {reviewError}
                                    </div>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '2rem'
                            }}>
                                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Dostupnost:</span>
                                {product.countInStock > 0 ? (
                                    <Badge bg='' style={{
                                        background: 'rgba(34, 197, 94, 0.2)',
                                        color: '#22c55e',
                                        padding: '0.5rem 0.9rem',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        letterSpacing: '0.02em'
                                    }}>
                                        ✓ Dostupno
                                    </Badge>
                                ) : (
                                    <Badge bg='' style={{
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        color: '#ef4444',
                                        padding: '0.5rem 0.9rem',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        letterSpacing: '0.02em'
                                    }}>
                                        ✗ Nije dostupno
                                    </Badge>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {product.countInStock > 0 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '2.5rem'
                                }}>
                                    <span style={{ color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>Količina:</span>
                                    <Form.Control
                                        as='select'
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        style={{
                                            width: '100px',
                                            textAlign: 'center',
                                            background: '#252a37 !important',
                                            border: '1px solid #3f485e !important',
                                            color: '#ffffff !important',
                                            borderRadius: '10px',
                                            fontWeight: 700
                                        }}
                                    >
                                        {[...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <div style={{ display: 'grid', marginBottom: '1.5rem' }}>
                                <Button
                                    className='add-to-cart-btn'
                                    type='button'
                                    disabled={product.countInStock === 0}
                                    onClick={addToCartHandler}
                                    style={{
                                        padding: '1rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 800,
                                        borderRadius: '14px',
                                        letterSpacing: '0.03em'
                                    }}
                                >
                                    DODAJ U KORPU
                                </Button>
                            </div>

                            {/* Category Badge */}
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(204, 255, 0, 0.08)',
                                borderRadius: '12px',
                                borderLeft: '3px solid #ccff00'
                            }}>
                                <span style={{
                                    color: '#94a3b8',
                                    fontSize: '0.9rem',
                                    display: 'block',
                                    marginBottom: '0.3rem'
                                }}>
                                    Kategorija
                                </span>
                                <span style={{
                                    color: '#ccff00',
                                    fontWeight: 700,
                                    fontSize: '1rem'
                                }}>
                                    {product.category}
                                </span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )}

        {product && (
            <Row className='gy-4 mt-4'>
                <Col lg={12}>
                    <Card className='border-0 shadow-soft' style={{
                        padding: '2.5rem',
                        background: 'linear-gradient(135deg, #1c1f2a, #141720)',
                        borderRadius: '20px'
                    }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            marginBottom: '1.5rem',
                            letterSpacing: '0.02em'
                        }}>
                            📝 Opis proizvoda
                        </h3>
                        <p style={{
                            color: '#cbd5e1',
                            fontSize: '1.05rem',
                            lineHeight: 1.8,
                            margin: 0
                        }}>
                            {product.description}
                        </p>
                    </Card>
                </Col>
            </Row>
        )}
    </>)
}
export default ProductScreen