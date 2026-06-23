import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
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
        <div className='page-narrow'>
            <CheckoutSteps step1 step2 step3 />

            <h1 className='page-heading'>
                💳 Način plaćanja
            </h1>

            <Card className='panel-card'>
                <Form onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label as='legend' className='form-legend'>
                            Odaberite način plaćanja
                        </Form.Label>

                        <div>
                            {!showGymPaymentOption && (
                                <Form.Check
                                    type='radio'
                                    className='mb-4 payment-option'
                                    label='💰 PayPal ili Kreditna kartica'
                                    id='PayPal'
                                    name='paymentMethod'
                                    value='PayPal'
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                            )}

                            {showGymPaymentOption && (
                                <Alert variant='' className='info-alert green-alert'>
                                    <div className='info-alert-title'>
                                        ✓ Plaćanje u teretani aktivirano
                                    </div>
                                    <p className='info-alert-text'>
                                        Preuzimanje u teretani je omogućeno. Izvršićete plaćanje na recepciji teretane. Online plaćanje je onemogućeno.
                                    </p>
                                </Alert>
                            )}
                        </div>
                    </Form.Group>

                    <Button type='submit' className='add-to-cart-btn neon-submit-btn mt-3'>
                        {showGymPaymentOption
                            ? '✓ Nastavi (Plaćanje na recepciji)'
                            : '✓ Nastavi'}
                    </Button>
                </Form>
            </Card>

            <Card className='note-card'>
                <p className='note-text'>
                    <strong className='note-strong'>ℹ️ Napomena:</strong> {
                        showGymPaymentOption 
                            ? 'Pritisnite "Nastavi" da potvrdite porudžbinu za preuzimanje u teretani. Plaćanje će biti obavljeno na recepciji.'
                            : 'Za sigurno plaćanje koristite PayPal ili kreditnu karticu. Svi podaci su zaštićeni.'
                    }
                </p>
            </Card>
        </div>
    );
};

export default PaymentScreen;
