import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveGymCode } from '../slices/cartSlice'; // Osiguraj da imaš akciju u cartSlice-u
import { FaDumbbell } from 'react-icons/fa';

const GymCodeScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { gymCode: savedGymCode } = cart;

  const [gymCode, setGymCode] = useState(savedGymCode || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveGymCode(gymCode));
    navigate('/payment'); // Vodi na sledeći korak iz PDF-a
  };

  return (
    <Container className='my-4'>
      {/* Prikazujemo gornju liniju progresa */}
      <CheckoutSteps step1 step2 />

      <div className='d-flex justify-content-center align-items-center mt-4'>
        <Card className='p-4 shadow-lg border-0 bg-dark text-white text-center rounded' style={{ width: '100%', maxWidth: '450px' }}>
          <Card.Body>
            <div className='text-warning mb-3'>
              <FaDumbbell size={50} style={{ color: '#ff4a4a' }} />
            </div>
            <h3 className='text-uppercase fw-bold mb-2' style={{ letterSpacing: '1px' }}>Potvrda Članstva</h3>
            <p className='text-muted small mb-4'>Da biste nastavili ka plaćanju, potvrdite Vaš kod teretane za obračun popusta i verifikaciju.</p>

            <Form onSubmit={submitHandler}>
              <Form.Group className='mb-4' controlId='gymCode'>
                <Form.Control
                  type='text'
                  placeholder='Unesite kod (npr. FITNES2026)'
                  value={gymCode}
                  required
                  className='bg-light border-0 py-2 text-center fw-bold text-uppercase fs-5'
                  style={{ letterSpacing: '2px' }}
                  onChange={(e) => setGymCode(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type='submit' className='w-100 fw-bold text-uppercase py-2 border-0' style={{ backgroundColor: '#ff4a4a' }}>
                Potvrdi i Nastavi →
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default GymCodeScreen;