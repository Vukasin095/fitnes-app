import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    return (
        <footer className="footer-shell">
            <Container>
                <Row>
                    <Col className="text-center py-2">
                        <p className="footer-text">
                            © {currentYear} IronCore | Premium Gym & Fitness
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
