import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { clearMembership } from '../slices/membershipSlice';

const MembershipCartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { membershipPackage } = useSelector((state) => state.membership);
  const { userInfo } = useSelector((state) => state.auth);
  const membershipActive = userInfo?.membershipActive && userInfo?.membershipExpires && new Date(userInfo.membershipExpires) > new Date();

  // Proveravamo da li paket postoji kada se komponentra učita
  useEffect(() => {
    // Ako nema pakata, ostani na ovoj stranici (prikaži poruku)
    // Ne čisti automatski, korisnik mora da klikne dugme da bi se vratio
  }, []);

  const removeHandler = () => {
    dispatch(clearMembership());
    navigate('/gym-membership');
  };

  const continueShoppingHandler = () => {
    dispatch(clearMembership());
    navigate('/gym-membership');
  };

  const checkoutHandler = () => {
    if (!membershipPackage) {
      navigate('/gym-membership');
      return;
    }

    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (membershipActive) {
      return;
    }

    navigate('/membership-payment');
  };

  return (
    <Container className='my-4'>
      <div className='mb-4' style={{ borderLeft: '5px solid #ff4a4a', paddingLeft: '12px' }}>
        <h2 className='fw-bold text-uppercase m-0' style={{ fontSize: '1.6rem' }}>Korpa Članarine</h2>
        <p className='text-muted mb-0'>Ovo je zasebna korpa za članarinu. Proizvodi se kupuju zasebno u glavnoj korpi.</p>
      </div>

      {!membershipPackage ? (
        <Message variant='info'>
          Nemate izabranu članarinu. <Link to='/gym-membership' className='text-dark fw-bold'>Izaberite paket</Link>
        </Message>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant='flush' className='shadow-sm rounded overflow-hidden'>
              <ListGroup.Item className='bg-dark text-white p-3'>
                <h4 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a' }}>Odabrana Članarina</h4>
              </ListGroup.Item>
              <ListGroup.Item className='p-3 bg-light text-dark'>
                <ListGroup variant='flush'>
                  <ListGroup.Item className='bg-light px-0 py-2 border-bottom'>
                    <Row className='align-items-center'>
                      <Col md={2}>
                        <Image src={membershipPackage.image} alt={membershipPackage.name} fluid rounded style={{ height: '70px', objectFit: 'cover' }} />
                      </Col>
                      <Col>
                        <span className='fw-bold text-dark'>{membershipPackage.name}</span>
                        <p className='small text-muted mb-0'>{membershipPackage.desc}</p>
                      </Col>
                      <Col md={3} className='text-end fw-bold' style={{ color: '#ff4a4a' }}>
                        {membershipPackage.qty} x {membershipPackage.price.toLocaleString('sr-RS')} RSD
                      </Col>
                      <Col md={2} className='text-end'>
                        <Button variant='light' size='sm' className='border-0' onClick={removeHandler}>
                          <FaTrash className='me-1' /> Ukloni
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </ListGroup.Item>
            </ListGroup>

            <div className='mt-3'>
              <Button variant='outline-light' className='w-100 fw-bold text-uppercase py-3' onClick={continueShoppingHandler}>
                Nastavi kupovinu
              </Button>
            </div>
          </Col>

          <Col md={4}>
            <Card className='border-0 shadow-sm rounded overflow-hidden text-white' style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Header className='text-center py-3' style={{ backgroundColor: '#ff4a4a' }}>
                <h5 className='text-uppercase fw-bold m-0'>Pregled</h5>
              </Card.Header>
              <Card.Body className='p-4'>
                <div className='d-flex justify-content-between mb-3 text-muted'>
                  <span>Članarina:</span>
                  <span className='text-white fw-bold'>{membershipPackage.price.toLocaleString('sr-RS')} RSD</span>
                </div>
                <hr style={{ borderColor: '#444' }} />
                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <span className='fw-bold text-uppercase'>Ukupno</span>
                  <span className='fs-4 fw-bold' style={{ color: '#ff4a4a' }}>{membershipPackage.price.toLocaleString('sr-RS')} RSD</span>
                </div>
                <Button
                  className='w-100 fw-bold text-uppercase py-3 border-0'
                  style={{ backgroundColor: membershipActive ? '#6c757d' : '#ff4a4a' }}
                  disabled={membershipActive}
                  onClick={checkoutHandler}
                >
                  {membershipActive ? 'Već imate aktivnu članarinu' : 'Nastavi na plaćanje'}
                </Button>
                {membershipActive && (
                  <p className='text-muted small mt-3'>Trenutna članarina je aktivna. Ne možete kupiti novu dok traje.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MembershipCartScreen;
