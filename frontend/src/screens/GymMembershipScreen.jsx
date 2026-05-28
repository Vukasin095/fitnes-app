import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaDumbbell, FaCheck, FaLock } from 'react-icons/fa';
import { useGetProductsQuery } from '../slices/productsApiSlice'; // Dodato za povlačenje iz baze
import Loader from '../components/Loader'; // Dodato
import Message from '../components/Message'; // Dodato

const GymMembershipScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const membershipActive = userInfo?.membershipActive && userInfo?.membershipExpires && new Date(userInfo.membershipExpires) > new Date();

  // Učitavamo sve proizvode iz baze
  // (Prazan objekat {} prosleđujemo ako tvoj API očekuje keyword/pageNumber parametre)
  const { data, isLoading, error } = useGetProductsQuery({});

  // Osiguravamo da dobijemo niz (zavisno od toga da li tvoj backend koristi paginaciju pa vraća { products: [...] } ili samo niz)
  const products = data?.products || data || [];

  // Filtriramo iz baze samo one proizvode koji pripadaju kategoriji "Članarine"
  const paketi = products.filter((product) => product.category === 'Članarine' || product.isMembership);

  const handleKupi = (paket) => {
    // Sada se ovde prosleđuje pravi, dugačak MongoDB _id (npr. 64a2f1...)
    navigate(`/membership/${paket._id}`);
  };

  return (
    <Container className='my-5'>
      <div className='text-center mb-5'>
        <h2 className='text-uppercase fw-bold' style={{ color: '#ff4a4a' }}>Naši Paketi Članarina</h2>
        <p className='text-muted'>Postanite deo našeg tima i ostvarite najbolje rezultate.</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : paketi.length === 0 ? (
        <Message variant='info'>Trenutno nema dostupnih paketa članarina.</Message>
      ) : (
        <Row>
          {paketi.map((paket) => (
            <Col md={4} key={paket._id} className='mb-4'>
              <Card className='h-100 border-0 shadow-lg bg-dark text-white rounded overflow-hidden'>
                <div className='p-4 text-center' style={{ backgroundColor: '#1e1e1e' }}>
                  <FaDumbbell size={50} className='mb-3' style={{ color: '#ff4a4a' }} />
                  <h4 className='fw-bold text-uppercase'>{paket.name}</h4>
                  <h2 className='my-3'>{paket.price?.toLocaleString('sr-RS')} RSD</h2>
                  
                  {/* Koristimo paket.description (ili desc) kako bi odgovaralo polju iz tvoje baze */}
                  <p className='small text-muted'>{paket.description || paket.desc}</p>
                  
                  <ul className='list-unstyled text-start my-4'>
                    <li><FaCheck className='me-2' style={{ color: '#ff4a4a' }} /> Moderni trenažeri</li>
                    <li><FaCheck className='me-2' style={{ color: '#ff4a4a' }} /> Svlačionice</li>
                    <li><FaCheck className='me-2' style={{ color: '#ff4a4a' }} /> Wi-Fi konekcija</li>
                  </ul>

                  <Button 
                    className='w-100 py-3 fw-bold text-uppercase border-0' 
                    style={{ 
                      backgroundColor: membershipActive ? '#6c757d' : userInfo?.gymCode ? '#ff4a4a' : '#6c757d',
                      cursor: membershipActive ? 'not-allowed' : userInfo?.gymCode ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!userInfo?.gymCode || membershipActive}
                    onClick={() => handleKupi(paket)}
                  >
                    {membershipActive ? 'Već imate aktivnu članarinu' : userInfo?.gymCode ? 'Izaberi paket' : <><FaLock className='me-2' /> Potreban članski kod</>}
                  </Button>

                  {!userInfo?.gymCode && (
                    <div className='mt-3 text-center'>
                      <p className='text-muted' style={{ fontSize: '0.8rem', marginBottom: '0' }}>
                        Za kupovinu je potreban aktivan kod.
                      </p>
                      <Link 
                        to='/profile' 
                        className='fw-bold'
                        style={{ 
                          color: '#ff4a4a', 
                          textDecoration: 'underline',
                          fontSize: '0.85rem'
                        }}
                      >
                        Unesite kod na profilu
                      </Link>
                    </div>
                  )}
                  {membershipActive && (
                    <div className='mt-3 text-center'>
                      <p className='text-muted' style={{ fontSize: '0.8rem', marginBottom: '0' }}>
                        Vaša trenutna članarina je i dalje aktivna. Možete kupiti novu nakon isteka.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default GymMembershipScreen;