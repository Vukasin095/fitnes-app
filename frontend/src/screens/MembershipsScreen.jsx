import { useMemo } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaArrowLeft } from 'react-icons/fa';

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
            {/* Header */}
            <div className='memberships-header'>
                <div>
                    <h1 className='memberships-title'>
                        👑 Clanske kartice
                    </h1>
                    <p className='memberships-sub'>
                        Izaberite idealan plan za vas
                    </p>
                </div>
                <Link to='/' className='back-link'>
                    <FaArrowLeft /> Nazad na prodavnicu
                </Link>
            </div>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : memberships.length === 0 ? (
                <Message>Trenutno nema dostupnih paketa članarina.</Message>
                ) : (
                <Row className='gy-4 membership-grid'>
                    {memberships.map((product) => {
                        const days = product.countInStock || 30;
                        let durationText = '';
                        let buttonText = '';

                        if (days === 30) {
                            durationText = '1 mesec';
                            buttonText = 'Kupi mesečnu';
                        } else if (days === 90) {
                            durationText = '3 meseca';
                            buttonText = 'Kupi 3-mesečnu';
                        } else if (days === 180) {
                            durationText = '6 meseci';
                            buttonText = 'Kupi 6-mesečnu';
                        } else if (days === 365) {
                            durationText = '1 godina';
                            buttonText = 'Kupi godišnju';
                        } else {
                            durationText = `${days} dana`;
                            buttonText = `Kupi (${days} dana)`;
                        }

                        return (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='d-flex align-items-stretch'>
                                <Card className='membership-card'>
                                    {/* Title */}
                                    <h2 className='membership-card-title'>
                                        {product.name}
                                    </h2>

                                    {/* Duration Badge */}
                                    <div className='membership-duration-badge'>
                                        <span>📅</span>
                                        <span>{durationText}</span>
                                    </div>

                                    {/* Price */}
                                    <div className='membership-price'>
                                        {product.price}
                                    </div>
                                    <p className='membership-price-sub'>
                                        RSD / {durationText}
                                    </p>

                                    {/* Description */}
                                    <p className='membership-desc'>
                                        {product.description || 'Pristup svim objektima i grupnim treninzima'}
                                    </p>

                                    {/* Benefits List */}
                                    <div className='membership-benefits'>
                                        <div className='membership-benefits-list'>
                                            <div>✓ Pristup vrhunskim spravama</div>
                                            <div>✓ Profesionalna oprema</div>
                                            <div>✓ Grupni treninzi</div>
                                            <div>✓ Podrška trenera</div>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <Button
                                        type='button'
                                        disabled={!isActivated || hasActiveMembership}
                                        onClick={() => addToCartHandler(product)}
                                        className='membership-buy-btn'
                                    >
                                        {!isActivated
                                            ? '🔐 Aktivirajte nalog'
                                            : hasActiveMembership
                                            ? '✓ Aktivna clanarina'
                                            : buttonText}
                                    </Button>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Info Panel */}
            {isActivated && (
                <Card className='info-panel'>
                    <p className='info-panel-text'>
                        <strong>✓ Nalog aktiviran:</strong> Gotovi ste da pocnete! Odaberite clansku karticu koja vam odgovara i pocnite sa treningom.
                    </p>
                </Card>
            )}
        </>
    );
};

export default MembershipsScreen;
