import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveMembershipPaymentMethod } from '../slices/membershipSlice';

const MembershipPaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { membershipPackage } = useSelector((state) => state.membership);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  useEffect(() => {
    if (!membershipPackage) {
      navigate('/gym-membership');
    }
  }, [membershipPackage, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveMembershipPaymentMethod(paymentMethod));
    // Ide na placeholder plaćanja umesto direktno na porudžbinu
    navigate('/membership-checkout');
  };

  return (
    <Container className='my-4'>
      <CheckoutSteps step1 step2 step2Label='Plaćanje' step2Link='/membership-payment' />

      <div className='d-flex justify-content-center align-items-center mt-4'>
        <Card className='p-4 shadow-lg border-0 bg-dark text-white rounded' style={{ width: '100%', maxWidth: '450px' }}>
          <Card.Body>
            <h3 className='text-uppercase fw-bold text-center mb-3' style={{ color: '#ff4a4a', letterSpacing: '1px' }}>
              Plaćanje članarine
            </h3>
            <p className='text-center text-muted small mb-4'>Odaberite način plaćanja za članarinu.</p>

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
                    checked={paymentMethod === 'PayPal'}
                    className='fw-bold my-2 fs-5'
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </Col>
              </Form.Group>

              <Button type='submit' className='w-100 fw-bold text-uppercase py-2 border-0' style={{ backgroundColor: '#ff4a4a' }}>
                Dalje na Pregled
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default MembershipPaymentScreen;
