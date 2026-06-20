import { useMemo } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const MembershipsScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { data: products, isLoading, error } = useGetProductsQuery();
    const { data: orders } = useGetMyOrdersQuery();

    const memberships = useMemo(
        () => products?.filter((product) => product.category === 'Članarine') ?? [],
        [products]
    );

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

    const now = Date.now();
    const isActivated = userInfo?.isMember === true;
    const hasActiveMembership =
        membershipExpiresAt && now <= new Date(membershipExpiresAt).getTime();

    const addToCartHandler = (product) => {
        dispatch(addToCart({ ...product, qty: 1 }));
        navigate('/cart');
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h1 className='mb-0'>Članarine</h1>
                <Link className='btn btn-sm btn-outline-secondary' to='/'>
                    ← Nazad na prodavnicu
                </Link>
            </div>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : memberships.length === 0 ? (
                <Message>Trenutno nema dostupnih članarina.</Message>
            ) : (
                <Row>
                    {memberships.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Card className='my-3 p-3 rounded'>
                                <Card.Img
                                    src={product.image}
                                    variant='top'
                                    style={{ height: '250px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Title as='div'>
                                        <strong>{product.name}</strong>
                                    </Card.Title>
                                    <Card.Text>
                                        {product.description || 'Nema opisa'}
                                    </Card.Text>
                                    <Card.Text as='h3'>{product.price} RSD</Card.Text>
                                    <Badge bg='secondary' className='mb-2'>
                                        {product.category}
                                    </Badge>
                                    <div>
                                        <Button
                                            type='button'
                                            className='btn-block'
                                            disabled={!isActivated || hasActiveMembership}
                                            onClick={() => addToCartHandler(product)}
                                        >
                                            {!isActivated
                                                ? 'Aktivirajte nalog na recepciji'
                                                : hasActiveMembership
                                                ? 'Imate aktivnu članarinu'
                                                : 'Kupi Članarinu'}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default MembershipsScreen;
