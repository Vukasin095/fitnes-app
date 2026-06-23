import React, { useEffect, useMemo, useState } from 'react';
import { Table, Form, Button, Row, Col, Badge, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaCheckCircle, FaUser, FaArrowRight } from 'react-icons/fa';
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
        <>
            <Row className='gy-4'>
                {/* LEFT COLUMN: User Profile */}
                <Col md={4} lg={3}>
                    {/* Profile Header Card */}
                        <Card className='profile-card-shell border-0 shadow-soft mb-3'>
                            <div className='profile-avatar'>
                                <FaUser className='profile-avatar-icon' />
                            </div>
                            <h2 className='profile-heading'>{userInfo.name}</h2>

                            {/* Glowing Member Badge */}
                            <div className='profile-badge-wrap'>
                                <Badge className={`member-badge ${userInfo?.isMember ? 'member-active' : 'member-inactive'}`}>
                                    {userInfo?.isMember ? (
                                        <>
                                            <FaCheckCircle className='member-badge-icon' />
                                            Registrovan član
                                        </>
                                    ) : (
                                        '[ Neregistrovan ]'
                                    )}
                                </Badge>
                            </div>

                            <p className='profile-email'>{userInfo.email}</p>
                        </Card>

                    {/* Membership Status Panel */}
                    <Card className='profile-status-card border-0 shadow-soft mb-3'>
                        <h4 className='profile-form-title'>📊 Status članstva</h4>

                        {(() => {
                            const now = Date.now();
                            const isActivated = userInfo?.isMember === true;
                            const hasMembershipOrder = !!latestMembershipOrder;
                            const endTime = membershipExpiresAt ? new Date(membershipExpiresAt).getTime() : null;

                            if (!isActivated) {
                                return (
                                    <div className='profile-status-alert profile-status-missing'>
                                        <div className='profile-status-title'>⚠️ Nalog nije aktiviran</div>
                                        <div className='profile-status-body'>
                                            Kontaktirajte radnika na recepciji da aktivirate nalog ili posetite stranicu{' '}
                                            <LinkContainer to='/memberships'>
                                                <span className='link-highlight'>članskih kartica</span>
                                            </LinkContainer>.
                                        </div>
                                    </div>
                                );
                            }

                            if (isActivated && (!hasMembershipOrder || (endTime !== null && now > endTime))) {
                                return (
                                    <div className='profile-status-alert profile-status-expired'>
                                        <div className='profile-status-title'>⏰ Članarina je istekla</div>
                                        <p className='profile-status-body'>
                                            Nemate aktivnu članarinu. Možete uplatiti novu{' '}
                                            <LinkContainer to='/memberships'>
                                                <span className='link-highlight'>ovde</span>
                                            </LinkContainer>.
                                        </p>
                                    </div>
                                );
                            }

                            if (isActivated && endTime !== null && now <= endTime) {
                                return (
                                    <div className='profile-status-alert profile-status-active'>
                                        <div className='profile-status-title'>✓ Aktivna i plaćena</div>
                                        <div className='profile-status-body'>
                                            <div>
                                                <strong>Početak:</strong> {membershipStartsAt ? membershipStartsAt.toLocaleDateString('sr-RS') : 'Nije navedeno'}
                                            </div>
                                            <div>
                                                <strong>Istek:</strong> {membershipExpiresAt ? new Date(membershipExpiresAt).toLocaleDateString('sr-RS') : 'Nije navedeno'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return null;
                        })()}
                    </Card>

                    {/* Edit Profile Form */}
                    <Card className='profile-edit-card border-0 shadow-soft mb-3'>
                        <h4 className='profile-form-title'>✏️ Uredi profil</h4>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className='mb-3' controlId='name'>
                                <Form.Label className='form-label'>Ime</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Unesite ime'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='form-input'
                                />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='email'>
                                <Form.Label className='form-label'>Email</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Unesite email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='form-input'
                                />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='password'>
                                <Form.Label className='form-label'>Lozinka</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Unesite lozinku'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='form-input'
                                />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='confirmPassword'>
                                <Form.Label className='form-label'>Potvrdi lozinku</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Potvrdi lozinku'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className='form-input'
                                />
                            </Form.Group>
                            <Button type='submit' className='neon-submit-btn'>✓ Ažuriraj profil</Button>
                        </Form>
                    </Card>
                </Col>

                {/* RIGHT COLUMN: Orders History */}
                <Col md={8} lg={9}>
                    <Card className='border-0 shadow-soft profile-orders-card'>
                        <h2 className='profile-orders-title'>
                            📦 Moje porudžbine
                        </h2>

                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message variant='danger'>
                                {error?.data?.message || error.error}
                            </Message>
                        ) : orders && orders.length > 0 ? (
                            <div className='orders-table-wrap'>
                                <Table striped hover responsive className='table-sm mb-0 orders-table'>
                                    <thead>
                                        <tr>
                                            <th>ID PORUDŽBINE</th>
                                            <th>DATUM</th>
                                            <th>CENA</th>
                                            <th>PLAĆANJE</th>
                                            <th>DOSTAVLJENO</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className='orders-table-row'>
                                                <td className='orders-table-id'>{order._id.substring(0, 8)}...</td>
                                                <td className='orders-table-date'>{order.createdAt.substring(0, 10)}</td>
                                                <td className='orders-table-price'>{order.totalPrice} RSD</td>
                                                <td className='orders-table-paid'>
                                                    {order.isPaid ? (
                                                        <Badge className='status-badge status-paid'>✓ {order.paidAt.substring(0, 10)}</Badge>
                                                    ) : (
                                                        <FaTimes className='status-icon status-missing' />
                                                    )}
                                                </td>
                                                <td className='orders-table-delivered'>
                                                    {order.isDelivered ? (
                                                        <Badge className='status-badge status-delivered'>✓ {order.deliveredAt.substring(0, 10)}</Badge>
                                                    ) : (
                                                        <FaTimes className='status-icon status-missing' />
                                                    )}
                                                </td>
                                                <td className='orders-table-actions'>
                                                    <LinkContainer to={`/order/${order._id}`}>
                                                        <Button variant='outline-primary' size='sm' className='order-details-btn'>Detalji <FaArrowRight /></Button>
                                                    </LinkContainer>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <Message>Nemate nikakvih porudžbina</Message>
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default ProfileScreen;