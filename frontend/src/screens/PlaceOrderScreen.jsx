import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, Card, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const dispatch = useDispatch();
    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row className='gy-4 mt-3'>
                {/* LEFT: Order Details */}
                <Col lg={8}>
                    {/* Shipping Address Card */}
                    <Card className='border-0 shadow-soft mb-3' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2rem',
                        borderRadius: '16px',
                        borderLeft: '4px solid #ccff00'
                    }}>
                        <h3 style={{
                            fontSize: '1.3rem',
                            fontWeight: 800,
                            color: '#ccff00',
                            marginBottom: '1.5rem',
                            letterSpacing: '0.02em'
                        }}>
                            📍 Adresa za dostavu
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.8rem',
                            color: '#cbd5e1',
                            fontSize: '1rem',
                            lineHeight: 1.7
                        }}>
                            <div>
                                <span style={{ color: '#94a3b8' }}>Adresa:</span> {cart.shippingAddress.address}
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8' }}>Grad:</span> {cart.shippingAddress.city}
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8' }}>Poštanski broj:</span> {cart.shippingAddress.postalCode}
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8' }}>Država:</span> {cart.shippingAddress.country}
                            </div>
                        </div>
                    </Card>

                    {/* Payment Method Card */}
                    <Card className='border-0 shadow-soft mb-3' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2rem',
                        borderRadius: '16px',
                        borderLeft: '4px solid #ff4500'
                    }}>
                        <h3 style={{
                            fontSize: '1.3rem',
                            fontWeight: 800,
                            color: '#ff4500',
                            marginBottom: '1rem',
                            letterSpacing: '0.02em'
                        }}>
                            💳 Način plaćanja
                        </h3>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#ffffff',
                            padding: '1rem',
                            background: 'rgba(255, 69, 0, 0.1)',
                            borderRadius: '10px'
                        }}>
                            {cart.paymentMethod}
                        </div>
                    </Card>

                    {/* Order Items Card */}
                    <Card className='border-0 shadow-soft' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2rem',
                        borderRadius: '16px',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        <h3 style={{
                            fontSize: '1.3rem',
                            fontWeight: 800,
                            color: '#3b82f6',
                            marginBottom: '1.5rem',
                            letterSpacing: '0.02em'
                        }}>
                            📦 Stavke porudžbine
                        </h3>
                        {cart.cartItems.length === 0 ? (
                            <Message>Vaša korpa je prazna</Message>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem'
                            }}>
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        paddingBottom: '1.5rem',
                                        borderBottom: index !== cart.cartItems.length - 1 ? '1px solid #2e3545' : 'none'
                                    }}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fluid
                                            style={{
                                                maxHeight: '100px',
                                                maxWidth: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '10px'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <Link to={`/product/${item.product}`} style={{
                                                color: '#ccff00',
                                                fontWeight: 700,
                                                textDecoration: 'none',
                                                fontSize: '1.05rem',
                                                marginBottom: '0.5rem',
                                                display: 'block'
                                            }}>
                                                {item.name}
                                            </Link>
                                            <div style={{
                                                color: '#94a3b8',
                                                fontSize: '0.9rem',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {item.qty} x {item.price.toFixed(2)} RSD
                                            </div>
                                            <div style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 800,
                                                color: '#ccff00'
                                            }}>
                                                = {(item.qty * item.price).toFixed(2)} RSD
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>

                {/* RIGHT: Order Summary */}
                <Col lg={4}>
                    <Card className='border-0 shadow-soft' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2.5rem',
                        borderRadius: '20px',
                        position: 'sticky',
                        top: '110px'
                    }}>
                        <h2 style={{
                            fontSize: '1.6rem',
                            fontWeight: 900,
                            color: '#ffffff',
                            marginBottom: '2rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                        }}>
                            📋 Rezime
                        </h2>

                        {/* Summary Lines */}
                        <div style={{
                            borderTop: '1px solid #2e3545',
                            borderBottom: '1px solid #2e3545',
                            padding: '1.5rem 0',
                            marginBottom: '2rem'
                        }}>
                            <Row style={{ marginBottom: '1rem' }}>
                                <Col>
                                    <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Proizvodi:</span>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                        {Number(cart.itemsPrice).toFixed(2)} RSD
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '1rem' }}>
                                <Col>
                                    <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Dostava:</span>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                        {Number(cart.shippingPrice).toFixed(2)} RSD
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '1rem' }}>
                                <Col>
                                    <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>PDV:</span>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                        {Number(cart.taxPrice).toFixed(2)} RSD
                                    </span>
                                </Col>
                            </Row>
                        </div>

                        {/* Total */}
                        <Row style={{
                            marginBottom: '2rem',
                            paddingBottom: '1.5rem',
                            borderBottom: '2px solid #ccff00'
                        }}>
                            <Col>
                                <span style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 800,
                                    color: '#ffffff'
                                }}>
                                    UKUPNO:
                                </span>
                            </Col>
                            <Col style={{ textAlign: 'right' }}>
                                <span style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 900,
                                    color: '#ccff00'
                                }}>
                                    {Number(cart.totalPrice).toFixed(2)} RSD
                                </span>
                            </Col>
                        </Row>

                        {/* Error Message */}
                        {error && (
                            <Message variant='danger' style={{ marginBottom: '1rem' }}>
                                {error}
                            </Message>
                        )}

                        {/* Place Order Button */}
                        <Button
                            type='button'
                            className='add-to-cart-btn'
                            disabled={cart.cartItems === 0 || isLoading}
                            onClick={placeOrderHandler}
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
                            {isLoading ? '⏳ Učitavanje...' : '✓ PORUČI SADA'}
                        </Button>

                        {isLoading && <Loader />}

                        <div style={{
                            padding: '1rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '10px',
                            color: '#93c5fd',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                            textAlign: 'center'
                        }}>
                            ℹ️ Pritisnite "Poruči sada" da potvrdite porudžbinu. Sledeći korak će biti plaćanje.
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;