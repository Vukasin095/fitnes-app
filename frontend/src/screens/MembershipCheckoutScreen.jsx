import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { FaCreditCard, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const MembershipCheckoutScreen = () => {
  const navigate = useNavigate();
  const { membershipPackage } = useSelector((state) => state.membership);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!membershipPackage) {
      navigate('/gym-membership');
      return;
    }
  }, [membershipPackage, navigate]);

  const handlePaymentSimulation = () => {
    setIsProcessing(true);
    // Simuliraj plaćanje sa kašnjenjem
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2500);
  };

  const handleContinue = () => {
    navigate('/membership-placeorder');
  };

  return (
    <Container className='my-4 d-flex justify-content-center align-items-center' style={{ minHeight: '70vh' }}>
      <Card className='border-0 shadow-lg bg-dark text-white rounded' style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Header className='text-center py-4' style={{ backgroundColor: '#1e1e1e', borderBottom: '3px solid #ff4a4a' }}>
          <h3 className='text-uppercase fw-bold m-0' style={{ color: '#ff4a4a', letterSpacing: '1px' }}>
            Simulirano Plaćanje
          </h3>
        </Card.Header>

        <Card.Body className='p-4'>
          {!isComplete ? (
            <>
              <Alert variant='info' className='border-0 bg-secondary text-white mb-4'>
                <p className='m-0'>
                  <strong>Napomena:</strong> Ovo je demo verzija aplikacije. Plaćanje će biti simulirano.
                </p>
              </Alert>

              <div className='text-center mb-4'>
                {isProcessing ? (
                  <>
                    <div className='mb-3'>
                      <Loader />
                    </div>
                    <p className='text-muted'>Obrada plaćanja...</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '4rem', color: '#ff4a4a', marginBottom: '1rem' }}>
                      <FaCreditCard />
                    </div>
                    <h4 className='fw-bold mb-3'>Paket: {membershipPackage?.name}</h4>
                    <p className='text-muted mb-3'>Iznos: {membershipPackage?.price?.toLocaleString('sr-RS')} RSD</p>

                    <div className='bg-secondary p-3 rounded mb-4' style={{ borderLeft: '4px solid #ff4a4a' }}>
                      <p className='text-muted small mb-0'>
                        Kliknite dugme ispod da simulirate uspešno plaćanje
                      </p>
                    </div>

                    <Button
                      className='w-100 fw-bold text-uppercase py-3 border-0'
                      style={{ backgroundColor: '#ff4a4a' }}
                      onClick={handlePaymentSimulation}
                    >
                      <FaCreditCard className='me-2' /> Simuliraj Plaćanje
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className='text-center mb-4'>
                <div style={{ fontSize: '4rem', color: '#28a745', marginBottom: '1rem' }}>
                  <FaCheckCircle />
                </div>
                <h4 className='fw-bold mb-3 text-success'>Plaćanje Uspešno!</h4>
                <p className='text-muted mb-3'>Vaše plaćanje je simulirano. Nastavite na finalni korak.</p>
              </div>

              <Alert variant='success' className='border-0 mb-4'>
                <p className='m-0'>
                  ✓ Plaćanje je obrađeno
                </p>
                <p className='m-0'>
                  ✓ Članarina će biti aktivirana nakon potvrde
                </p>
              </Alert>

              <Button
                className='w-100 fw-bold text-uppercase py-3 border-0'
                style={{ backgroundColor: '#28a745' }}
                onClick={handleContinue}
              >
                Nastavi <FaArrowRight className='ms-2' />
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MembershipCheckoutScreen;
