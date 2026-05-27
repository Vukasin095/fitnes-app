import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaCheckCircle, FaLock } from 'react-icons/fa';

const CheckoutSteps = ({
  step1,
  step2,
  step3,
  step4,
  step1Label = 'Prijava',
  step2Label = 'Kod Članstva',
  step3Label = 'Plaćanje',
  step4Label = 'Pregled',
  step1Link = '/login',
  step2Link = '/gym-code',
  step3Link = '/payment',
  step4Link = '/placeorder',
}) => {
  return (
    <Nav className='justify-content-center mb-4 text-uppercase small fw-bold' style={{ letterSpacing: '1px' }}>
      <Nav.Item className='mx-2'>
        {step1 ? (
          <LinkContainer to={step1Link}>
            <Nav.Link style={{ color: '#ff4a4a', borderBottom: '2px solid #ff4a4a' }}>
              <FaCheckCircle className='me-1' /> {step1Label}
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted'><FaLock className='me-1' /> {step1Label}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className='mx-2'>
        {step2 ? (
          <LinkContainer to={step2Link}>
            <Nav.Link style={{ color: '#ff4a4a', borderBottom: '2px solid #ff4a4a' }}>
              <FaCheckCircle className='me-1' /> {step2Label}
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted'><FaLock className='me-1' /> {step2Label}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className='mx-2'>
        {step3 ? (
          <LinkContainer to={step3Link}>
            <Nav.Link style={{ color: '#ff4a4a', borderBottom: '2px solid #ff4a4a' }}>
              <FaCheckCircle className='me-1' /> {step3Label}
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted'><FaLock className='me-1' /> {step3Label}</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className='mx-2'>
        {step4 ? (
          <LinkContainer to={step4Link}>
            <Nav.Link style={{ color: '#ff4a4a', borderBottom: '2px solid #ff4a4a' }}>
              <FaCheckCircle className='me-1' /> {step4Label}
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted'><FaLock className='me-1' /> {step4Label}</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;