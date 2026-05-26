import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <Card className='p-4 shadow-lg border-0 bg-dark text-white rounded mt-4'>
        <Card.Body>
          <div className='text-center mb-3 text-danger'>
            <FaLock size={40} style={{ color: '#ff4a4a' }} />
          </div>
          <h2 className='text-center mb-4 fw-bold text-uppercase' style={{ color: '#ff4a4a', letterSpacing: '1px' }}>
            Prijava u Sistem
          </h2>

          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Label className='small fw-bold'>Email adresa</Form.Label>
              <Form.Control
                type='email'
                placeholder='ime@example.com'
                value={email}
                className='bg-light border-0 py-2 fw-bold'
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-4' controlId='password'>
              <Form.Label className='small fw-bold'>Lozinka</Form.Label>
              <Form.Control
                type='password'
                placeholder='Unesite lozinku'
                value={password}
                className='bg-light border-0 py-2'
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button disabled={isLoading} type='submit' className='w-100 fw-bold text-uppercase py-2 border-0' style={{ backgroundColor: '#ff4a4a' }}>
              Prijavi se
            </Button>

            {isLoading && <Loader />}
          </Form>

          <Row className='py-3 text-center mt-2 small'>
            <Col>
              Novi ste na platformi?{' '}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color: '#ff4a4a', textDecoration: 'none', fontWeight: 'bold' }}>
                Registrujte se
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </FormContainer>
  );
};

export default LoginScreen;