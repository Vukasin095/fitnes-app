import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { useActivateMembershipMutation } from '../slices/usersApiSlice';
import { clearMembership } from '../slices/membershipSlice';
import { toast } from 'react-toastify';

const MembershipPlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { membershipPackage, paymentMethod } = useSelector((state) => state.membership);
  const { userInfo } = useSelector((state) => state.auth);

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [activateMembership] = useActivateMembershipMutation();

  const membershipActive = userInfo?.membershipActive && userInfo?.membershipExpires && new Date(userInfo.membershipExpires) > new Date();

  useEffect(() => {
    if (!membershipPackage) {
      navigate('/gym-membership');
      return;
    }
  }, [membershipPackage, navigate]);

  const placeOrderHandler = async () => {
    if (!membershipPackage) {
      navigate('/gym-membership');
      return;
    }

    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (membershipActive) {
      toast.error('Već imate aktivnu članarinu.');
      navigate('/gym-membership');
      return;
    }

    try {
      const orderData = {
        orderItems: [
          {
            name: membershipPackage.name,
            qty: membershipPackage.qty || 1,
            image: membershipPackage.image,
            price: membershipPackage.price,
            isMembership: true,
            product: membershipPackage._id,
          },
        ],
        paymentMethod,
        itemsPrice: membershipPackage.price,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: membershipPackage.price,
      };

      const res = await createOrder(orderData).unwrap();

      await activateMembership().unwrap();
      toast.success('Članarina aktivirana!');

      dispatch(clearMembership());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container className='my-4'>
      <CheckoutSteps step1 step2 step2Label='Plaćanje' step3 step2Link='/membership-payment' />

      {!membershipPackage ? (
        <Message variant='info'>
          Nemate izabranu članarinu. <Link to='/gym-membership'>Izaberite paket</Link>
        </Message>
      ) : (
        <Row className='mt-4'>
          <Col md={8}>
            <ListGroup variant='flush' className='shadow-sm rounded overflow-hidden'>
              <ListGroup.Item className='bg-dark text-white p-3'>
                <h4 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a' }}>Pregled članarine</h4>
              </ListGroup.Item>
              <ListGroup.Item className='p-3 bg-light text-dark'>
                <p className='mb-2'><strong>Metoda:</strong> {paymentMethod}</p>
                {membershipActive ? (
                  <Message variant='warning'>Već imate aktivnu članarinu.</Message>
                ) : (
                  <Message variant='success'>Članarina će biti aktivirana nakon potvrde.</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item className='bg-dark text-white p-3 mt-3'>
                <h4 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a' }}>Paket</h4>
              </ListGroup.Item>
              <ListGroup.Item className='p-3 bg-light text-dark'>
                <ListGroup variant='flush'>
                  <ListGroup.Item className='bg-light px-0 py-2 border-bottom'>
                    <Row className='align-items-center'>
                      <Col md={2}>
                        <Image src={membershipPackage.image} alt={membershipPackage.name} fluid rounded style={{ height: '50px', objectFit: 'cover' }} />
                      </Col>
                      <Col>
                        <span className='fw-bold text-dark'>{membershipPackage.name}</span>
                        <p className='text-muted small mb-0'>{membershipPackage.desc}</p>
                      </Col>
                      <Col md={4} className='text-end fw-bold' style={{ color: '#ff4a4a' }}>
                        {membershipPackage.qty || 1} x {membershipPackage.price.toLocaleString('sr-RS')} RSD = {(membershipPackage.price).toLocaleString('sr-RS')} RSD
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card className='border-0 shadow-sm rounded overflow-hidden text-white' style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Header className='text-center py-3' style={{ backgroundColor: '#ff4a4a' }}>
                <h5 className='text-uppercase fw-bold m-0'>Rezultat</h5>
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
                  style={{ backgroundColor: '#ff4a4a' }}
                  disabled={membershipActive}
                  onClick={placeOrderHandler}
                >
                  {membershipActive ? 'Već imate aktivnu članarinu' : 'Potvrdi kupovinu'}
                </Button>
                {isLoading && <Loader />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MembershipPlaceOrderScreen;
