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
                    <Card className='border-0 shadow-soft mb-3' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2.5rem 2rem',
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '3.5rem',
                            marginBottom: '1rem'
                        }}>
                            <FaUser style={{ color: '#ccff00' }} />
                        </div>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            color: '#ffffff',
                            marginBottom: '0.5rem',
                            wordBreak: 'break-word'
                        }}>
                            {userInfo.name}
                        </h2>

                        {/* Glowing Member Badge */}
                        <div style={{
                            marginBottom: '1.5rem'
                        }}>
                            <Badge style={{
                                background: userInfo?.isMember 
                                    ? 'linear-gradient(135deg, #22c55e, #10b981)' 
                                    : 'linear-gradient(135deg, #64748b, #475569)',
                                color: '#ffffff',
                                padding: '0.7rem 1.2rem',
                                borderRadius: '10px',
                                fontWeight: 900,
                                fontSize: '0.9rem',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                boxShadow: userInfo?.isMember 
                                    ? '0 0 30px rgba(34, 197, 94, 0.4)' 
                                    : 'none',
                                display: 'inline-block'
                            }}>
                                {userInfo?.isMember ? (
                                    <>
                                        <FaCheckCircle style={{ marginRight: '0.5rem' }} />
                                        Registrovan član
                                    </>
                                ) : (
                                    '[ Neregistrovan ]'
                                )}
                            </Badge>
                        </div>

                        <p style={{
                            color: '#94a3b8',
                            fontSize: '0.9rem',
                            margin: '0'
                        }}>
                            {userInfo.email}
                        </p>
                    </Card>

                    {/* Membership Status Panel */}
                    <Card className='border-0 shadow-soft mb-3' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2rem',
                        borderRadius: '16px',
                        borderLeft: userInfo?.isMember ? '4px solid #22c55e' : '4px solid #ef4444'
                    }}>
                        <h4 style={{
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            📊 Status članstva
                        </h4>

                        {(() => {
                            const now = Date.now();
                            const isActivated = userInfo?.isMember === true;
                            const hasMembershipOrder = !!latestMembershipOrder;
                            const endTime = membershipExpiresAt ? new Date(membershipExpiresAt).getTime() : null;

                            if (!isActivated) {
                                return (
                                    <div style={{
                                        padding: '1.5rem',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '10px',
                                        color: '#fca5a5'
                                    }}>
                                        <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                            ⚠️ Nalog nije aktiviran
                                        </div>
                                        <div style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
                                            Kontaktirajte radnika na recepciji da aktivirate nalog ili posetite stranicu{' '}
                                            <LinkContainer to='/memberships'>
                                                <span style={{ color: '#ccff00', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 }}>
                                                    članskih kartica
                                                </span>
                                            </LinkContainer>.
                                        </div>
                                    </div>
                                );
                            }

                            if (isActivated && (!hasMembershipOrder || (endTime !== null && now > endTime))) {
                                return (
                                    <div style={{
                                        padding: '1.5rem',
                                        background: 'rgba(234, 179, 8, 0.1)',
                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                        borderRadius: '10px',
                                        color: '#fde047'
                                    }}>
                                        <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                            ⏰ Članarina je istekla
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
                                            Nemate aktivnu članarinu. Možete uplatiti novu{' '}
                                            <LinkContainer to='/memberships'>
                                                <span style={{ color: '#ccff00', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 }}>
                                                    ovde
                                                </span>
                                            </LinkContainer>.
                                        </p>
                                    </div>
                                );
                            }

                            if (isActivated && endTime !== null && now <= endTime) {
                                return (
                                    <div style={{
                                        padding: '1.5rem',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        borderRadius: '10px',
                                        color: '#86efac'
                                    }}>
                                        <div style={{ fontWeight: 700, marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                                            ✓ Aktivna i plaćena
                                        </div>
                                        <div style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
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
                    <Card className='border-0 shadow-soft' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2rem',
                        borderRadius: '16px'
                    }}>
                        <h4 style={{
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            ✏️ Uredi profil
                        </h4>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className='mb-3' controlId='name'>
                                <Form.Label style={{
                                    fontWeight: 700,
                                    color: '#cbd5e1',
                                    fontSize: '0.9rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    Ime
                                </Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Unesite ime'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        background: '#252a37 !important',
                                        border: '1px solid #3f485e !important',
                                        color: '#ffffff !important',
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='email'>
                                <Form.Label style={{
                                    fontWeight: 700,
                                    color: '#cbd5e1',
                                    fontSize: '0.9rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    Email
                                </Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Unesite email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        background: '#252a37 !important',
                                        border: '1px solid #3f485e !important',
                                        color: '#ffffff !important',
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='password'>
                                <Form.Label style={{
                                    fontWeight: 700,
                                    color: '#cbd5e1',
                                    fontSize: '0.9rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    Lozinka
                                </Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Unesite lozinku'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        background: '#252a37 !important',
                                        border: '1px solid #3f485e !important',
                                        color: '#ffffff !important',
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='confirmPassword'>
                                <Form.Label style={{
                                    fontWeight: 700,
                                    color: '#cbd5e1',
                                    fontSize: '0.9rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    Potvrdi lozinku
                                </Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Potvrdi lozinku'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{
                                        background: '#252a37 !important',
                                        border: '1px solid #3f485e !important',
                                        color: '#ffffff !important',
                                        borderRadius: '10px',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>
                            <Button type='submit' className='add-to-cart-btn' style={{
                                width: '100%',
                                padding: '0.8rem',
                                fontWeight: 800,
                                borderRadius: '12px',
                                fontSize: '0.95rem'
                            }}>
                                ✓ Ažuriraj profil
                            </Button>
                        </Form>
                    </Card>
                </Col>

                {/* RIGHT COLUMN: Orders History */}
                <Col md={8} lg={9}>
                    <Card className='border-0 shadow-soft' style={{
                        background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                        padding: '2rem',
                        borderRadius: '20px'
                    }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: 900,
                            color: '#ffffff',
                            marginBottom: '2rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            📦 Moje porudžbine
                        </h2>

                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message variant='danger'>
                                {error?.data?.message || error.error}
                            </Message>
                        ) : orders && orders.length > 0 ? (
                            <div style={{
                                overflowX: 'auto',
                                borderRadius: '12px',
                                border: '1px solid #2e3545'
                            }}>
                                <Table striped hover responsive className='table-sm mb-0' style={{
                                    color: '#ffffff'
                                }}>
                                    <thead style={{
                                        background: '#1c1f2a',
                                        borderBottom: '2px solid #2e3545'
                                    }}>
                                        <tr>
                                            <th style={{ color: '#94a3b8', fontWeight: 800, padding: '1rem' }}>ID PORUDŽBINE</th>
                                            <th style={{ color: '#94a3b8', fontWeight: 800, padding: '1rem' }}>DATUM</th>
                                            <th style={{ color: '#94a3b8', fontWeight: 800, padding: '1rem' }}>CENA</th>
                                            <th style={{ color: '#94a3b8', fontWeight: 800, padding: '1rem' }}>PLAĆANJE</th>
                                            <th style={{ color: '#94a3b8', fontWeight: 800, padding: '1rem' }}>DOSTAVLJENO</th>
                                            <th style={{ color: '#94a3b8', fontWeight: 800, padding: '1rem' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} style={{
                                                borderBottom: '1px solid #2e3545',
                                                transition: 'all 0.3s ease'
                                            }} onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(204, 255, 0, 0.05)';
                                            }} onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}>
                                                <td style={{ color: '#ccff00', fontWeight: 700, padding: '1rem' }}>
                                                    {order._id.substring(0, 8)}...
                                                </td>
                                                <td style={{ color: '#cbd5e1', padding: '1rem' }}>
                                                    {order.createdAt.substring(0, 10)}
                                                </td>
                                                <td style={{ color: '#ccff00', fontWeight: 800, padding: '1rem' }}>
                                                    {order.totalPrice} RSD
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {order.isPaid ? (
                                                        <Badge bg='' style={{
                                                            background: 'rgba(34, 197, 94, 0.2)',
                                                            color: '#22c55e',
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '6px',
                                                            fontWeight: 700,
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            ✓ {order.paidAt.substring(0, 10)}
                                                        </Badge>
                                                    ) : (
                                                        <FaTimes style={{ color: '#ef4444', fontSize: '1.2rem' }} />
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {order.isDelivered ? (
                                                        <Badge bg='' style={{
                                                            background: 'rgba(34, 197, 94, 0.2)',
                                                            color: '#22c55e',
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '6px',
                                                            fontWeight: 700,
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            ✓ {order.deliveredAt.substring(0, 10)}
                                                        </Badge>
                                                    ) : (
                                                        <FaTimes style={{ color: '#ef4444', fontSize: '1.2rem' }} />
                                                    )}
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '1rem' }}>
                                                    <LinkContainer to={`/order/${order._id}`}>
                                                        <Button variant='outline-primary' size='sm' style={{
                                                            border: '1px solid #ccff00',
                                                            color: '#ccff00',
                                                            fontWeight: 700,
                                                            borderRadius: '6px',
                                                            padding: '0.4rem 0.8rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            Detalji <FaArrowRight />
                                                        </Button>
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