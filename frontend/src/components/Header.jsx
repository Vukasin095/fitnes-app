import { useNavigate } from 'react-router-dom';
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaDumbbell, FaBoxOpen, FaUserShield } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
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
            console.error('Logout failed:', err);
        }
    }

    return (
        <header>
            <Navbar fixed="top" expand="md" collapseOnSelect className="app-navbar" variant="dark">
                <Container className="d-flex align-items-center justify-content-between">
                    <LinkContainer to="/">
                        <Navbar.Brand style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            fontSize: '1.1rem',
                            fontWeight: 900,
                            letterSpacing: '0.03em'
                        }}>
                            <i className="fas fa-dumbbell text-neon me-2" aria-hidden="true"></i>
                            <span className="fw-bold text-white tracking-wider">IRON<span>CORE</span></span>
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{
                        border: '1px solid #ccff00',
                        borderRadius: '8px'
                    }} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <LinkContainer to="/o-nama">
                                <Nav.Link style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    O nama
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/memberships">
                                <Nav.Link style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FaDumbbell /> Članarine
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/cart">
                                <Nav.Link style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem'
                                }}>
                                    <FaShoppingCart /> Korpa
                                    {cartItems.length > 0 && (
                                        <Badge pill bg="" style={{
                                            background: '#ccff00',
                                            color: '#0f1117',
                                            fontWeight: 800,
                                            fontSize: '0.8rem',
                                            padding: '0.3rem 0.6rem',
                                            marginLeft: '0.2rem'
                                        }}>
                                            {cartItems.reduce((a, c) => a + c.qty, 0)}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </LinkContainer>

                            {userInfo ? (
                                <NavDropdown 
                                    title={`👤 ${userInfo.name}`} 
                                    id="username"
                                    align="end"
                                >
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            color: '#ffffff',
                                            fontWeight: 600
                                        }}>
                                            <FaUser /> Profil
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider style={{
                                        borderColor: '#2e3545'
                                    }} />
                                    <NavDropdown.Item 
                                        onClick={logoutHandler}
                                        style={{
                                            color: '#fca5a5',
                                            fontWeight: 600
                                        }}
                                    >
                                        Odjava
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link style={{
                                        padding: '0.6rem 1rem',
                                        borderRadius: '10px',
                                        background: 'rgba(204, 255, 0, 0.1)',
                                        border: '1px solid #ccff00',
                                        color: '#ccff00',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.3s ease'
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#ccff00';
                                        e.currentTarget.style.color = '#0f1117';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
                                        e.currentTarget.style.color = '#ccff00';
                                    }}>
                                        <FaUser /> Prijava
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown 
                                    title="⚙️ ADMIN" 
                                    id="adminmenu"
                                    align="end"
                                    style={{
                                        background: 'rgba(255, 69, 0, 0.1)',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '8px',
                                        color: '#ff4500'
                                    }}
                                >
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            color: '#ffffff',
                                            fontWeight: 600
                                        }}>
                                            <FaBoxOpen /> Proizvodi
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item style={{
                                            color: '#ffffff',
                                            fontWeight: 600
                                        }}>
                                            📦 Porudžbine
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            color: '#ffffff',
                                            fontWeight: 600
                                        }}>
                                            <FaUserShield /> Korisnici
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
