import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Form, Button, Card } from 'react-bootstrap';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    }

    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    }

    return (
        <>
            {/* Header Section */}
            <div className='cart-header'>
                <h1 className='cart-title'>🛒 Korpa</h1>
                <Link to='/' className='cart-back-link'><FaArrowLeft /> Nastavite kupovinu</Link>
            </div>

            <Row className='gy-4'>
                {/* Cart Items Section */}
                <Col lg={8}>
                    {cartItems.length === 0 ? (
                        <Card className='cart-empty-card'>
                            <Message>
                                <div className='cart-empty-text'>Vaša korpa je prazna</div>
                                <Link to='/' className='cart-empty-action'>Pretraga proizvoda</Link>
                            </Message>
                        </Card>
                    ) : (
                        <div className='cart-items-list'>
                            {cartItems.map((item) => (
                                <Card key={item._id} className='cart-item-card'>
                                    <Row className='align-items-center'>
                                        {/* Product Image */}
                                        <Col md={2} className='text-center'>
                                            <Image src={item.image} alt={item.name} fluid className='cart-item-image' />
                                        </Col>

                                        {/* Product Name & Link */}
                                        <Col md={3}>
                                            <Link to={`/product/${item._id}`} className='cart-item-link'>{item.name}</Link>
                                            <div className='cart-item-meta'>Kategorija: {item.category}</div>
                                        </Col>

                                        {/* Unit Price */}
                                        <Col md={2}>
                                            <div className='cart-price'>{item.price.toFixed(2)} RSD</div>
                                        </Col>

                                        {/* Quantity Selector */}
                                        <Col md={2}>
                                            <Form.Control
                                                as="select"
                                                value={item.qty}
                                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                                className='cart-qty-select'
                                            >
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>

                                        {/* Subtotal */}
                                        <Col md={2} className='summary-value'>
                                            <div className='cart-price'>{(item.qty * item.price).toFixed(2)} RSD</div>
                                            <Button variant="outline-danger" size="sm" onClick={() => removeFromCartHandler(item._id)} className='cart-remove-btn'>
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </div>
                    )}
                </Col>

                {/* Order Summary Sidebar */}
                <Col lg={4}>
                    <Card className='order-summary-card'>
                        <div className='order-summary-title'>📦 Rezime</div>

                        {/* Summary Items */}
                        <div className='order-summary-row'>
                            <Row className='summary-row'>
                                <Col><span className='order-summary-label'>Proizvodi:</span></Col>
                                <Col className='summary-value'><span className='order-summary-value'>{cartItems.reduce((acc, item) => acc + item.qty, 0)} kom.</span></Col>
                            </Row>
                            <Row className='summary-row'>
                                <Col><span className='order-summary-label'>Ukupna vrednost:</span></Col>
                                <Col className='summary-value'><span className='order-summary-value'>{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)} RSD</span></Col>
                            </Row>
                        </div>

                        {/* Checkout Button */}
                        <Button type='button' className='add-to-cart-btn neon-submit-btn' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                            NASTAVI NA KEŠIRANJE
                        </Button>

                        {cartItems.length === 0 && (
                            <div className='cart-empty-note'>Korpa je prazna. Dodajte proizvode!</div>
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CartScreen