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
            <h1 className='order-title'>📋 Porudžbina #{order._id.substring(0, 8).toUpperCase()}</h1>

            <Row className='gy-4'>
                {/* LEFT: Order Details */}
                <Col lg={8}>
                    {/* Shipping Address */}
                    <Card className='order-section-card order-address-card mb-3'>
                        <h3 className='order-section-title accent-neon'>📍 Adresa za isporuku</h3>
                        <div className='order-section-text'>
                            <p>
                                <strong className='text-white'>Ime:</strong> {order.user.name}
                            </p>
                            <p>
                                <strong className='text-white'>Email:</strong>{' '}
                                <a href={`mailto:${order.user.email}`} className='order-mail-link'>
                                    {order.user.email}
                                </a>
                            </p>
                            <p>
                                <strong className='text-white'>Adresa:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
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
                    <Card className='order-section-card order-payment-card mb-3'>
                        <h3 className='order-section-title accent-orange'>💳 Način plaćanja</h3>
                        <p className='order-section-sub'>{order.paymentMethod}</p>
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
                        <Card className='order-section-card order-membership-card mb-3'>
                            <h3 className='order-subheading accent-green'>👤 Datumi Članarine (Admin)</h3>
                            <Form.Group className='mb-3'>
                                <Form.Label className='form-label'>Početak članarine</Form.Label>
                                <Form.Control type='date' value={membershipStartDate} onChange={(e) => setMembershipStartDate(e.target.value)} className='form-input' />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label className='form-label'>Kraj članarine</Form.Label>
                                <Form.Control type='date' value={membershipEndDate} onChange={(e) => setMembershipEndDate(e.target.value)} className='form-input' />
                            </Form.Group>
                            {loadingMembershipUpdate && <Loader />}
                            <div className='order-admin-buttons'>
                                <Button type='button' className='add-to-cart-btn membership-save-btn' onClick={updateMembershipDatesHandler} disabled={loadingMembershipUpdate}>✓ Spremi Izmene</Button>
                                <Button type='button' variant='outline-danger' className='membership-cancel-btn' onClick={cancelMembershipHandler} disabled={loadingMembershipUpdate}>✗ Ukini</Button>
                            </div>
                        </Card>
                    )}

                    {/* Order Items */}
                    <Card className='order-section-card order-items-card mb-3'>
                        <h3 className='order-section-title accent-blue'>📦 Stavke porudžbine</h3>
                        {order.orderItems.length === 0 ? (
                            <Message>Porudžbina je prazna</Message>
                        ) : (
                            <div className='order-items-list'>
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className='order-item-row'>
                                        <Image src={item.image} alt={item.name} fluid className='order-item-image' />
                                        <div className='order-item-body'>
                                            <Link to={`/product/${item.product}`} className='order-item-link'>{item.name}</Link>
                                            <div className='order-item-meta'>{item.qty} x {item.price.toFixed(2)} RSD</div>
                                            <div className='order-item-total'>= {(item.qty * item.price).toFixed(2)} RSD</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>

                {/* RIGHT: Order Summary & Actions */}
                <Col lg={4}>
                    <Card className='order-summary-card mb-3'>
                        <h2 className='order-summary-heading'>📋 Ukupno</h2>

                        <div className='order-summary-lines'>
                            <Row className='mb-3'>
                                <Col><span className='order-summary-label'>Proizvodi</span></Col>
                                <Col className='summary-value'><span className='order-summary-value'>{order.itemsPrice.toFixed(2)} RSD</span></Col>
                            </Row>
                            <Row className='mb-3'>
                                <Col><span className='order-summary-label'>Cena dostave</span></Col>
                                <Col className='summary-value'><span className='order-summary-value'>{order.shippingPrice.toFixed(2)} RSD</span></Col>
                            </Row>
                            <Row className='mb-3'>
                                <Col><span className='order-summary-label'>PDV</span></Col>
                                <Col className='summary-value'><span className='order-summary-value'>{order.taxPrice.toFixed(2)} RSD</span></Col>
                            </Row>
                        </div>

                        <Row className='order-summary-total-row'>
                            <Col><span className='order-summary-total-label'>UKUPNA CENA:</span></Col>
                            <Col className='summary-value'><span className='order-summary-total-value'>{order.totalPrice.toFixed(2)} RSD</span></Col>
                        </Row>

                        {/* PayPal Payment for Online Orders */}
                        {!order.isPaid && order.paymentMethod !== 'U teretani' && (
                            <div className='mb-3'>
                                {loadingPay && <Loader />}
                                {isPending ? (
                                    <Loader />
                                ) : (
                                    <div className='paypal-box'>
                                        <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Gym Payment - User View */}
                        {!order.isPaid && order.paymentMethod === 'U teretani' && userInfo && !userInfo.isAdmin && (
                            <Message variant='info' className='order-message'>✓ Porudžbina je uspešno kreirana! Molimo vas da dođete na recepciju teretane kako biste preuzeli proizvode i izvršili plaćanje.</Message>
                        )}

                        {/* Admin Big Bold Button for Gym Payment */}
                        {!order.isPaid && order.paymentMethod === 'U teretani' && userInfo && userInfo.isAdmin && (
                                <Button type='button' className='add-to-cart-btn admin-confirm-btn' onClick={confirmGymPaymentAndDelivery} disabled={loadingPayAndDeliver}>✓ Potvrdi plaćanje i preuzimanje</Button>
                        )}

                        {/* Deliver Button */}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <Button type='button' className='add-to-cart-btn deliver-btn' onClick={deliverOrderHandler}>✓ Označi kao dostavljeno</Button>
                        )}

                        <div className='order-status-note'>ℹ️ Status: {order.isPaid ? '✓ Plaćeno' : '⏳ Čeka se plaćanje'}</div>
                    </Card>

                    {/* Discreet Test Button at Bottom (Admin Only) */}
                    {userInfo && userInfo.isAdmin && !order.isPaid && order.paymentMethod !== 'U teretani' && (
                        <div className='admin-test-button-wrap'>
                            <Button
                                onClick={onApproveTest}
                                variant='outline-secondary'
                                size='sm'
                                className='admin-test-button'
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
