import React, { useEffect, useMemo, useState } from 'react';
import { Table, Form, Button, Row, Col, Badge, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { userInfo } = useSelector((state) => state.auth);
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();
    const [updateProfile] = useProfileMutation();

    const membershipOrders = useMemo(
        () =>
            orders?.filter(
                (order) =>
                    order.isPaid &&
                    order.orderItems?.some((item) => item.category === 'Članarine')
            ) ?? [],
        [orders]
    );

    const latestMembershipOrder = useMemo(() => {
        return membershipOrders
            .slice()
            .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))[0];
    }, [membershipOrders]);

    const membershipDurationDays = (order) => {
        const membershipItem = order?.orderItems?.find(
            (item) => item.category === 'Članarine'
        );
        if (!membershipItem) return 30;
        const name = membershipItem.name?.toLowerCase() || '';
        if (name.includes('polugodi')) return 180;
        return 30;
    };

    const membershipExpiresAt = latestMembershipOrder
        ? latestMembershipOrder.membershipEndDate
            ? new Date(latestMembershipOrder.membershipEndDate)
            : new Date(
                  new Date(latestMembershipOrder.paidAt).getTime() +
                      membershipDurationDays(latestMembershipOrder) * 24 * 60 * 60 * 1000
              )
        : null;

    const membershipStartsAt = latestMembershipOrder
        ? latestMembershipOrder.membershipStartDate
            ? new Date(latestMembershipOrder.membershipStartDate)
            : new Date(latestMembershipOrder.paidAt)
        : null;

    
    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
    }, [userInfo.email, userInfo.name]);
    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Lozinke se ne poklapaju');
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    name,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success('Profil je ažuriran');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };
    return (
        <Row>
            <Col md={3}>
                <h2>Profil korisnika</h2>
                <h5 className='mb-2'>
                    {userInfo.name}{' '}
                    <Badge bg={userInfo?.isMember ? 'success' : 'danger'}>
                        {userInfo?.isMember
                            ? '[ Registrovan Član Teretane ]'
                            : '[ Neregistrovan Korisnik ]'}
                    </Badge>
                </h5>
                <Card className='my-3'>
                    <Card.Body>
                        {/* Comprehensive membership status card (CASE A / B / C) */}
                        {(() => {
                            const now = Date.now();
                            const isActivated = userInfo?.isMember === true;
                            const hasMembershipOrder = !!latestMembershipOrder;
                            const endTime = membershipExpiresAt ? new Date(membershipExpiresAt).getTime() : null;

                            // CASE A: Account not activated at reception
                            if (!isActivated) {
                                return (
                                    <>
                                        <h5>
                                            Status: <Badge bg='secondary'>Nalog nije aktiviran na recepciji</Badge>
                                        </h5>
                                        <div>Molimo vas da se javite radniku na recepciji radi aktivacije naloga.</div>
                                    </>
                                );
                            }

                            // CASE B: Account activated but no active membership
                            if (isActivated && (!hasMembershipOrder || (endTime !== null && now > endTime))) {
                                return (
                                    <>
                                        <h5>
                                            Status: <Badge bg='warning'>Članarina Istekla / Neaktivna</Badge>
                                        </h5>
                                        <div>Nemate aktivnu članarinu. Možete uplatiti novu na stranici Članarine.</div>
                                    </>
                                );
                            }

                            // CASE C: Active paid membership
                            if (isActivated && endTime !== null && now <= endTime) {
                                return (
                                    <>
                                        <h5>
                                            Status: <Badge bg='success'>PLAĆENA I AKTIVNA</Badge>
                                        </h5>
                                        <div>
                                            Članarina traje od: {membershipStartsAt ? membershipStartsAt.toLocaleDateString('hr-HR') : 'Nije navedeno'} do: {membershipExpiresAt ? new Date(membershipExpiresAt).toLocaleDateString('hr-HR') : 'Nije navedeno'}
                                        </div>
                                    </>
                                );
                            }

                            return null;
                        })()}
                    </Card.Body>
                </Card>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='my-2' controlId='name'>
                        <Form.Label>Ime</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Unesite ime'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='email'>
                        <Form.Label>Mejl adresa</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Unesite mejl adresu'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='password'>
                        <Form.Label>Lozinka</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Unesite lozinku'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='confirmPassword'>
                        <Form.Label>Potvrdite lozinku</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Potvrdite lozinku'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary'>
                        Ažurirajte profil
                    </Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>Moje porudžbine</h2>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <Table striped table hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Datum porudžbine</th>
                                <th>Ukupna cena</th>
                                <th>Status plaćanja</th>
                                <th>Status dostave</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.totalPrice} RSD</td>
                                    <td>
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <FaTimes style={{ color: 'red' }} />
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <FaTimes style={{ color: 'red' }} />
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer
                                            to={`/order/${order._id}`}>
                                            <Button className='btn-sm'
                                                variant='light'>
                                                Detalji
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
};
export default ProfileScreen;