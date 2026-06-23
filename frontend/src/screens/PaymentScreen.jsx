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
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem 0'
        }}>
            <CheckoutSteps step1 step2 step3 />

            <h1 style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '2rem',
                marginTop: '2rem',
                letterSpacing: '0.02em'
            }}>
                💳 Način plaćanja
            </h1>

            <Card className='border-0 shadow-soft' style={{
                background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                padding: '2.5rem',
                borderRadius: '20px',
                marginBottom: '2rem'
            }}>
                <Form onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label as='legend' style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            marginBottom: '1.5rem',
                            letterSpacing: '0.02em'
                        }}>
                            Odaberite način plaćanja
                        </Form.Label>

                        <div>
                            {!showGymPaymentOption && (
                                <Form.Check
                                    type='radio'
                                    className='mb-4'
                                    label='💰 PayPal ili Kreditna kartica'
                                    id='PayPal'
                                    name='paymentMethod'
                                    value='PayPal'
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{
                                        fontSize: '1.05rem',
                                        fontWeight: 700,
                                        color: '#ffffff',
                                        padding: '1rem',
                                        background: 'rgba(204, 255, 0, 0.08)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(204, 255, 0, 0.2)',
                                        marginBottom: '1rem'
                                    }}
                                />
                            )}

                            {showGymPaymentOption && (
                                <Alert variant='' style={{
                                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))',
                                    border: '1px solid #22c55e',
                                    color: '#86efac',
                                    borderRadius: '14px',
                                    padding: '1.5rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 800,
                                        marginBottom: '0.5rem',
                                        color: '#22c55e'
                                    }}>
                                        ✓ Plaćanje u teretani aktivirano
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.95rem',
                                        lineHeight: 1.6
                                    }}>
                                        Preuzimanje u teretani je omogućeno. Izvršićete plaćanje na recepciji teretane. Online plaćanje je onemogućeno.
                                    </p>
                                </Alert>
                            )}
                        </div>
                    </Form.Group>

                    <Button type='submit' className='add-to-cart-btn' style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 800,
                        borderRadius: '14px',
                        letterSpacing: '0.03em',
                        marginTop: '1rem'
                    }}>
                        {showGymPaymentOption
                            ? '✓ Nastavi (Plaćanje na recepciji)'
                            : '✓ Nastavi'}
                    </Button>
                </Form>
            </Card>

            <Card className='border-0 shadow-soft' style={{
                background: 'rgba(59, 130, 246, 0.08)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
                <p style={{
                    color: '#93c5fd',
                    margin: 0,
                    fontSize: '0.95rem',
                    lineHeight: 1.6
                }}>
                    <strong>ℹ️ Napomena:</strong> {
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
