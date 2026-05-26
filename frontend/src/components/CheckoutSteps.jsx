import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaCheckCircle, FaLock } from 'react-icons/fa';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mb-4 text-uppercase small fw-bold' style={{ letterSpacing: '1px' }}>
      <Nav.Item className='mx-2'>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link style={{ color: '#ff4a4a', borderBottom: '2px solid #ff4a4a' }}>
              <FaCheckCircle className='me-1' /> Prijava
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted'><FaLock className='me-1' /> Prijava</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className='mx-2'>
        {step2 ? (
          <LinkContainer to='/gym-code'>
            <Nav.Link style={{ color: '#ff4a4a', borderBottom: '2px solid #ff4a4a' }}>
              <FaCheckCircle className='me-1' /> Kod Članstva
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted'><FaLock className='me-1' /> Kod Članstva</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className='mx-2'>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link style={{ color: '#ff4a4a', borderBottom: '2px solid #ff4a4a' }}>
              <FaCheckCircle className='me-1' /> Plaćanje
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted'><FaLock className='me-1' /> Plaćanje</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className='mx-2'>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link style={{ color: '#ff4a4a', borderBottom: '2px solid #ff4a4a' }}>
              <FaCheckCircle className='me-1' /> Pregled
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted'><FaLock className='me-1' /> Pregled</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;