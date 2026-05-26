import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='text-white py-4 mt-5' style={{ backgroundColor: '#111', borderTop: '3px solid #ff4a4a' }}>
      <Container>
        <Row className='align-items-center'>
          <Col md={6} className='text-center text-md-start mb-3 md-md-0'>
            <h5 className='text-uppercase fw-bold m-0' style={{ letterSpacing: '1px' }}>
              POWER<span style={{ color: '#ff4a4a' }}>FIT</span> CENTAR
            </h5>
            <p className='small text-muted mb-0 mt-1'>Premium suplementacija i vođenje članarina online. Bez izgovora.</p>
          </Col>
          <Col md={6} className='text-center text-md-end small text-muted'>
            <p className='mb-0'>&copy; {currentYear} PowerFit. Sva prava zadržana.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;