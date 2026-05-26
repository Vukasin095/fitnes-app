import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container className='py-4'>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6} style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;