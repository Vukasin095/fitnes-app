import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Card, Container, Row } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
        <Container className='admin-page-container'>
            <Row className='mb-4 admin-header-row'>
                    <h1 className='admin-page-title'>📋 UPRAVLJANJE PORUDŽBINAMA</h1>
            </Row>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <Card className='border-0 shadow-soft admin-list-card'>
                    <div className='admin-table-wrap'>
                        <Table striped hover responsive className='table-sm mb-0 admin-table'>
                            <thead className='admin-table-head'>
                                <tr>
                                    <th className='admin-th'>ID</th>
                                    <th className='admin-th'>KORISNIK</th>
                                    <th className='admin-th'>DATUM</th>
                                    <th className='admin-th'>UKUPNA CENA</th>
                                    <th className='admin-th'>PLAĆANJE</th>
                                    <th className='admin-th'>DOSTAVA</th>
                                    <th className='admin-th'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className='admin-table-row'>
                                        <td className='admin-td id-col'>{order._id.substring(0, 8)}...</td>
                                        <td className='admin-td name-col'>{order.user && order.user.name}</td>
                                        <td className='admin-td date-col'>{order.createdAt.substring(0, 10)}</td>
                                        <td className='admin-td price-col'>{order.totalPrice} RSD</td>
                                        <td className='admin-td status-col'>
                                            {order.isPaid ? (
                                                <span className='status-badge status-paid'>✓ {order.paidAt.substring(0, 10)}</span>
                                            ) : (
                                                <FaTimes className='status-icon status-missing' />
                                            )}
                                        </td>
                                        <td className='admin-td status-col'>
                                            {order.isDelivered ? (
                                                <span className='status-badge status-paid'>✓ {order.deliveredAt.substring(0, 10)}</span>
                                            ) : (
                                                <FaTimes className='status-icon status-missing' />
                                            )}
                                        </td>
                                        <td className='admin-td actions-col'>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button className='admin-edit-btn'>Detalji</Button>
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
