import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container, Alert, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaDumbbell } from 'react-icons/fa';
import { toast } from 'react-toastify';
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
  const isRegisteredMember = userInfo?.isGymMember;
  const membershipActive = userInfo?.membershipActive && userInfo?.membershipExpires && new Date(userInfo.membershipExpires) > new Date();
  const gymCodeActivated = isRegisteredMember || Boolean(userInfo?.gymCode);
  const membershipStartDate = userInfo?.membershipStart ? new Date(userInfo.membershipStart).toLocaleDateString('sr-RS') : null;
  const membershipEndDate = userInfo?.membershipExpires ? new Date(userInfo.membershipExpires).toLocaleDateString('sr-RS') : null;

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading: loadingOrders, error: ordersError } = useGetMyOrdersQuery(undefined, {
    skip: !userInfo,
  });

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
        const profileData = {
          _id: userInfo._id,
          name,
          email,
        };
        if (password) profileData.password = password;
        if (!isRegisteredMember && gymCode) profileData.gymCode = gymCode;

        const res = await updateProfile(profileData).unwrap();
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
              {isRegisteredMember ? (
                <div className='p-2 bg-info rounded fw-bold text-uppercase' style={{ fontSize: '0.85rem', color: '#fff' }}>
                  ✓ Registrovani Član
                </div>
              ) : (
                <div className='p-2 bg-secondary rounded fw-bold text-uppercase' style={{ fontSize: '0.85rem' }}>
                  🔓 Posetilac
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
                {gymCodeActivated ? (
                  <>
                    <Form.Control
                      type='text'
                      value='KOD AKTIVIRAN'
                      disabled
                      className='bg-light border-0 py-1 fw-bold text-uppercase'
                      style={{ letterSpacing: '1px' }}
                    />
                    <Form.Text className='text-muted'>Kod je zaključan jer ste već gym član.</Form.Text>
                  </>
                ) : (
                  <>
                    <Form.Control 
                      type='text' 
                      placeholder='Unesite kod (n.pr. FITNES2026)' 
                      value={gymCode} 
                      onChange={(e) => setGymCode(e.target.value)} 
                      className='bg-light border-0 py-1 fw-bold text-uppercase'
                      style={{ letterSpacing: '1px' }}
                    />
                    <Form.Text className='text-muted'>Kod je potreban samo za pakete članstva.</Form.Text>
                  </>
                )}
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

        {/* DESNA STRANA: STATUS ČLANARINE */}
        <Col md={8}>
          <div className='mb-4' style={{ borderLeft: '5px solid #ff4a4a', paddingLeft: '12px' }}>
            <h2 className='fw-bold text-uppercase m-0' style={{ fontSize: '1.5rem' }}>Aktivna Članarina</h2>
          </div>

          {membershipActive ? (
            <Alert variant='success' className='p-4 border-0 rounded'>
              <div className='d-flex align-items-center'>
                <FaDumbbell size={40} className='me-3' style={{ color: '#ff4a4a' }} />
                <div>
                  <h4 className='fw-bold m-0 mb-2'>✓ Aktivna Članarina</h4>
                  <p className='m-0'><strong>Važi od:</strong> {membershipStartDate}</p>
                  <p className='m-0'><strong>Ističe:</strong> {membershipEndDate}</p>
                </div>
              </div>
            </Alert>
          ) : (
            <Alert variant='warning' className='p-4 border-0 rounded'>
              <div className='d-flex align-items-center'>
                <div className='me-3' style={{ fontSize: '2.5rem' }}>🔒</div>
                <div>
                  <h4 className='fw-bold m-0 mb-2'>Nemate Uplaćenu Članarinu</h4>
                  <p className='m-0'>Kupite jedan od naših paketa članarine da biste aktivirali pristup svim mogućnostima kluba.</p>
                </div>
              </div>
            </Alert>
          )}

          <div className='mt-4'>
            <div className='mb-3' style={{ borderLeft: '5px solid #ff4a4a', paddingLeft: '12px' }}>
              <h2 className='fw-bold text-uppercase m-0' style={{ fontSize: '1.5rem' }}>Istorija porudžbina</h2>
              <small className='text-muted text-uppercase fw-bold'>Pregled svih vaših transakcija</small>
            </div>

            {loadingOrders ? (
              <Loader />
            ) : ordersError ? (
              <Alert variant='danger'>
                {ordersError?.data?.message || ordersError?.error || 'Greška pri učitavanju porudžbina'}
              </Alert>
            ) : (
              <Card className='border-0 shadow-sm bg-dark text-white rounded overflow-hidden'>
                <Card.Body className='p-3'>
                  <Table responsive bordered hover variant='dark' className='mb-0'>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Datum</th>
                        <th>Tip</th>
                        <th>Ukupno</th>
                        <th>Status</th>
                        <th>Plaćeno</th>
                        <th>Detalji</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders && Array.isArray(orders) && orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order?._id}>
                            <td className='align-middle'>{order?._id?.substring(0, 12) || 'N/A'}</td>
                            <td className='align-middle'>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString('sr-RS') : 'N/A'}</td>
                            <td className='align-middle'>
                              {order?.orderItems && Array.isArray(order.orderItems) && order.orderItems.some((item) => item?.isMembership) ? (
                                <span className='badge bg-info'>Članarina</span>
                              ) : (
                                <span className='badge bg-primary'>Proizvod</span>
                              )}
                            </td>
                            <td className='align-middle'>{order?.totalPrice ? order.totalPrice.toLocaleString('sr-RS') : '0'} RSD</td>
                            <td className='align-middle text-capitalize'>{order?.status || (order?.isPaid ? 'Plaćeno' : 'Obrada')}</td>
                            <td className='align-middle'>
                              {order?.isPaid ? (
                                <span className='text-success'>✓ Da</span>
                              ) : (
                                <span className='text-warning'>✗ Ne</span>
                              )}
                            </td>
                            <td className='align-middle'>
                              <Link to={`/order/${order?._id}`} className='btn btn-sm btn-outline-light'>Pregled</Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='7' className='text-center text-muted py-3'>Nemate nijednu porudžbinu.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;