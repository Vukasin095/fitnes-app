import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card, Container } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login');
    } else if (!userInfo.gymCode) {
      toast.error('Ova akcija zahteva status člana kluba (unesite kod na profilu).');
      navigate('/profile');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <Container className='my-4'>
      <div className='mb-4' style={{ borderLeft: '5px solid #ff4a4a', paddingLeft: '12px' }}>
        <h2 className='fw-bold text-uppercase m-0' style={{ fontSize: '1.6rem' }}>Vaša Korpa</h2>
      </div>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Message variant='info'>
              Vaša korpa je prazna. <Link to='/' className='text-dark'>Nazad u šop</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id} className='p-3 border-bottom'>
                  <Row className='align-items-center'>
                    <Col md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                    <Col md={4}><Link to={`/product/${item._id}`} className='text-dark fw-bold'>{item.name}</Link></Col>
                    <Col md={2} className='fw-bold'>{item.price.toLocaleString('sr-RS')} RSD</Col>
                    <Col md={2}>
                      <Form.Control as='select' value={item.qty} onChange={(e) => addToCartHandler(item, Number(e.target.value))}>
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}><Button variant='light' onClick={() => removeFromCartHandler(item._id)}><FaTrash style={{ color: '#ff4a4a' }} /></Button></Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card className='p-4 bg-dark text-white'>
            <h4 className='text-uppercase fw-bold'>Ukupno: {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('sr-RS')} RSD</h4>
            <Button className='w-100 mt-3 border-0' style={{ backgroundColor: '#ff4a4a' }} onClick={checkoutHandler}>Naruči</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartScreen;