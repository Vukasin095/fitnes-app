import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Card, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaDumbbell, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gymCode, setGymCode] = useState('');

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setGymCode(userInfo.gymCode || '');
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Lozinke se ne poklapaju');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
          gymCode, // Šaljemo kod na backend za verifikaciju člana
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profil uspešno ažuriran!');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className='my-4'>
      <Row>
        {/* LEVA STRANA: ČLANSKA KARTA I PODACI */}
        <Col md={4} className='mb-4'>
          <Card className='border-0 shadow-sm text-white rounded mb-4' style={{ backgroundColor: '#1e1e1e', borderTop: '5px solid #ff4a4a' }}>
            <Card.Body className='text-center p-4'>
              <div className='rounded-circle bg-dark d-inline-flex p-3 mb-3' style={{ border: '2px solid #ff4a4a' }}>
                <FaUser size={40} style={{ color: '#ff4a4a' }} />
              </div>
              <h3 className='fw-bold text-uppercase m-0'>{name}</h3>
              <p className='text-muted small mb-3'>{email}</p>

              {/* Status Članstva */}
              {userInfo && userInfo.isGymMember ? (
                <div className='p-2 bg-success rounded fw-bold text-uppercase' style={{ fontSize: '0.85rem' }}>
                  <FaDumbbell className='me-1' /> Verifikovan Član Kluba
                </div>
              ) : (
                <div className='p-2 bg-danger rounded fw-bold text-uppercase' style={{ fontSize: '0.85rem' }}>
                  🔒 Običan Posetilac
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className='border-0 shadow-sm p-3 bg-dark text-white rounded'>
            <h4 className='text-uppercase fw-bold mb-3' style={{ color: '#ff4a4a', fontSize: '1.1rem' }}>Ažuriraj Profil</h4>
            <Form onSubmit={submitHandler}>
              <Form.Group className='mb-2' controlId='name'>
                <Form.Label className='small'>Ime i prezime</Form.Label>
                <Form.Control type='text' value={name} onChange={(e) => setName(e.target.value)} className='bg-light border-0 py-1' />
              </Form.Group>

              <Form.Group className='mb-2' controlId='email'>
                <Form.Label className='small'>Email adresa</Form.Label>
                <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='bg-light border-0 py-1' />
              </Form.Group>

              {/* UNOS ČLANSKOG KODA (Ključna funkcionalnost) */}
              <Form.Group className='mb-2' controlId='gymCode'>
                <Form.Label className='small fw-bold text-warning'>Jedinstveni Članski Kod</Form.Label>
                <Form.Control 
                  type='text' 
                  placeholder='Unesite kod (n.pr. FITNES2026)' 
                  value={gymCode} 
                  onChange={(e) => setGymCode(e.target.value)} 
                  className='bg-light border-0 py-1 fw-bold text-uppercase'
                  style={{ letterSpacing: '1px' }}
                />
              </Form.Group>

              <Form.Group className='mb-2' controlId='password'>
                <Form.Label className='small'>Nova lozinka</Form.Label>
                <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='bg-light border-0 py-1' />
              </Form.Group>

              <Form.Group className='mb-3' controlId='confirmPassword'>
                <Form.Label className='small'>Potvrdite lozinku</Form.Label>
                <Form.Control type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='bg-light border-0 py-1' />
              </Form.Group>

              <Button type='submit' className='w-100 fw-bold text-uppercase border-0' style={{ backgroundColor: '#ff4a4a' }}>
                Sačuvaj Izmene
              </Button>
              {loadingUpdateProfile && <Loader />}
            </Form>
          </Card>
        </Col>

        {/* DESNA STRANA: ISTORIJA PORUDŽBINA */}
        <Col md={8}>
          <div className='mb-4' style={{ borderLeft: '5px solid #ff4a4a', paddingLeft: '12px' }}>
            <h2 className='fw-bold text-uppercase m-0' style={{ fontSize: '1.5rem' }}>Moje Porudžbine & Članarine</h2>
            <small className='text-muted'>Pregled svih vaših online transakcija</small>
          </div>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error?.data?.message || error.error}</Message>
          ) : orders.length === 0 ? (
            <Message variant='info'>Još uvek niste napravili nijednu porudžbinu.</Message>
          ) : (
            <Table striped hover responsive className='align-middle shadow-sm rounded text-center bg-white'>
              <thead className='table-dark text-uppercase small'>
                <tr>
                  <th>ID</th>
                  <th>Datum</th>
                  <th>Ukupno</th>
                  <th>Plaćeno</th>
                  <th>Dostavljeno</th>
                  <th>Detalji</th>
                </tr>
              </thead>
              <tbody className='small fw-bold'>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 10)}...</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice.toLocaleString('sr-RS')} RSD</td>
                    <td>
                      {order.isPaid ? (
                        <Badge bg='success' className='p-2'><FaCheck /> {order.paidAt.substring(0, 10)}</Badge>
                      ) : (
                        <Badge bg='danger' className='p-2'><FaTimes /></Badge>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <Badge bg='success' className='p-2'>{order.deliveredAt.substring(0, 10)}</Badge>
                      ) : (
                        <Badge bg='secondary' className='p-2'>U obradi</Badge>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant='dark' size='sm' className='fw-bold text-uppercase' style={{ fontSize: '0.75rem' }}>
                          Pregledaj
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;