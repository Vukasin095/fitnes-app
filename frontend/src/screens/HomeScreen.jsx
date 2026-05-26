import { useState } from 'react';
import { Row, Col, Button, Container, ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  // Stanje koje prati trenutno izabranu kategoriju filtera
  const [selectedCategory, setSelectedCategory] = useState('Sve');

  // Filtriranje proizvoda na osnovu izabrane kategorije
  const filteredProducts = products
    ? selectedCategory === 'Sve'
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())
    : [];

  return (
    <>
      {/* HERO BANER */}
      <div className='p-5 mb-5 text-white' style={{
        background: 'linear-gradient(rgba(15, 15, 15, 0.85), rgba(15, 15, 15, 0.85)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '0px 0px 20px 20px',
        borderBottom: '2px solid #ff4a4a'
      }}>
        <Container className='py-4 text-center'>
          <h1 className='display-4 fw-black text-uppercase mb-2' style={{ letterSpacing: '2px', fontWeight: '900' }}>
            NEMA IZGOVORA. <span style={{ color: '#ff4a4a' }}>SAMO REZULTATI.</span>
          </h1>
          <p className='fs-5 my-3 text-light' style={{ maxWidth: '650px', margin: '0 auto' }}>
            Aktivirajte članarinu online, pristupite boks zoni i nabavite najjaču suplementaciju na jednom mestu.
          </p>
          <div className='mt-3'>
            <LinkContainer to='/gym-membership'>
              <Button size='md' className='px-4 py-2 fw-bold text-uppercase border-0 shadow' style={{ backgroundColor: '#ff4a4a', letterSpacing: '1px' }}>
                Pogledaj Pakete Članarina
              </Button>
            </LinkContainer>
          </div>
        </Container>
      </div>

      <Container>
        <Row>
          {/* BOČNI FILTER MENI (SA STRANE SHOPA) */}
          <Col md={3} className='mb-4'>
            <div className='p-3 rounded shadow-sm' style={{ backgroundColor: '#1e1e1e', borderTop: '4px solid #ff4a4a' }}>
              <h4 className='text-white text-uppercase fw-bold mb-3 small' style={{ letterSpacing: '1px' }}>
                Kategorije Šopa
              </h4>
              <ListGroup variant='flush' className='rounded'>
                <ListGroup.Item 
                  action 
                  onClick={() => setSelectedCategory('Sve')}
                  className='fw-bold text-uppercase py-2'
                  style={{ 
                    backgroundColor: selectedCategory === 'Sve' ? '#ff4a4a' : '#2a2a2a', 
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  ✓ Prikaži Sve
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  onClick={() => setSelectedCategory('Suplementi')}
                  className='fw-bold text-uppercase py-2 my-1'
                  style={{ 
                    backgroundColor: selectedCategory === 'Suplementi' ? '#ff4a4a' : '#2a2a2a', 
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  🏋️ Suplementi
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  onClick={() => setSelectedCategory('Oprema')}
                  className='fw-bold text-uppercase py-2'
                  style={{ 
                    backgroundColor: selectedCategory === 'Oprema' ? '#ff4a4a' : '#2a2a2a', 
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  🎒 Sportska Oprema
                </ListGroup.Item>
              </ListGroup>
              
              {/* Dugme za brzi reset na shop */}
              {selectedCategory !== 'Sve' && (
                <Button 
                  variant='outline-light' 
                  size='sm' 
                  className='w-100 mt-3 fw-bold text-uppercase'
                  onClick={() => setSelectedCategory('Sve')}
                  style={{ fontSize: '0.75rem', borderColor: '#ff4a4a' }}
                >
                  Resetuj na početnu
                </Button>
              )}
            </div>
          </Col>

          {/* DESNA STRANA: PROIZVODI */}
          <Col md={9}>
            <div className='mb-4 d-flex justify-content-between align-items-center' style={{ borderLeft: '5px solid #ff4a4a', paddingLeft: '12px' }}>
              <div>
                <h2 className='fw-bold text-uppercase m-0' style={{ letterSpacing: '0.5px', fontSize: '1.5rem' }}>
                  {selectedCategory === 'Sve' ? 'Svi Proizvodi' : selectedCategory}
                </h2>
                <small className='text-muted'>Pronađite idealne artikle za Vaš napredak</small>
              </div>
            </div>

            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : filteredProducts.length === 0 ? (
              <Message variant='info'>Trenutno nema proizvoda u ovoj kategoriji.</Message>
            ) : (
              <Row>
                {filteredProducts.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} className='d-flex align-items-stretch mb-2'>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomeScreen;