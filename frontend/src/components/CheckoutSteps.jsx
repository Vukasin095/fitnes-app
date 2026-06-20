import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <Nav className="justify-content-center mb-4">
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to="/login">
                        <Nav.Link>Prijava</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Prijava</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step2 ? (
                    <LinkContainer to="/shipping">
                        <Nav.Link>Podaci o dostavi</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Podaci o dostavi</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step3 ? (
                    <LinkContainer to="/payment">
                        <Nav.Link>Plaćanje</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Plaćanje</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step4 ? (
                    <LinkContainer to="/complete">
                        <Nav.Link> Pregled porudžbine </Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled> Pregled porudžbine </Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    );
};

export default CheckoutSteps;