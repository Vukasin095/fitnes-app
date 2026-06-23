import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col, Card, Container } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader"
import { useRegisterMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

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
        if (password !== confirmPassword) {
            toast.error('Lozinke se ne poklapaju');
            return;
        }
        else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }

    };

    return (
        <Container style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 110px)',
            paddingTop: '2rem',
            paddingBottom: '2rem'
        }}>
            <Card className='border-0 w-100' style={{
                maxWidth: '450px',
                background: 'linear-gradient(135deg, #202430, #1c1f2a)',
                padding: '3rem 2.5rem',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.02em'
                }}>
                    ✨ REGISTRACIJA
                </h1>
                <p style={{
                    color: '#94a3b8',
                    marginBottom: '2rem',
                    fontSize: '0.95rem'
                }}>
                    Napravite novi nalog
                </p>

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label style={{
                            fontWeight: 700,
                            color: '#cbd5e1',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem'
                        }}>
                            Ime
                        </Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Unesite ime" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                background: '#252a37 !important',
                                border: '1px solid #3f485e !important',
                                color: '#ffffff !important',
                                borderRadius: '10px',
                                padding: '0.75rem'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label style={{
                            fontWeight: 700,
                            color: '#cbd5e1',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem'
                        }}>
                            Email adresa
                        </Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Unesite email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                background: '#252a37 !important',
                                border: '1px solid #3f485e !important',
                                color: '#ffffff !important',
                                borderRadius: '10px',
                                padding: '0.75rem'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label style={{
                            fontWeight: 700,
                            color: '#cbd5e1',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem'
                        }}>
                            Lozinka
                        </Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Unesite lozinku" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                background: '#252a37 !important',
                                border: '1px solid #3f485e !important',
                                color: '#ffffff !important',
                                borderRadius: '10px',
                                padding: '0.75rem'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="mb-3">
                        <Form.Label style={{
                            fontWeight: 700,
                            color: '#cbd5e1',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem'
                        }}>
                            Potvrdi lozinku
                        </Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Potvrdi lozinku" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                                background: '#252a37 !important',
                                border: '1px solid #3f485e !important',
                                color: '#ffffff !important',
                                borderRadius: '10px',
                                padding: '0.75rem'
                            }}
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="add-to-cart-btn mt-3 w-100"
                        disabled={isLoading}
                        style={{
                            padding: '0.8rem',
                            fontWeight: 800,
                            borderRadius: '12px',
                            fontSize: '0.95rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}
                    >
                        {isLoading ? <Loader /> : '✓ Registruj me'}
                    </Button>

                    {isLoading && <div style={{ marginTop: '1rem' }}><Loader /></div>}
                </Form>

                <Row className="mt-4">
                    <Col style={{
                        textAlign: 'center',
                        color: '#cbd5e1',
                        fontSize: '0.9rem'
                    }}>
                        Imate nalog?{' '}
                        <Link 
                            to={redirect ? `/login?redirect=${redirect}` : "/login"}
                            style={{
                                color: '#ccff00',
                                fontWeight: 700,
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                            Prijavite se
                        </Link>
                    </Col>
                </Row>
            </Card>
        </Container>
    )
}

export default RegisterScreen
