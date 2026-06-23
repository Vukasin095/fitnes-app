import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';

const UserEditScreen = () => {
    const { id: userId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMember, setIsMember] = useState(false);

    const { data: user, isLoading, error, refetch } = useGetUserByIdQuery(userId);
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setIsAdmin(user.isAdmin || false);
            setIsMember(user.isMember || false);
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ id: userId, name, email, isAdmin, isMember }).unwrap();
            toast.success('Korisnik ažuriran');
            refetch();
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
                    <h1 style={{ color: '#ffffff', fontWeight: 900, marginBottom: '0.5rem' }}>Izmena korisnika</h1>
                    <p style={{ color: '#94a3b8', margin: 0 }}>Ažurirajte status i podatke korisnika u premium administratorskom panelu.</p>
                </div>
                {loadingUpdate && <Loader />}
                {isLoading || !user ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='mb-3'>
                            <Form.Label style={{ color: '#cbd5e1', fontWeight: 700 }}>Ime</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Unesite ime'
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
                            Ažuriraj korisnika
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;
