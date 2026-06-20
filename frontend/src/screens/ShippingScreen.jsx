import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
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
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Podaci o dostavi</h1>

            <Form onSubmit={submitHandler}>
                {!hasMembership && userInfo?.isMember && hasRegularProducts && (
                    <Form.Group className='my-3' controlId='pickupAtGym'>
                        <Form.Check
                            type='checkbox'
                            label='Preuzmi lično u teretani'
                            checked={pickupAtGym}
                            onChange={(e) => setPickupAtGym(e.target.checked)}
                        />
                    </Form.Group>
                )}

                <Form.Group controlId='address' className='my-2'>
                    <Form.Label>Adresa</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Unesite adresu'
                        value={address}
                        required
                        disabled={hasMembership || pickupAtGym}
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='city' className='my-2'>
                    <Form.Label>Grad</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Unesite grad'
                        value={city}
                        required
                        disabled={hasMembership || pickupAtGym}
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode' className='my-2'>
                    <Form.Label>Poštanski broj</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Unesite poštanski broj'
                        value={postalCode}
                        required
                        disabled={hasMembership || pickupAtGym}
                        onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className='my-2'>
                    <Form.Label>Država</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Unesite državu'
                        value={country}
                        required
                        disabled={hasMembership || pickupAtGym}
                        onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-2'>
                    Nastavi
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;
