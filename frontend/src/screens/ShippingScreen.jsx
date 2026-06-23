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
        <div className='page-narrow'>
            <CheckoutSteps step1 step2 />

            <h1 className='page-heading'>
                📦 Adresa za dostavu
            </h1>

            <Card className='panel-card'>
                {!hasMembership && userInfo?.isMember && hasRegularProducts && (
                    <Alert variant='info' className='info-alert'>
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
                                className='pickup-checkbox'
                            />
                            {pickupAtGym && (
                                <div className='pickup-note'>
                                    ✓ Adresa će biti postavljena na lokaciju teretane
                                </div>
                            )}
                        </Form.Group>
                    )}

                    {/* Address Fields */}
                    <Form.Group controlId='address' className='mb-3'>
                        <Form.Label className='form-label'>
                            Adresa
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='npr. Makedonska 123'
                            value={address}
                            required
                            disabled={hasMembership || pickupAtGym}
                            onChange={(e) => setAddress(e.target.value)}
                            className='form-input'
                        />
                    </Form.Group>

                    <Form.Group controlId='city' className='mb-3'>
                        <Form.Label className='form-label'>
                            Grad
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='npr. Novi Sad'
                            value={city}
                            required
                            disabled={hasMembership || pickupAtGym}
                            onChange={(e) => setCity(e.target.value)}
                            className='form-input'
                        />
                    </Form.Group>

                    <Form.Group controlId='postalCode' className='mb-3'>
                        <Form.Label className='form-label'>
                            Poštanski broj
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='npr. 21000'
                            value={postalCode}
                            required
                            disabled={hasMembership || pickupAtGym}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className='form-input'
                        />
                    </Form.Group>

                    <Form.Group controlId='country' className='mb-4'>
                        <Form.Label className='form-label'>
                            Država
                        </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='npr. Srbija'
                            value={country}
                            required
                            disabled={hasMembership || pickupAtGym}
                            onChange={(e) => setCountry(e.target.value)}
                            className='form-input'
                        />
                    </Form.Group>

                    <Button type='submit' className='add-to-cart-btn neon-submit-btn'>
                        Nastavi na plaćanje
                    </Button>
                </Form>
            </Card>

            {(hasMembership || pickupAtGym) && (
                <Card className='note-card'>
                    <p className='note-text'>
                        <strong className='note-strong'>ℹ️ Napomena:</strong> Adresa dostave je {
                            hasMembership ? 'automatski postavljena za aktivaciju članarine' : 'automatski postavljena na lokaciju teretane'
                        } i ne može se menjati.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default ShippingScreen;
