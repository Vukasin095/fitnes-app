import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useCreateUserMutation } from '../../slices/usersApiSlice';

const UserCreateScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [createUser, { isLoading }] = useCreateUserMutation();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error('Molimo popunite sva obavezna polja: ime, email, lozinka');
            return;
        }

        try {
            await createUser({ name, email, password, isAdmin, isMember }).unwrap();
            toast.success('Korisnik uspešno kreiran');
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const inputStyle = {
        background: '#1f232d',
        border: '1px solid #3f4756',
        color: '#e2e8f0',
        borderRadius: '12px',
        padding: '0.85rem',
    };

    const buttonStyle = {
        marginTop: '1.5rem',
        width: '100%',
        background: 'linear-gradient(135deg, #ccff00 0%, #9ae600 100%)',
        border: '1px solid rgba(204, 255, 0, 0.7)',
        color: '#0f1117',
        fontWeight: 800,
        padding: '0.95rem 0.85rem',
        borderRadius: '14px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
    };

    return (
        <>
            <Link
                to='/admin/userlist'
                className='btn btn-outline-light my-3'
                style={{ borderRadius: '10px', borderColor: '#3f4756', color: '#ffffff' }}
            >
                Nazad
            </Link>
            <FormContainer>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ color: '#ffffff', fontWeight: 900, marginBottom: '0.5rem' }}>Novi korisnik</h1>
                    <p style={{ color: '#94a3b8', margin: 0 }}>Kreirajte novog člana ili administratora sa modernim premium izgledom.</p>
                </div>
                {isLoading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='mb-3'>
                        <Form.Label style={{ color: '#cbd5e1', fontWeight: 700 }}>Ime</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite ime korisnika'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                        />
                    </Form.Group>

                    <Form.Group controlId='email' className='mb-3'>
                        <Form.Label style={{ color: '#cbd5e1', fontWeight: 700 }}>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Unesite email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </Form.Group>

                    <Form.Group controlId='password' className='mb-3'>
                        <Form.Label style={{ color: '#cbd5e1', fontWeight: 700 }}>Lozinka</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Unesite lozinku'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </Form.Group>

                    <Form.Group controlId='isadmin' className='my-2'>
                        <Form.Check
                            type='checkbox'
                            label='Admin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            style={{ color: '#e2e8f0' }}
                        />
                    </Form.Group>

                    <Form.Group controlId='ismember' className='my-2'>
                        <Form.Check
                            type='checkbox'
                            label='Member'
                            checked={isMember}
                            onChange={(e) => setIsMember(e.target.checked)}
                            style={{ color: '#e2e8f0' }}
                        />
                    </Form.Group>

                    <Button type='submit' style={buttonStyle}>
                        Kreiraj korisnika
                    </Button>
                </Form>
            </FormContainer>
        </>
    );
};

export default UserCreateScreen;
