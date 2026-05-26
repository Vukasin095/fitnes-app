import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  return (
    <Container className='my-4'>
      <Link className='btn btn-outline-dark my-3 fw-bold text-uppercase' to='/'>
        <FaArrowLeft className='me-1' /> Nazad u Šop
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Row className='mt-3'>
          <Col md={5} className='mb-4'>
            <Image src={product.image} alt={product.name} fluid rounded className='shadow-sm' style={{ borderTop: '4px solid #ff4a4a', width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
          </Col>
          
          <Col md={4} className='mb-4'>
            <ListGroup variant='flush' className='shadow-sm rounded overflow-hidden'>
              <ListGroup.Item className='bg-dark text-white p-3'>
                <span className='text-uppercase small fw-bold' style={{ color: '#ff4a4a' }}>{product.category}</span>
                <h3 className='fw-bold text-uppercase m-0 mt-1'>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item className='p-3 bg-light text-dark'>
                <Rating value={product.rating} text={`${product.numReviews}`} />
              </ListGroup.Item>
              <ListGroup.Item className='p-3 bg-light text-dark'>
                <strong>Brend:</strong> {product.brand}
              </ListGroup.Item>
              <ListGroup.Item className='p-3 bg-light text-dark' style={{ lineHeight: '1.6' }}>
                <strong>Opis:</strong> {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card className='border-0 shadow-lg text-white rounded overflow-hidden' style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body className='p-4'>
                <div className='d-flex justify-content-between mb-3 small text-muted'>
                  <span>Cena:</span>
                  <span className='text-white fw-bold fs-4' style={{ color: '#ff4a4a !important' }}>{product.price?.toLocaleString('sr-RS')} RSD</span>
                </div>
                
                <div className='d-flex justify-content-between mb-3 small text-muted align-items-center'>
                  <span>Status zaliha:</span>
                  {product.countInStock > 0 ? (
                    <span className='badge bg-success text-uppercase p-2'>Na stanju</span>
                  ) : (
                    <span className='badge bg-danger text-uppercase p-2'>Rasprodato</span>
                  )}
                </div>

                {product.countInStock > 0 && (
                  <div className='d-flex justify-content-between mb-4 small text-muted align-items-center'>
                    <span>Količina:</span>
                    <Form.Control
                      as='select'
                      value={qty}
                      style={{ width: '70px' }}
                      className='bg-light fw-bold py-1'
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </div>
                )}

                <Button
                  className='w-100 fw-bold text-uppercase py-3 border-0 text-white shadow-sm d-flex align-items-center justify-content-center'
                  style={{ backgroundColor: '#ff4a4a', letterSpacing: '1px' }}
                  type='button'
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  <FaShoppingCart className='me-2' /> Dodaj u Korpu
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductScreen;