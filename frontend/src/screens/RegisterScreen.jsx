import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
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
    if (password !== confirmPassword) {
      toast.error('Lozinke se ne poklapaju');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className='d-flex justify-content-center align-items-center my-5'>
      <Card className='p-4 shadow-lg border-0 bg-dark text-white' style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <Card.Body>
          <h2 className='text-center mb-3 fw-bold text-uppercase' style={{ color: '#ff4a4a', letterSpacing: '1px' }}>
            Novi Nalog
          </h2>
          <p className='text-center text-muted small mb-4'>Kreirajte profil za online naručivanje i praćenje članarina.</p>

          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-2' controlId='name'>
              <Form.Label className='small'>Ime i prezime</Form.Label>
              <Form.Control
                type='text'
                placeholder='Unesite ime'
                value={name}
                className='bg-light border-0 py-2'
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-2' controlId='email'>
              <Form.Label className='small'>Email adresa</Form.Label>
              <Form.Control
                type='email'
                placeholder='Unesite email'
                value={email}
                className='bg-light border-0 py-2'
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-2' controlId='password'>
              <Form.Label className='small'>Lozinka</Form.Label>
              <Form.Control
                type='password'
                placeholder='Unesite lozinku'
                value={password}
                className='bg-light border-0 py-2'
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-4' controlId='confirmPassword'>
              <Form.Label className='small'>Potvrdite lozinku</Form.Label>
              <Form.Control
                type='password'
                placeholder='Ponovite lozinku'
                value={confirmPassword}
                className='bg-light border-0 py-2'
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button disabled={isLoading} type='submit' className='w-100 fw-bold text-uppercase py-2 border-0' style={{ backgroundColor: '#ff4a4a' }}>
              Registruj Se
            </Button>

            {isLoading && <Loader />}
          </Form>

          <Row className='py-3 text-center mt-2 small'>
            <Col>
              Već imate nalog?{' '}
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: '#ff4a4a', textDecoration: 'none', fontWeight: 'bold' }}>
                Prijavite se
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterScreen;