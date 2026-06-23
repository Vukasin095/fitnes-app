import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Card, Container, Row } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
        <Container style={{ paddingBottom: '3rem' }}>
            <Row className='mb-4' style={{
                paddingBottom: '2rem',
                borderBottom: '2px solid #3f4756'
            }}>
                    <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.02em',
                    margin: 0
                }}>
                    📋 UPRAVLJANJE PORUDŽBINAMA
                </h1>
            </Row>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <Card className='border-0 shadow-soft' style={{
                    background: 'linear-gradient(135deg, #282d3a, #222631)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid #3f4756'
                }}>
                    <div style={{ overflowX: 'auto', borderRadius: '12px' }}>
                        <Table striped hover responsive className='table-sm mb-0' style={{ color: '#ffffff' }}>
                            <thead style={{
                                background: '#1a1e27',
                                borderBottom: '2px solid #3f4756'
                            }}>
                                <tr>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>ID</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>KORISNIK</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>DATUM</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>UKUPNA CENA</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>PLAĆANJE</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>DOSTAVA</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem'
                                    }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} style={{
                                        borderBottom: '1px solid #3f4756',
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
                                            {order.user && order.user.name}
                                        </td>
                                        <td style={{ color: '#94a3b8', padding: '1rem' }}>
                                            {order.createdAt.substring(0, 10)}
                                        </td>
                                        <td style={{ color: '#ccff00', fontWeight: 800, padding: '1rem' }}>
                                            {order.totalPrice} RSD
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {order.isPaid ? (
                                                <span style={{ color: '#22c55e', fontWeight: 700 }}>✓ {order.paidAt.substring(0, 10)}</span>
                                            ) : (
                                                <FaTimes style={{ color: '#ef4444', fontSize: '1.2rem' }} />
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {order.isDelivered ? (
                                                <span style={{ color: '#22c55e', fontWeight: 700 }}>✓ {order.deliveredAt.substring(0, 10)}</span>
                                            ) : (
                                                <FaTimes style={{ color: '#ef4444', fontSize: '1.2rem' }} />
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button style={{
                                                    background: 'transparent',
                                                    border: '1px solid #ccff00',
                                                    color: '#ccff00',
                                                    borderRadius: '8px',
                                                    padding: '0.5rem 0.8rem',
                                                    fontWeight: 700,
                                                    transition: 'all 0.3s ease',
                                                    fontSize: '0.85rem'
                                                }} onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#ccff00';
                                                    e.currentTarget.style.color = '#0f1117';
                                                }} onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#ccff00';
                                                }}>
                                                    Detalji
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}
        </Container>
    );
};

export default OrderListScreen;
