import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/gym-code'); // Vodi na korak 2 (Unos koda) koji smo napravili
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 />
      <Card className='p-4 shadow-lg border-0 bg-dark text-white rounded mt-3'>
        <Card.Body>
          <h3 className='text-uppercase fw-bold text-center mb-4' style={{ color: '#ff4a4a', letterSpacing: '1px' }}>
            Dostava Suplemenata
          </h3>

          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-2' controlId='address'>
              <Form.Label className='small'>Adresa i broj stanovanja</Form.Label>
              <Form.Control type='text' placeholder='Unesite adresu' value={address} required className='bg-light border-0 py-2' onChange={(e) => setAddress(e.target.value)} />
            </Form.Group>

            <Form.Group className='mb-2' controlId='city'>
              <Form.Label className='small'>Grad</Form.Label>
              <Form.Control type='text' placeholder='Unesite grad' value={city} required className='bg-light border-0 py-2' onChange={(e) => setCity(e.target.value)} />
            </Form.Group>

            <Form.Group className='mb-2' controlId='postalCode'>
              <Form.Label className='small'>Poštanski broj</Form.Label>
              <Form.Control type='text' placeholder='Unesite poštanski broj' value={postalCode} required className='bg-light border-0 py-2' onChange={(e) => setPostalCode(e.target.value)} />
            </Form.Group>

            <Form.Group className='mb-4' controlId='country'>
              <Form.Label className='small'>Država</Form.Label>
              <Form.Control type='text' placeholder='Unesite državu' value={country} required className='bg-light border-0 py-2' onChange={(e) => setCountry(e.target.value)} />
            </Form.Group>

            <Button type='submit' className='w-100 fw-bold text-uppercase py-2 border-0' style={{ backgroundColor: '#ff4a4a' }}>
              Nastavi na kod članstva →
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </FormContainer>
  );
};

export default ShippingScreen;