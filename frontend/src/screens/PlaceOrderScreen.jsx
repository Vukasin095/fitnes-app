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
                    <Card className='border-0 shadow-soft mb-3 place-shipping-card'>
                        <h3 className='place-section-heading place-shipping-heading'>
                            📍 Adresa za dostavu
                        </h3>
                        <div className='place-shipping-info'>
                            <div>
                                <span className='muted-label'>Adresa:</span> {cart.shippingAddress.address}
                            </div>
                            <div>
                                <span className='muted-label'>Grad:</span> {cart.shippingAddress.city}
                            </div>
                            <div>
                                <span className='muted-label'>Poštanski broj:</span> {cart.shippingAddress.postalCode}
                            </div>
                            <div>
                                <span className='muted-label'>Država:</span> {cart.shippingAddress.country}
                            </div>
                        </div>
                    </Card>

                    {/* Payment Method Card */}
                    <Card className='border-0 shadow-soft mb-3 place-payment-card'>
                        <h3 className='place-section-heading place-payment-heading'>
                            💳 Način plaćanja
                        </h3>
                        <div className='place-payment-info'>
                            {cart.paymentMethod}
                        </div>
                    </Card>

                    {/* Order Items Card */}
                    <Card className='border-0 shadow-soft place-items-card'>
                        <h3 className='place-section-heading place-items-heading'>
                            📦 Stavke porudžbine
                        </h3>
                        {cart.cartItems.length === 0 ? (
                            <Message>Vaša korpa je prazna</Message>
                        ) : (
                            <div className='place-items-list'>
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className={`place-item-row ${index !== cart.cartItems.length - 1 ? 'place-item-divider' : ''}`}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fluid
                                            className='place-item-image'
                                        />
                                        <div className='place-item-body'>
                                            <Link to={`/product/${item.product}`} className='place-item-link'>
                                                {item.name}
                                            </Link>
                                            <div className='place-item-desc'>
                                                {item.qty} x {item.price.toFixed(2)} RSD
                                            </div>
                                            <div className='place-item-total'>
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
                    <Card className='border-0 shadow-soft order-summary-card'>
                        <h2 className='order-summary-title'>
                            📋 Rezime
                        </h2>

                        {/* Summary Lines */}
                        <div className='order-summary-lines'>
                            <Row className='summary-row'>
                                <Col>
                                    <span className='summary-label'>Proizvodi:</span>
                                </Col>
                                <Col className='summary-value'>
                                    <span className='order-summary-value'>{Number(cart.itemsPrice).toFixed(2)} RSD</span>
                                </Col>
                            </Row>
                            <Row className='summary-row'>
                                <Col>
                                    <span className='summary-label'>Dostava:</span>
                                </Col>
                                <Col className='summary-value'>
                                    <span className='order-summary-value'>{Number(cart.shippingPrice).toFixed(2)} RSD</span>
                                </Col>
                            </Row>
                            <Row className='summary-row'>
                                <Col>
                                    <span className='summary-label'>PDV:</span>
                                </Col>
                                <Col className='summary-value'>
                                    <span className='order-summary-value'>{Number(cart.taxPrice).toFixed(2)} RSD</span>
                                </Col>
                            </Row>
                        </div>

                        {/* Total */}
                        <Row className='summary-total-row'>
                            <Col>
                                <span className='summary-total-label'>UKUPNO:</span>
                            </Col>
                            <Col className='summary-value'>
                                <span className='summary-total-value'>{Number(cart.totalPrice).toFixed(2)} RSD</span>
                            </Col>
                        </Row>

                        {/* Error Message */}
                        {error && (
                            <Message variant='danger' className='mb-3'>
                                {error}
                            </Message>
                        )}

                        {/* Place Order Button */}
                        <Button
                            type='button'
                            className='add-to-cart-btn neon-submit-btn'
                            disabled={cart.cartItems === 0 || isLoading}
                            onClick={placeOrderHandler}
                        >
                            {isLoading ? '⏳ Učitavanje...' : '✓ PORUČI SADA'}
                        </Button>

                        {isLoading && <Loader />}

                        <div className='place-action-note'>
                            ℹ️ Pritisnite "Poruči sada" da potvrdite porudžbinu. Sledeći korak će biti plaćanje.
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;