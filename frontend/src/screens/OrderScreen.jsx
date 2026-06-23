import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, Button, Card, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    usePayAndDeliverOrderMutation,
    useGetPaypalClientIdQuery,
    useDeliverOrderMutation,
    useUpdateOrderMembershipDatesMutation,
} from '../slices/ordersApiSlice';
import { useGetProfileQuery } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const { data: order, refetch, isLoading, isError } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [payAndDeliverOrder, { isLoading: loadingPayAndDeliver }] =
        usePayAndDeliverOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    const [updateOrderMembershipDates, { isLoading: loadingMembershipUpdate }] =
        useUpdateOrderMembershipDatesMutation();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } =
        useGetPaypalClientIdQuery();
    const { refetch: refetchProfile } = useGetProfileQuery();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [membershipStartDate, setMembershipStartDate] = useState('');
    const [membershipEndDate, setMembershipEndDate] = useState('');

    useEffect(() => {
        if (order?.membershipStartDate) {
            try {
                setMembershipStartDate(
                    new Date(order.membershipStartDate).toISOString().split('T')[0]
                );
            } catch (e) {
                setMembershipStartDate(String(order.membershipStartDate).split('T')[0]);
            }
        }
        if (order?.membershipEndDate) {
            try {
                setMembershipEndDate(
                    new Date(order.membershipEndDate).toISOString().split('T')[0]
                );
            } catch (e) {
                setMembershipEndDate(String(order.membershipEndDate).split('T')[0]);
            }
        }
    }, [order]);

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'EUR',
                    },
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            };

            if (order && !order.isPaid && order.paymentMethod !== 'U teretani') {
                if (!window.paypal) {
                    loadPaypalScript();
                } else {
                    paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
                }
            }
        }
    }, [errorPayPal, loadingPayPal, paypal, order, paypalDispatch]);

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {
                await payOrder({ orderId, details }).unwrap();

                if (order?.orderItems?.some((item) => item.category === 'Članarine')) {
                    const profile = await refetchProfile().unwrap();
                    if (profile) dispatch(setCredentials(profile));
                }

                refetch();
                toast.success('Porudžbina je uspešno plaćena');
            } catch (err) {
                toast.error(
                    err?.data?.message ||
                        err.message ||
                        'Greška prilikom plaćanja porudžbine'
                );
            }
        });
    };

    const onApproveTest = async () => {
        await payOrder({ orderId, details: { payer: { name: 'Test User' } } }).unwrap();

        if (order?.orderItems?.some((item) => item.category === 'Članarine')) {
            const profile = await refetchProfile().unwrap();
            if (profile) dispatch(setCredentials(profile));
        }

        refetch();
        toast.success('Porudžbina je uspešno plaćena (test)');
    };

    const onError = (err) => {
        toast.error(err?.data?.message || err.message || 'Greška prilikom plaćanja porudžbine');
    };

    const createOrder = (data, actions) => {
        const isMembershipOrder = order?.orderItems?.some(
            (item) => item.category === 'Članarine'
        );

        const amountValue = isMembershipOrder
            ? (order.totalPrice / 120).toFixed(2)
            : (order.totalPrice / 117.2).toFixed(2);

        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: amountValue,
                            currency_code: 'USD',
                        },
                    },
                ],
            })
            .then((orderID) => orderID);
    };

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId).unwrap();
            refetch();
            toast.success('Porudžbina je označena kao dostavljena');
        } catch (err) {
            toast.error(
                err?.data?.message ||
                    err.message ||
                    'Greška prilikom označavanja porudžbine kao dostavljene'
            );
        }
    };

    const updateMembershipDatesHandler = async () => {
        if (!membershipStartDate || !membershipEndDate) {
            toast.error('Unesite oba datuma');
            return;
        }
        try {
            await updateOrderMembershipDates({
                orderId,
                membershipStartDate,
                membershipEndDate,
            }).unwrap();
            refetch();
            try {
                const profile = await refetchProfile().unwrap();
                if (profile) dispatch(setCredentials(profile));
            } catch (e) {
                // ignore
            }
            toast.success('Datumi članarine ažurirani');
        } catch (err) {
            toast.error(err?.data?.message || err.message || 'Greška prilikom ažuriranja datuma');
        }
    };

    const cancelMembershipHandler = async () => {
        try {
            await updateOrderMembershipDates({
                orderId,
                membershipEndDate: new Date(0).toISOString(),
            }).unwrap();
            refetch();
            try {
                const profile = await refetchProfile().unwrap();
                if (profile) dispatch(setCredentials(profile));
            } catch (e) {
                // ignore
            }
            toast.success('Članarina je ukinuta');
        } catch (err) {
            toast.error(err?.data?.message || err.message || 'Greška prilikom ukidanja članarine');
        }
    };

    const confirmGymPaymentAndDelivery = async () => {
        try {
            await payAndDeliverOrder({ orderId, details: {} }).unwrap();
            refetch();
            toast.success('Porudžbina je označena kao plaćena i preuzeta');
        } catch (err) {
            toast.error(
                err?.data?.message || err.message || 'Greška prilikom potvrde porudžbine'
            );
        }
    };

    if (isLoading) return <Loader />;
    if (isError) {
        return <Message variant='danger'>Greška prilikom učitavanja porudžbine</Message>;
    }

    return (
        <>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '2rem',
                letterSpacing: '0.02em'
            }}>
                📋 Porudžbina #{order._id.substring(0, 8).toUpperCase()}
            </h1>

            <Row className='gy-4'>
                {/* LEFT: Order Details */}
                <Col lg={8}>
                    {/* Shipping Address */}
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
                            marginBottom: '1.5rem'
                        }}>
                            📍 Adresa za isporuku
                        </h3>
                        <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                            <p style={{ marginBottom: '0.8rem' }}>
                                <strong style={{ color: '#ffffff' }}>Ime:</strong> {order.user.name}
                            </p>
                            <p style={{ marginBottom: '0.8rem' }}>
                                <strong style={{ color: '#ffffff' }}>Email:</strong>{' '}
                                <a href={`mailto:${order.user.email}`} style={{ color: '#ccff00', textDecoration: 'none' }}>
                                    {order.user.email}
                                </a>
                            </p>
                            <p style={{ marginBottom: '0.8rem' }}>
                                <strong style={{ color: '#ffffff' }}>Adresa:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                        </div>
                        {order.isDelivered ? (
                            <Message variant='success'>
                                ✓ Dostavljeno: {order.deliveredAt}
                            </Message>
                        ) : (
                            <Message variant='danger'>⏳ Nije dostavljeno</Message>
                        )}
                    </Card>

                    {/* Payment Status */}
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
                            marginBottom: '1.5rem'
                        }}>
                            💳 Način plaćanja
                        </h3>
                        <p style={{ color: '#cbd5e1', marginBottom: '1rem', fontSize: '1.05rem', fontWeight: 700 }}>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid && order.isDelivered ? (
                            <Message variant='success'>✓ Plaćeno i Uručeno</Message>
                        ) : order.isPaid ? (
                            <Message variant='success'>✓ Plaćeno: {order.paidAt}</Message>
                        ) : order.paymentMethod === 'U teretani' ? (
                            <Message variant='warning'>⏳ Plaćanje će biti izvršeno na recepciji teretane.</Message>
                        ) : (
                            <Message variant='danger'>✗ Nije plaćeno</Message>
                        )}
                    </Card>

                    {/* Membership Admin Panel */}
                    {userInfo && userInfo.isAdmin && order?.orderItems?.some((item) => item.category === 'Članarine') && (
                        <Card className='border-0 shadow-soft mb-3' style={{
                            background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                            padding: '2rem',
                            borderRadius: '16px',
                            borderLeft: '4px solid #22c55e'
                        }}>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: 800,
                                color: '#22c55e',
                                marginBottom: '1.5rem'
                            }}>
                                👤 Datumi Članarine (Admin)
                            </h3>
                            <Form.Group className='mb-3'>
                                <Form.Label style={{ fontWeight: 700, color: '#cbd5e1' }}>Početak članarine</Form.Label>
                                <Form.Control
                                    type='date'
                                    value={membershipStartDate}
                                    onChange={(e) => setMembershipStartDate(e.target.value)}
                                    style={{
                                        background: '#252a37 !important',
                                        border: '1px solid #3f485e !important',
                                        color: '#ffffff !important',
                                        borderRadius: '10px'
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={{ fontWeight: 700, color: '#cbd5e1' }}>Kraj članarine</Form.Label>
                                <Form.Control
                                    type='date'
                                    value={membershipEndDate}
                                    onChange={(e) => setMembershipEndDate(e.target.value)}
                                    style={{
                                        background: '#252a37 !important',
                                        border: '1px solid #3f485e !important',
                                        color: '#ffffff !important',
                                        borderRadius: '10px'
                                    }}
                                />
                            </Form.Group>
                            {loadingMembershipUpdate && <Loader />}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button
                                    type='button'
                                    className='add-to-cart-btn'
                                    onClick={updateMembershipDatesHandler}
                                    disabled={loadingMembershipUpdate}
                                    style={{
                                        flex: 1,
                                        padding: '0.8rem',
                                        fontWeight: 700,
                                        borderRadius: '10px',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    ✓ Spremi Izmene
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline-danger'
                                    onClick={cancelMembershipHandler}
                                    disabled={loadingMembershipUpdate}
                                    style={{
                                        flex: 1,
                                        padding: '0.8rem',
                                        fontWeight: 700,
                                        borderRadius: '10px',
                                        fontSize: '0.95rem',
                                        border: '1px solid #ef4444',
                                        color: '#ef4444'
                                    }}
                                >
                                    ✗ Ukini
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* Order Items */}
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
                            marginBottom: '1.5rem'
                        }}>
                            📦 Stavke porudžbine
                        </h3>
                        {order.orderItems.length === 0 ? (
                            <Message>Porudžbina je prazna</Message>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem'
                            }}>
                                {order.orderItems.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        paddingBottom: '1.5rem',
                                        borderBottom: index !== order.orderItems.length - 1 ? '1px solid #2e3545' : 'none'
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

                {/* RIGHT: Order Summary & Actions */}
                <Col lg={4}>
                    <Card className='border-0 shadow-soft mb-3' style={{
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
                            📋 Ukupno
                        </h2>

                        <div style={{
                            borderTop: '1px solid #2e3545',
                            borderBottom: '1px solid #2e3545',
                            padding: '1.5rem 0',
                            marginBottom: '2rem'
                        }}>
                            <Row style={{ marginBottom: '1rem' }}>
                                <Col>
                                    <span style={{ color: '#94a3b8' }}>Proizvodi</span>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                        {order.itemsPrice.toFixed(2)} RSD
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '1rem' }}>
                                <Col>
                                    <span style={{ color: '#94a3b8' }}>Cena dostave</span>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                        {order.shippingPrice.toFixed(2)} RSD
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '1rem' }}>
                                <Col>
                                    <span style={{ color: '#94a3b8' }}>PDV</span>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                        {order.taxPrice.toFixed(2)} RSD
                                    </span>
                                </Col>
                            </Row>
                        </div>

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
                                    UKUPNA CENA:
                                </span>
                            </Col>
                            <Col style={{ textAlign: 'right' }}>
                                <span style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 900,
                                    color: '#ccff00'
                                }}>
                                    {order.totalPrice.toFixed(2)} RSD
                                </span>
                            </Col>
                        </Row>

                        {/* PayPal Payment for Online Orders */}
                        {!order.isPaid && order.paymentMethod !== 'U teretani' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                {loadingPay && <Loader />}
                                {isPending ? (
                                    <Loader />
                                ) : (
                                    <div style={{
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(59, 130, 246, 0.3)'
                                    }}>
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Gym Payment - User View */}
                        {!order.isPaid && order.paymentMethod === 'U teretani' && userInfo && !userInfo.isAdmin && (
                                <Message variant='info' style={{ marginBottom: '1.5rem' }}>
                                ✓ Porudžbina je uspešno kreirana! Molimo vas da dođete na recepciju teretane kako biste preuzeli proizvode i izvršili plaćanje.
                            </Message>
                        )}

                        {/* Admin Big Bold Button for Gym Payment */}
                        {!order.isPaid && order.paymentMethod === 'U teretani' && userInfo && userInfo.isAdmin && (
                                <Button
                                type='button'
                                className='add-to-cart-btn'
                                onClick={confirmGymPaymentAndDelivery}
                                disabled={loadingPayAndDeliver}
                                style={{
                                    width: '100%',
                                    padding: '1.2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 900,
                                    borderRadius: '14px',
                                    letterSpacing: '0.03em',
                                    marginBottom: '1.5rem',
                                    textTransform: 'uppercase'
                                }}
                                >
                                ✓ Potvrdi plaćanje i preuzimanje
                            </Button>
                        )}

                        {/* Deliver Button */}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <Button
                                type='button'
                                className='add-to-cart-btn'
                                onClick={deliverOrderHandler}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    fontWeight: 800,
                                    borderRadius: '12px',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.95rem'
                                }}
                            >
                                ✓ Označi kao dostavljeno
                            </Button>
                        )}

                        <div style={{
                            padding: '0.8rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '10px',
                            color: '#93c5fd',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            lineHeight: 1.6
                        }}>
                            ℹ️ Status: {order.isPaid ? '✓ Plaćeno' : '⏳ Čeka se plaćanje'}
                        </div>
                    </Card>

                    {/* Discreet Test Button at Bottom (Admin Only) */}
                    {userInfo && userInfo.isAdmin && !order.isPaid && order.paymentMethod !== 'U teretani' && (
                        <div style={{
                            textAlign: 'center',
                            paddingTop: '0.5rem',
                            marginTop: '1rem'
                        }}>
                            <Button
                                onClick={onApproveTest}
                                variant='outline-secondary'
                                size='sm'
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.3rem 0.6rem',
                                    color: '#64748b',
                                    border: '1px solid #3f485e',
                                    opacity: 0.6
                                }}
                                title='Test payment (admin only)'
                            >
                                🔧
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;
