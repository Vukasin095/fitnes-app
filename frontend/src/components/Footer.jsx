import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    return (
        <footer style={{
            background: 'linear-gradient(180deg, rgba(22, 25, 34, 0.4), rgba(15, 17, 22, 0.8))',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid #2e3545',
            marginTop: '4rem',
            padding: '2rem 0'
        }}>
            <Container>
                <Row>
                    <Col className="text-center py-2">
                        <p style={{
                            fontSize: '0.85rem',
                            color: '#94a3b8',
                            margin: 0,
                            letterSpacing: '0.08em'
                        }}>
                            © {currentYear} IronCore | Premium Gym & Fitness
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
