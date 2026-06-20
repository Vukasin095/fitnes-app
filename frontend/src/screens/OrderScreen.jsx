import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card, Form } from 'react-bootstrap';
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
            <h1>Porudžbina {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Adresa za isporuku</h2>
                            <p>
                                <strong>Ime: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{' '}
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Adresa: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>
                                    Dostavljeno datuma: {order.deliveredAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>Nije dostavljeno</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Način plaćanja</h2>
                            <p>
                                <strong>Metod: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid && order.isDelivered ? (
                                <Message variant='success'>Plaćeno i Uručeno</Message>
                            ) : order.isPaid ? (
                                <Message variant='success'>Plaćeno datuma: {order.paidAt}</Message>
                            ) : order.paymentMethod === 'U teretani' ? (
                                <Message variant='warning'>
                                    Plaćanje će biti izvršeno na recepciji teretane.
                                </Message>
                            ) : (
                                <Message variant='danger'>Nije plaćeno</Message>
                            )}
                        </ListGroup.Item>

                        {userInfo &&
                            userInfo.isAdmin &&
                            order?.orderItems?.some((item) => item.category === 'Članarine') && (
                                <ListGroup.Item>
                                    <h2>Datumi Članarine (Admin)</h2>
                                    <Form.Group className='my-2'>
                                        <Form.Label>Početak članarine</Form.Label>
                                        <Form.Control
                                            type='date'
                                            value={membershipStartDate}
                                            onChange={(e) => setMembershipStartDate(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className='my-2'>
                                        <Form.Label>Kraj članarine</Form.Label>
                                        <Form.Control
                                            type='date'
                                            value={membershipEndDate}
                                            onChange={(e) => setMembershipEndDate(e.target.value)}
                                        />
                                    </Form.Group>
                                    {loadingMembershipUpdate && <Loader />}
                                    <Button
                                        type='button'
                                        variant='primary'
                                        onClick={updateMembershipDatesHandler}
                                        disabled={loadingMembershipUpdate}
                                    >
                                        Spremi Izmene Datuma
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='danger'
                                        className='ms-2'
                                        onClick={cancelMembershipHandler}
                                        disabled={loadingMembershipUpdate}
                                    >
                                        Ukini Članarinu
                                    </Button>
                                </ListGroup.Item>
                            )}

                        <ListGroup.Item>
                            <h2>Proizvodi</h2>
                            {order.orderItems.length === 0 ? (
                                <Message>Porudžbina je prazna</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={8}>
                                                    {item.qty} x {item.price.toFixed(2)} RSD ={' '}
                                                    {(item.qty * item.price).toFixed(2)} RSD
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Ukupno</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Proizvodi</Col>
                                    <Col>{order.itemsPrice.toFixed(2)} RSD</Col>
                                </Row>
                                <Row>
                                    <Col>Cena dostave</Col>
                                    <Col>{order.shippingPrice.toFixed(2)} RSD</Col>
                                </Row>
                                <Row>
                                    <Col>Pdv</Col>
                                    <Col>{order.taxPrice.toFixed(2)} RSD</Col>
                                </Row>
                                <Row>
                                    <Col>Ukupna cena</Col>
                                    <Col>{order.totalPrice.toFixed(2)} RSD</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && order.paymentMethod !== 'U teretani' && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {isPending ? (
                                        <Loader />
                                    ) : (
                                        <div>
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            )}

                            {!order.isPaid && order.paymentMethod === 'U teretani' && (
                                <ListGroup.Item>
                                    {userInfo && !userInfo.isAdmin ? (
                                        <Message variant='info'>
                                            Porudžbina je uspešno kreirana! Molimo vas da dođete na
                                            recepciju teretane kako biste preuzeli proizvode i izvršili
                                            plaćanje.
                                        </Message>
                                    ) : (
                                        <Button
                                            type='button'
                                            className='btn-block'
                                            onClick={confirmGymPaymentAndDelivery}
                                            disabled={loadingPayAndDeliver}
                                        >
                                            Potvrdi plaćanje i preuzimanje
                                        </Button>
                                    )}
                                </ListGroup.Item>
                            )}

                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button
                                        type='button'
                                        className='btn btn-block'
                                        onClick={deliverOrderHandler}
                                    >
                                        Označi kao dostavljeno
                                    </Button>
                                </ListGroup.Item>
                            )}

                            {userInfo && userInfo.isAdmin && !order.isPaid && order.paymentMethod !== 'U teretani' && (
                                <ListGroup.Item className='text-end'>
                                    <small className='text-muted d-block mb-1'>
                                        🔧 Test Mode (Samo za odbranu projekta):
                                    </small>
                                    <Button
                                        onClick={onApproveTest}
                                        variant='outline-secondary'
                                        size='sm'
                                    >
                                        🔧
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;
