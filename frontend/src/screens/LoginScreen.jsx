import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col, Card, Container } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader"
import { useLoginMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <Container className='auth-screen-wrapper'>
            <Card className='auth-card'>
                <h1 className='auth-heading'>
                    🔐 PRIJAVA
                </h1>
                <p className='auth-subtitle'>
                    Pristupite vašem nalogu
                </p>

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label className='auth-form-label'>
                            Email
                        </Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Unesite email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className='auth-input'
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label className='auth-form-label'>
                            Lozinka
                        </Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Unesite lozinku" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className='auth-input'
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="add-to-cart-btn auth-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : '✓ Prijavi me'}
                    </Button>

                    {isLoading && <div className='mt-3'><Loader /></div>}
                </Form>

                <Row className="mt-4">
                    <Col className='text-center auth-footer-text'>
                        Nemate nalog?{' '}
                        <Link 
                            to={redirect ? `/register?redirect=${redirect}` : "/register"}
                            className='auth-footer-link'
                        >
                            Registrujte se
                        </Link>
                    </Col>
                </Row>
            </Card>
        </Container>
    )
}

export default LoginScreen
