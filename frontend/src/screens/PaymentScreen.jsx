import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Alert } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const showGymPaymentOption = shippingAddress?.pickupAtGym === true;

    useEffect(() => {
        if (!shippingAddress?.address) {
            navigate('/shipping');
            return;
        }

        if (showGymPaymentOption) {
            setPaymentMethod('U teretani');
        }
    }, [shippingAddress, navigate, showGymPaymentOption]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Način plaćanja</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Odaberite način plaćanja</Form.Label>
                    <Col>
                        {!showGymPaymentOption && (
                            <Form.Check
                                type='radio'
                                className='my-2'
                                label='PayPal ili Kreditna kartica'
                                id='PayPal'
                                name='paymentMethod'
                                value='PayPal'
                                checked={paymentMethod === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                        )}

                        {showGymPaymentOption && (
                            <Alert variant='info' className='my-2 mb-0'>
                                Preuzimanje u teretani je aktivirano. Online plaćanje je
                                onemogućeno i metoda plaćanja je zaključana na recepciju.
                            </Alert>
                        )}

                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    {showGymPaymentOption
                        ? 'Potvrdi porudžbinu (Plaćanje na recepciji)'
                        : 'Nastavite'}
                </Button>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;
