import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

// PayPal API ključ - zameni sa pravim ključem
// eslint-disable-next-line no-unused-vars
const PAYPAL_API_KEY = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID_HERE';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart.cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    if (!cart.shippingAddress) {
      navigate('/shipping');
    }
  }, [cart.cartItems.length, cart.shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <Container className='my-4'>
      <CheckoutSteps step1 step2 step3 step2Label='Dostava' step2Link='/shipping' />

      <div className='d-flex justify-content-center align-items-center mt-4'>
        <Card className='p-4 shadow-lg border-0 bg-dark text-white rounded' style={{ width: '100%', maxWidth: '450px' }}>
          <Card.Body>
            <h3 className='text-uppercase fw-bold text-center mb-3' style={{ color: '#ff4a4a', letterSpacing: '1px' }}>
              Način Plaćanja
            </h3>
            <p className='text-center text-muted small mb-4'>Odaberite opciju za realizaciju Vaše online uplate.</p>

            <Form onSubmit={submitHandler}>
              <Form.Group className='mb-4 text-start bg-secondary p-3 rounded'>
                <Form.Label as='legend' className='fw-bold text-warning small text-uppercase mb-2'>Dostupne Metode</Form.Label>
                <Col>
                  <Form.Check
                    type='radio'
                    label='Online Kartica / PayPal'
                    id='PayPal'
                    name='paymentMethod'
                    value='PayPal'
                    checked
                    className='fw-bold my-2 fs-5'
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  ></Form.Check>
                </Col>
              </Form.Group>

              <Button type='submit' className='w-100 fw-bold text-uppercase py-2 border-0' style={{ backgroundColor: '#ff4a4a' }}>
                Dalje na Pregled →
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default PaymentScreen;
