import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import logo from '../assets/logo.png'
import { LinkContainer } from 'react-router-bootstrap'
const Header = () => {
    return (
        <header>
            <Navbar bg="primary" variant="dark" expand="md" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img src={logo} alt="FTN Skriptarnica Logo" width="30" height="30" className="d-inline-block align-top me-2" />
                            <span className="fw-bold">Skriptarnica </span>
                            Fakulteta tehničkih nauka u Novom Sadu
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <FaShoppingCart /> Korpa
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/login">
                                <Nav.Link>
                                    <FaUser /> Prijava
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
