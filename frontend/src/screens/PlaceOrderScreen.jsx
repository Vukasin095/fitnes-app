import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const membership = useSelector((state) => state.membership);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (membership.membershipPackage) {
      navigate('/membership-placeorder');
      return;
    }

    if (cart.cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.cartItems.length, cart.paymentMethod, membership.membershipPackage, navigate]);

  const placeOrderHandler = async () => {
    try {
      const orderData = {
        orderItems: cart.cartItems,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingAddress: cart.shippingAddress,
        gymCode: cart.gymCode,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      };

      const res = await createOrder(orderData).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container className='my-4'>
      <CheckoutSteps step1 step2 step3 step4 step2Label='Dostava' step2Link='/shipping' />
      
      <Row className='mt-4'>
        {/* LEVA STRANA: DETALJI */}
        <Col md={8}>
          <ListGroup variant='flush' className='shadow-sm rounded overflow-hidden'>
            <ListGroup.Item className='bg-dark text-white p-3 mt-3'>
              <h4 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a', fontSize: '1.1rem' }}>
                1. Metod Plaćanja
              </h4>
            </ListGroup.Item>
            <ListGroup.Item className='p-3 bg-light text-dark'>
              <strong>Opcija: </strong>{cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item className='bg-dark text-white p-3 mt-3'>
              <h4 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a', fontSize: '1.1rem' }}>
                2. Artikli
              </h4>
            </ListGroup.Item>
            <ListGroup.Item className='p-3 bg-light text-dark'>
              {cart.cartItems.length === 0 ? (
                <Message>Vaša korpa je prazna</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index} className='bg-light px-0 py-2 border-bottom'>
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Image src={item.image} alt={item.name} fluid rounded style={{ height: '50px', objectFit: 'cover' }} />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`} className='text-dark fw-bold text-decoration-none'>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} className='text-end fw-bold'>
                          {item.qty} x {item.price.toLocaleString('sr-RS')} RSD = <span style={{ color: '#ff4a4a' }}>{(item.qty * item.price).toLocaleString('sr-RS')} RSD</span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* DESNA STRANA: KASA KARTICA */}
        <Col md={4}>
          <Card className='border-0 shadow-lg rounded overflow-hidden text-white' style={{ backgroundColor: '#1e1e1e' }}>
            <Card.Header className='text-center py-3' style={{ backgroundColor: '#ff4a4a' }}>
              <h4 className='text-uppercase fw-bold m-0' style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>Rezutat Kase</h4>
            </Card.Header>
            <Card.Body className='p-4'>
              <div className='d-flex justify-content-between my-2 small text-muted'>
                <span>Cena artikala:</span>
                <span className='text-white fw-bold'>{cart.itemsPrice?.toLocaleString('sr-RS')} RSD</span>
              </div>
              <div className='d-flex justify-content-between my-2 small text-muted'>
                <span>Dostava:</span>
                <span className='text-white fw-bold'>{cart.shippingPrice?.toLocaleString('sr-RS')} RSD</span>
              </div>
              <div className='d-flex justify-content-between my-2 small text-muted'>
                <span>PDV (20%):</span>
                <span className='text-white fw-bold'>{cart.taxPrice?.toLocaleString('sr-RS')} RSD</span>
              </div>
              <hr style={{ borderColor: '#444' }} />
              <div className='d-flex justify-content-between align-items-center my-3'>
                <span className='fs-5 text-uppercase fw-bold'>Ukupno:</span>
                <span className='fs-3 fw-black text-warning' style={{ color: '#ff4a4a !important' }}>
                  {cart.totalPrice?.toLocaleString('sr-RS')} RSD
                </span>
              </div>

              <Button
                type='button'
                className='w-100 fw-bold text-uppercase py-3 border-0 text-white mt-2 shadow-sm'
                style={{ backgroundColor: '#ff4a4a', letterSpacing: '1px' }}
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Potvrdi & Naruči Online
              </Button>
              {isLoading && <Loader />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;
