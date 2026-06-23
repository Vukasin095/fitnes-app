import { useEffect, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const GYM_ADDRESS = {
    address: 'Teretana HQ',
    city: 'Novi Sad',
    postalCode: '21000',
    country: 'Srbija',
};

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = cart;

    const hasMembership = cartItems.some((item) => item.category === 'Članarine');
    const hasRegularProducts = cartItems.some((item) => item.category !== 'Članarine');

    const [pickupAtGym, setPickupAtGym] = useState(
        cart.shippingAddress?.pickupAtGym || false
    );

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (hasMembership) {
            setAddress('Online / Aktivacija');
            setCity('Online / Aktivacija');
            setPostalCode('Online / Aktivacija');
            setCountry('Online / Aktivacija');
            setPickupAtGym(false);
            return;
        }

        if (pickupAtGym && userInfo?.isMember && hasRegularProducts) {
            setAddress(GYM_ADDRESS.address);
            setCity(GYM_ADDRESS.city);
            setPostalCode(GYM_ADDRESS.postalCode);
            setCountry(GYM_ADDRESS.country);
        } else {
            setAddress('');
            setCity('');
            setPostalCode('');
            setCountry('');
        }
    }, [hasMembership, pickupAtGym, userInfo, hasRegularProducts]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country, pickupAtGym }));
        navigate('/payment');
    };

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem 0'
        }}>
            <CheckoutSteps step1 step2 />

            <h1 style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '2rem',
                marginTop: '2rem',
                letterSpacing: '0.02em'
            }}>
                📦 Adresa za dostavu
            </h1>

            <Card className='border-0 shadow-soft' style={{
                background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                padding: '2.5rem',
                borderRadius: '20px',
                marginBottom: '2rem'
            }}>
                {!hasMembership && userInfo?.isMember && hasRegularProducts && (
                    <Alert variant='info' style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid #3b82f6',
                        color: '#93c5fd',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        padding: '1rem'
                    }}>
                        <strong>ℹ️ Preuzimanje u teretani dostupno:</strong> Kao član teretane, možete preuzeti proizvode lično u teretani!
                    </Alert>
                )}

                <Form onSubmit={submitHandler}>
                    {!hasMembership && userInfo?.isMember && hasRegularProducts && (
                        <Form.Group className='mb-4' controlId='pickupAtGym'>
                            <Form.Check
                                type='checkbox'
                                label='✓ Preuzmi lično u teretani'
                                checked={pickupAtGym}
                                onChange={(e) => setPickupAtGym(e.target.checked)}
                                style={{
                                    fontSize: '1.05rem',
                                    fontWeight: 700,
                                    color: '#ffffff'
                                }}
                            />
                            {pickupAtGym && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    border: '1px solid #22c55e',
                                    borderRadius: '10px',
                                    color: '#86efac',
                                    fontSize: '0.9rem'
                                }}>
                                    ✓ Adresa će biti postavljena na lokaciju teretane
                                </div>
                            )}
                        </Form.Group>
                    )}

                    {/* Address Fields */}
                    <Form.Group controlId='address' className='mb-3'>
                        <Form.Label style={{
                            fontWeight: 700,
                            color: '#cbd5e1',
                            marginBottom: '0.6rem'
                        }}>
                            Adresa
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='npr. Makedonska 123'
                            value={address}
                            required
                            disabled={hasMembership || pickupAtGym}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{
                                background: hasMembership || pickupAtGym ? '#1c1f2a' : '#252a37',
                                border: '1px solid #3f485e',
                                color: '#ffffff',
                                borderRadius: '12px',
                                padding: '0.85rem',
                                fontSize: '1rem'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId='city' className='mb-3'>
                        <Form.Label style={{
                            fontWeight: 700,
                            color: '#cbd5e1',
                            marginBottom: '0.6rem'
                        }}>
                            Grad
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='npr. Novi Sad'
                            value={city}
                            required
                            disabled={hasMembership || pickupAtGym}
                            onChange={(e) => setCity(e.target.value)}
                            style={{
                                background: hasMembership || pickupAtGym ? '#1c1f2a' : '#252a37',
                                border: '1px solid #3f485e',
                                color: '#ffffff',
                                borderRadius: '12px',
                                padding: '0.85rem',
                                fontSize: '1rem'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId='postalCode' className='mb-3'>
                        <Form.Label style={{
                            fontWeight: 700,
                            color: '#cbd5e1',
                            marginBottom: '0.6rem'
                        }}>
                            Poštanski broj
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='npr. 21000'
                            value={postalCode}
                            required
                            disabled={hasMembership || pickupAtGym}
                            onChange={(e) => setPostalCode(e.target.value)}
                            style={{
                                background: hasMembership || pickupAtGym ? '#1c1f2a' : '#252a37',
                                border: '1px solid #3f485e',
                                color: '#ffffff',
                                borderRadius: '12px',
                                padding: '0.85rem',
                                fontSize: '1rem'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId='country' className='mb-4'>
                        <Form.Label style={{
                            fontWeight: 700,
                            color: '#cbd5e1',
                            marginBottom: '0.6rem'
                        }}>
                            Država
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='npr. Srbija'
                            value={country}
                            required
                            disabled={hasMembership || pickupAtGym}
                            onChange={(e) => setCountry(e.target.value)}
                            style={{
                                background: hasMembership || pickupAtGym ? '#1c1f2a' : '#252a37',
                                border: '1px solid #3f485e',
                                color: '#ffffff',
                                borderRadius: '12px',
                                padding: '0.85rem',
                                fontSize: '1rem'
                            }}
                        />
                    </Form.Group>

                    <Button type='submit' className='add-to-cart-btn' style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 800,
                        borderRadius: '14px',
                        letterSpacing: '0.03em'
                    }}>
                        Nastavi na plaćanje
                    </Button>
                </Form>
            </Card>

            {(hasMembership || pickupAtGym) && (
                <Card className='border-0 shadow-soft' style={{
                    background: 'rgba(204, 255, 0, 0.08)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(204, 255, 0, 0.3)'
                }}>
                    <p style={{
                        color: '#cbd5e1',
                        margin: 0,
                        fontSize: '0.95rem',
                        lineHeight: 1.6
                    }}>
                        <strong style={{ color: '#ccff00' }}>ℹ️ Napomena:</strong> Adresa dostave je {
                            hasMembership ? 'automatski postavljena za aktivaciju članarine' : 'automatski postavljena na lokaciju teretane'
                        } i ne može se menjati.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default ShippingScreen;
