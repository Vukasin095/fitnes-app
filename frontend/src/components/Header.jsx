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
                        <Navbar.Brand className="header-brand">
                            <i className="fas fa-dumbbell text-neon me-2" aria-hidden="true"></i>
                            <span className="fw-bold text-white tracking-wider">IRON<span>CORE</span></span>
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggle-custom" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto navbar-nav-custom">
                            <LinkContainer to="/o-nama">
                                <Nav.Link className="navbar-link">O nama</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/memberships">
                                <Nav.Link className="navbar-link navbar-link-button">
                                    <FaDumbbell /> Članarine
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/cart">
                                <Nav.Link className="navbar-link navbar-link-button">
                                    <FaShoppingCart /> Korpa
                                    {cartItems.length > 0 && (
                                        <Badge pill bg="" className="navbar-badge-pill">
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
                                        <NavDropdown.Item className="navbar-dropdown-item">
                                            <FaUser /> Profil
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider className="navbar-dropdown-divider" />
                                    <NavDropdown.Item 
                                        className="navbar-dropdown-item navbar-dropdown-logout"
                                        onClick={logoutHandler}
                                    >
                                        Odjava
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link className="navbar-link navbar-link-primary">
                                        <FaUser /> Prijava
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown 
                                    title="⚙️ ADMIN" 
                                    id="adminmenu"
                                    align="end"
                                    className="nav-dropdown-admin"
                                >
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item className="navbar-dropdown-item">
                                            <FaBoxOpen /> Proizvodi
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item className="navbar-dropdown-item">
                                            📦 Porudžbine
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item className="navbar-dropdown-item">
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
