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


    return (
        <>
            <Link to='/admin/userlist' className='back-link my-3'>Nazad</Link>
            <FormContainer>
                <div className='mb-3'>
                    <h1 className='admin-page-title'>Izmena korisnika</h1>
                    <p className='text-muted mb-0'>Ažurirajte status i podatke korisnika u premium administratorskom panelu.</p>
                </div>
                {loadingUpdate && <Loader />}
                {isLoading || !user ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='mb-3'>
                            <Form.Label className='form-label'>Ime</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Unesite ime'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='form-input'
                            />
                        </Form.Group>

                        <Form.Group controlId='email' className='mb-3'>
                            <Form.Label className='form-label'>Email</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Unesite email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='form-input'
                            />
                        </Form.Group>

                        <Form.Group controlId='isadmin' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label={<span className='form-check-label'>Admin</span>}
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                        </Form.Group>

                        <Form.Group controlId='ismember' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label={<span className='form-check-label'>Member</span>}
                                checked={isMember}
                                onChange={(e) => setIsMember(e.target.checked)}
                            />
                        </Form.Group>

                        <Button type='submit' className='neon-submit-btn w-100'>
                            Ažuriraj korisnika
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;
