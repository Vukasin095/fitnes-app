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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '2px solid #2e3545'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    margin: 0,
                    letterSpacing: '0.02em'
                }}>
                    🛒 Korpa
                </h1>
                <Link to='/' style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.7rem 1.4rem',
                    borderRadius: '12px',
                    background: 'rgba(204, 255, 0, 0.1)',
                    border: '1px solid #ccff00',
                    color: '#ccff00',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                }} onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(204, 255, 0, 0.2)';
                    e.target.style.boxShadow = '0 0 20px rgba(204, 255, 0, 0.3)';
                }} onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(204, 255, 0, 0.1)';
                    e.target.style.boxShadow = 'none';
                }}>
                    <FaArrowLeft /> Nastavite kupovinu
                </Link>
            </div>

            <Row className='gy-4'>
                {/* Cart Items Section */}
                <Col lg={8}>
                    {cartItems.length === 0 ? (
                        <Card className='border-0 shadow-soft' style={{
                            padding: '3rem',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #1c1f2a, #141720)'
                        }}>
                            <Message>
                                <div style={{
                                    fontSize: '1.2rem',
                                    color: '#94a3b8'
                                }}>
                                    Vaša korpa je prazna
                                </div>
                                <Link to='/' style={{
                                    display: 'inline-block',
                                    marginTop: '1rem',
                                    padding: '0.6rem 1.2rem',
                                    background: '#ccff00',
                                    color: '#0f1117',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                }}>
                                    Pretraga proizvoda
                                </Link>
                            </Message>
                        </Card>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {cartItems.map((item) => (
                                <Card key={item._id} className='border-0 shadow-soft' style={{
                                    background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                                    padding: '1.5rem',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease'
                                }} onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(204, 255, 0, 0.1)';
                                }} onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                                }}>
                                    <Row className='align-items-center'>
                                        {/* Product Image */}
                                        <Col md={2} style={{ textAlign: 'center' }}>
                                            <Image src={item.image} alt={item.name} fluid
                                                style={{
                                                    maxHeight: '120px',
                                                    objectFit: 'cover',
                                                    borderRadius: '12px'
                                                }} />
                                        </Col>

                                        {/* Product Name & Link */}
                                        <Col md={3}>
                                            <Link to={`/product/${item._id}`} style={{
                                                color: '#ccff00',
                                                fontWeight: 700,
                                                fontSize: '1.05rem',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s ease'
                                            }} onMouseEnter={(e) => e.target.style.color = '#ff4500'} onMouseLeave={(e) => e.target.style.color = '#ccff00'}>
                                                {item.name}
                                            </Link>
                                            <div style={{
                                                color: '#94a3b8',
                                                fontSize: '0.9rem',
                                                marginTop: '0.3rem'
                                            }}>
                                                Kategorija: {item.category}
                                            </div>
                                        </Col>

                                        {/* Unit Price */}
                                        <Col md={2}>
                                            <div style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 800,
                                                color: '#ccff00'
                                            }}>
                                                {item.price.toFixed(2)} RSD
                                            </div>
                                        </Col>

                                        {/* Quantity Selector */}
                                        <Col md={2}>
                                            <Form.Control
                                                as="select"
                                                value={item.qty}
                                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 700,
                                                    background: '#252a37 !important',
                                                    border: '1px solid #3f485e !important',
                                                    color: '#ffffff !important',
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>

                                        {/* Subtotal */}
                                        <Col md={2} style={{ textAlign: 'right' }}>
                                            <div style={{
                                                fontSize: '1.3rem',
                                                fontWeight: 900,
                                                color: '#ccff00',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {(item.qty * item.price).toFixed(2)} RSD
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeFromCartHandler(item._id)}
                                                style={{
                                                    border: '1px solid #ef4444',
                                                    color: '#ef4444',
                                                    borderRadius: '8px',
                                                    fontWeight: 700,
                                                    padding: '0.4rem 0.8rem'
                                                }}
                                            >
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
                    <Card className='border-0 shadow-soft' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2rem',
                        borderRadius: '20px',
                        position: 'sticky',
                        top: '110px'
                    }}>
                        <div style={{
                            fontSize: '1.4rem',
                            fontWeight: 900,
                            color: '#ffffff',
                            marginBottom: '2rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                        }}>
                            📦 Rezime
                        </div>

                        {/* Summary Items */}
                        <div style={{
                            borderTop: '1px solid #2e3545',
                            borderBottom: '1px solid #2e3545',
                            padding: '1.5rem 0',
                            marginBottom: '1.5rem'
                        }}>
                            <Row style={{ marginBottom: '1rem' }}>
                                <Col>
                                    <span style={{ color: '#94a3b8' }}>Proizvodi:</span>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                        {cartItems.reduce((acc, item) => acc + item.qty, 0)} kom.
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '1rem' }}>
                                <Col>
                                    <span style={{ color: '#94a3b8' }}>Ukupna vrednost:</span>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 800, color: '#ccff00', fontSize: '1.1rem' }}>
                                        {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)} RSD
                                    </span>
                                </Col>
                            </Row>
                        </div>

                        {/* Checkout Button */}
                        <Button
                            type='button'
                            className='add-to-cart-btn'
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                fontWeight: 800,
                                borderRadius: '14px',
                                letterSpacing: '0.03em',
                                marginBottom: '1rem'
                            }}
                        >
                            NASTAVI NA KEŠIRANJE
                        </Button>

                        {cartItems.length === 0 && (
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(148, 163, 184, 0.1)',
                                borderRadius: '10px',
                                color: '#94a3b8',
                                fontSize: '0.9rem',
                                textAlign: 'center'
                            }}>
                                Korpa je prazna. Dodajte proizvode!
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CartScreen