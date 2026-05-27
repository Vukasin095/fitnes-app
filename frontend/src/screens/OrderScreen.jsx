import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Container, Badge } from 'react-bootstrap';
import { FaCheck, FaTimes, FaDumbbell, FaArrowLeft } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery } from '../../src/slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  
  // Vučemo podatke o konkretnom računu sa baze preko ID-ja iz URL-a
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Container className='my-4'>
      <Link className='btn btn-outline-dark my-3 fw-bold text-uppercase' to='/profile' style={{ fontSize: '0.85rem' }}>
        <FaArrowLeft className='me-1' /> Nazad na Profil
      </Link>

      <div className='mb-4' style={{ borderLeft: '5px solid #ff4a4a', paddingLeft: '12px' }}>
        <h2 className='fw-bold text-uppercase m-0' style={{ fontSize: '1.6rem' }}>
          {order.orderItems?.some(item => item.isMembership) ? 'Članarina' : 'Porudžbina'} #{order._id.substring(0, 12)}
        </h2>
        <small className='text-muted text-uppercase fw-bold'>Pregled statusa i realizacije transakcije</small>
      </div>

      <Row>
        {/* LEVA STRANA: DETALJI O ČLANSTVU I PLAĆANJU */}
        <Col md={8}>
          <ListGroup variant='flush' className='shadow-sm rounded overflow-hidden'>
            
            {/* Za članarinu prikazuj aktivaciju */}
            {order.orderItems?.some(item => item.isMembership) && (
              <>
                <ListGroup.Item className='bg-dark text-white p-3'>
                  <h4 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a', fontSize: '1rem' }}>
                    <FaDumbbell className='me-2'/>Status Članarine
                  </h4>
                </ListGroup.Item>
                <ListGroup.Item className='p-3 bg-light text-dark'>
                  {order.isPaid ? (
                    <Badge bg='success' className='p-2 fs-6 w-100 text-uppercase'><FaCheck className='me-1'/> Članarina Aktivirana</Badge>
                  ) : (
                    <Badge bg='danger' className='p-2 fs-6 w-100 text-uppercase'><FaTimes className='me-1'/> Čeka se potvrda plaćanja</Badge>
                  )}
                </ListGroup.Item>
              </>
            )}

            {/* Plaćanje */}
            <ListGroup.Item className='bg-dark text-white p-3 mt-3'>
              <h4 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a', fontSize: '1rem' }}>Plaćanje</h4>
            </ListGroup.Item>
            <ListGroup.Item className='p-3 bg-light text-dark'>
              <p className='mb-2'><strong>Metoda:</strong> {order.paymentMethod || 'Nije navedena'}</p>
              {order.isPaid ? (
                <Badge bg='success' className='p-2 fs-6 w-100 text-uppercase'><FaCheck className='me-1'/> Plaćeno uspešno ({order.paidAt ? order.paidAt.substring(0, 10) : 'Aktivirano'})</Badge>
              ) : (
                <Badge bg='danger' className='p-2 fs-6 w-100 text-uppercase'><FaTimes className='me-1'/> Čeka se uplata (Donesite novac na recepciju)</Badge>
              )}
            </ListGroup.Item>

            {/* Stavke računa */}
            <ListGroup.Item className='bg-dark text-white p-3 mt-3'>
              <h4 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a', fontSize: '1rem' }}>Naručeni artikli / Paketi</h4>
            </ListGroup.Item>
            <ListGroup.Item className='p-3 bg-light text-dark'>
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index} className='bg-light px-0 py-2 border-bottom'>
                    <Row className='align-items-center'>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded style={{ height: '50px', objectFit: 'cover' }} />
                      </Col>
                      <Col>
                        <span className='fw-bold text-dark'>{item.name}</span>
                      </Col>
                      <Col md={4} className='text-end fw-bold' style={{ color: '#ff4a4a' }}>
                        {item.qty} x {item.price.toLocaleString('sr-RS')} RSD = {(item.qty * item.price).toLocaleString('sr-RS')} RSD
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* DESNA STRANA: FINANSIJSKA SPECIFIKACIJA */}
        <Col md={4}>
          <Card className='border-0 shadow-sm text-white rounded overflow-hidden' style={{ backgroundColor: '#1e1e1e' }}>
            <Card.Header className='text-center py-3' style={{ backgroundColor: '#ff4a4a' }}>
              <h5 className='text-uppercase fw-bold m-0'>Specifikacija</h5>
            </Card.Header>
            <Card.Body className='p-3 small'>
              <div className='d-flex justify-content-between my-2 text-muted'>
                <span>Artikli:</span>
                <span className='text-white fw-bold'>{order.itemsPrice.toLocaleString('sr-RS')} RSD</span>
              </div>
              <div className='d-flex justify-content-between my-2 text-muted'>
                <span>Dostava/Aktivacija:</span>
                <span className='text-white fw-bold'>{order.shippingPrice.toLocaleString('sr-RS')} RSD</span>
              </div>
              <div className='d-flex justify-content-between my-2 text-muted'>
                <span>PDV (20%):</span>
                <span className='text-white fw-bold'>{order.taxPrice.toLocaleString('sr-RS')} RSD</span>
              </div>
              <hr style={{ borderColor: '#333' }} />
              <div className='d-flex justify-content-between align-items-center my-2 fs-5 fw-bold'>
                <span>Ukupno:</span>
                <span style={{ color: '#ff4a4a' }}>{order.totalPrice.toLocaleString('sr-RS')} RSD</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderScreen;