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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3rem',
                paddingBottom: '2rem',
                borderBottom: '2px solid #2e3545'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2.8rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        margin: 0,
                        marginBottom: '0.5rem',
                        letterSpacing: '0.02em'
                    }}>
                        👑 Clanske kartice
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: '1rem',
                        margin: 0
                    }}>
                        Izaberite idealan plan za vas
                    </p>
                </div>
                <Link to='/' style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.7rem 1.4rem',
                    borderRadius: '12px',
                    background: 'rgba(204, 255, 0, 0.1)',
                    border: '1px solid #ccff00',
                    color: '#ccff00',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                }} onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(204, 255, 0, 0.2)';
                    e.target.style.boxShadow = '0 0 20px rgba(204, 255, 0, 0.3)';
                }} onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(204, 255, 0, 0.1)';
                    e.target.style.boxShadow = 'none';
                }}>
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
                <Row className='gy-4' style={{ marginBottom: '2rem' }}>
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
                                <Card className='border-0 h-100 d-flex flex-column justify-content-between p-4' style={{
                                    backgroundColor: '#282d3a',
                                    border: '1px solid #3f4756',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease-in-out',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                                }} onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(204, 255, 0, 0.3)';
                                    e.currentTarget.style.borderColor = '#ccff00';
                                }} onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
                                    e.currentTarget.style.borderColor = '#3f4756';
                                }}>
                                    {/* Title */}
                                    <h2 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 900,
                                        color: '#ffffff',
                                        marginBottom: '1rem',
                                        letterSpacing: '0.02em'
                                    }}>
                                        {product.name}
                                    </h2>

                                    {/* Duration Badge */}
                                    <div className='fw-bold' style={{
                                        background: 'rgba(59, 130, 246, 0.12)',
                                        color: '#93c5fd',
                                        padding: '0.65rem 1rem',
                                        borderRadius: '999px',
                                        marginBottom: '1.5rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.95rem'
                                    }}>
                                        <span>📅</span>
                                        <span>{durationText}</span>
                                    </div>

                                    {/* Price */}
                                    <div style={{
                                        fontSize: '3rem',
                                        fontWeight: 900,
                                        color: '#ccff00',
                                        letterSpacing: '0.04em',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {product.price}
                                    </div>
                                    <p style={{
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                        marginBottom: '2rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.02em'
                                    }}>
                                        RSD / {durationText}
                                    </p>

                                    {/* Description */}
                                    <p style={{
                                        color: '#cbd5e1',
                                        fontSize: '0.95rem',
                                        lineHeight: 1.7,
                                        marginBottom: '2rem',
                                        flex: 1
                                    }}>
                                        {product.description || 'Pristup svim objektima i grupnim treninzima'}
                                    </p>

                                    {/* Benefits List */}
                                    <div style={{
                                        marginBottom: '2rem',
                                        borderTop: '1px solid #2e3545',
                                        paddingTop: '1.5rem'
                                    }}>
                                        <div style={{
                                            color: '#cbd5e1',
                                            lineHeight: 2,
                                            fontWeight: 600
                                        }}>
                                            <div>✓ Pristup vrhunskim spravama</div>
                                            <div>✓ Profesionalna oprema</div>
                                            <div>✓ Grupni treninzi</div>
                                            <div>✓ Podrška trenera</div>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <Button
                                        type='button'
                                        className='add-to-cart-btn'
                                        disabled={!isActivated || hasActiveMembership}
                                        onClick={() => addToCartHandler(product)}
                                        style={{
                                            background: '#ccff00',
                                            color: '#0f1117',
                                            border: 'none',
                                            letterSpacing: '0.03em',
                                            padding: '1rem',
                                            fontSize: '1rem',
                                            fontWeight: 800,
                                            borderRadius: '14px',
                                            width: '100%',
                                            textTransform: 'uppercase'
                                        }}
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
                <Card className='border-0 shadow-soft' style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.08))',
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    marginTop: '2rem'
                }}>
                    <p style={{
                        color: '#86efac',
                        margin: 0,
                        fontSize: '0.95rem',
                        lineHeight: 1.6
                    }}>
                        <strong>✓ Nalog aktiviran:</strong> Gotovi ste da pocnete! Odaberite clansku karticu koja vam odgovara i pocnite sa treningom.
                    </p>
                </Card>
            )}
        </>
    );
};

export default MembershipsScreen;
