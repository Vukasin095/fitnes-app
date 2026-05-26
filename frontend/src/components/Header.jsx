import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaDumbbell, FaStore, FaIdCard } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect className='py-3' style={{ borderBottom: '3px solid #ff4a4a', backgroundColor: '#1a1a1a !important' }}>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand className='fw-bold fs-3 text-uppercase d-flex align-items-center' style={{ letterSpacing: '1px' }}>
              <FaDumbbell className='me-2' style={{ color: '#ff4a4a' }} /> POWER<span style={{ color: '#ff4a4a' }}>FIT</span>
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto align-items-center'>
              
              <LinkContainer to='/'>
                <Nav.Link className='fw-bold text-uppercase px-3 text-white d-flex align-items-center' style={{ letterSpacing: '0.5px' }}>
                  <FaStore className='me-1' style={{ color: '#ff4a4a', fontSize: '0.9rem' }} /> Šop
                </Nav.Link>
              </LinkContainer>

              {/* DODATA IKONICA FaIdCard ZA ČLANARINE */}
              <LinkContainer to='/gym-membership'>
                <Nav.Link className='fw-bold text-uppercase px-3 text-white d-flex align-items-center' style={{ letterSpacing: '0.5px' }}>
                  <FaIdCard className='me-1' style={{ color: '#ff4a4a', fontSize: '0.9rem' }} /> Članarine
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to='/cart' className='me-3'>
                <Nav.Link className='d-flex align-items-center text-white fw-bold text-uppercase'>
                  <FaShoppingCart className='me-1' style={{ color: '#ff4a4a' }} /> Korpa
                  {cartItems.length > 0 && (
                    <Badge pill bg='danger' className='ms-2 px-2 py-1' style={{ fontSize: '0.75rem' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown 
                  title={<span className='text-white fw-bold'><FaUser className='me-1' style={{ color: '#ff4a4a' }} /> {userInfo.name}</span>} 
                  id='username' 
                  className='custom-dropdown'
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Moj Profil</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider style={{ backgroundColor: '#444' }} />
                  <NavDropdown.Item onClick={logoutHandler} className='text-danger fw-bold'>
                    Odjavi se
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className='btn btn-outline-light px-3 py-1 fw-bold text-uppercase d-flex align-items-center' style={{ borderColor: '#ff4a4a', color: '#fff' }}>
                    <FaUser className='me-1' style={{ color: '#ff4a4a' }} /> Prijava
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;