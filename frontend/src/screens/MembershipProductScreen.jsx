import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveMembershipPackage } from '../slices/membershipSlice';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'; // Dodato
import Loader from '../components/Loader'; // Dodato
import Message from '../components/Message'; // Dodato
import { FaArrowLeft, FaCheck, FaDumbbell } from 'react-icons/fa';

const MembershipProductScreen = () => {
  const { id: packageId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo } = useSelector((state) => state.auth);
  const membershipActive = userInfo?.membershipActive && userInfo?.membershipExpires && new Date(userInfo.membershipExpires) > new Date();

  // Pribavljanje podataka iz baze umesto hardkodovanog niza
  const { data: paket, isLoading, error } = useGetProductDetailsQuery(packageId);

  const selectPackageHandler = () => {
    // Dodajemo isMembership: true kako bi logika ostala netaknuta
    dispatch(saveMembershipPackage({ ...paket, qty: 1, isMembership: true }));
    navigate('/membership-cart');
  };

  return (
    <Container className='my-4'>
      <Link className='btn btn-outline-dark my-3 fw-bold text-uppercase' to='/gym-membership'>
        <FaArrowLeft className='me-1' /> Nazad na Članarine
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : !paket ? (
        <div className='alert alert-danger mt-3'>
          Paket nije pronađen.
        </div>
      ) : (
        <Row className='mt-3'>
          <Col md={5} className='mb-4'>
            <Image 
              src={paket.image} 
              alt={paket.name} 
              fluid 
              rounded 
              className='shadow-sm' 
              style={{ 
                borderTop: '4px solid #ff4a4a', 
                width: '100%', 
                maxHeight: '450px', 
                objectFit: 'cover',
                backgroundColor: '#1e1e1e'
              }} 
            />
          </Col>
          
          <Col md={4} className='mb-4'>
            <ListGroup variant='flush' className='shadow-sm rounded overflow-hidden'>
              <ListGroup.Item className='bg-dark text-white p-3'>
                <span className='text-uppercase small fw-bold' style={{ color: '#ff4a4a' }}>Članarina</span>
                <h3 className='fw-bold text-uppercase m-0 mt-1'>{paket.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item className='p-3 bg-light text-dark'>
                {/* Zamenjeno sa paket.description po uzoru na bazu */}
                <strong>Opis:</strong> {paket.description}
              </ListGroup.Item>
              <ListGroup.Item className='p-3 bg-light text-dark'>
                <ul className='list-unstyled mb-0'>
                  <li className='mb-2'><FaCheck style={{ color: '#ff4a4a' }} className='me-2' /> Moderni trenažeri</li>
                  <li className='mb-2'><FaCheck style={{ color: '#ff4a4a' }} className='me-2' /> Svlačionice</li>
                  <li className='mb-2'><FaCheck style={{ color: '#ff4a4a' }} className='me-2' /> Wi-Fi konekcija</li>
                  <li><FaCheck style={{ color: '#ff4a4a' }} className='me-2' /> Pristupačni sati</li>
                </ul>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card className='border-0 shadow-lg text-white rounded overflow-hidden' style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body className='p-4'>
                <div className='d-flex justify-content-between mb-3 small text-muted'>
                  <span>Cena:</span>
                  <span className='text-white fw-bold fs-4' style={{ color: '#ff4a4a !important' }}>{paket.price?.toLocaleString('sr-RS')} RSD</span>
                </div>

                <div className='d-flex justify-content-between mb-4 small text-muted align-items-center'>
                  <span>Status:</span>
                  {membershipActive ? (
                    <span className='badge bg-warning text-dark text-uppercase p-2'>Već je aktivna</span>
                  ) : (
                    <span className='badge bg-success text-uppercase p-2'>Dostupno</span>
                  )}
                </div>

                <Button
                  className='w-100 fw-bold text-uppercase py-3 border-0 text-white shadow-sm d-flex align-items-center justify-content-center'
                  style={{ 
                    backgroundColor: membershipActive ? '#6c757d' : '#ff4a4a', 
                    letterSpacing: '1px',
                    cursor: membershipActive ? 'not-allowed' : 'pointer'
                  }}
                  type='button'
                  disabled={membershipActive}
                  onClick={selectPackageHandler}
                >
                  <FaDumbbell className='me-2' /> {membershipActive ? 'Već imate aktivnu članarinu' : 'Odaberi Paket'}
                </Button>

                {membershipActive && (
                  <p className='text-muted small mt-3 text-center'>
                    Trenutna članarina je aktivna. Možete kupiti novu nakon isteka.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MembershipProductScreen;