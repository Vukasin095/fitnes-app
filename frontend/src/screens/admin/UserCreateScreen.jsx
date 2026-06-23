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


    return (
        <>
            <Link to='/admin/userlist' className='back-link my-3'>Nazad</Link>
            <FormContainer>
                <div className='mb-3'>
                    <h1 className='admin-page-title'>Novi korisnik</h1>
                    <p className='text-muted mb-0'>Kreirajte novog člana ili administratora sa modernim premium izgledom.</p>
                </div>
                {isLoading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='mb-3'>
                        <Form.Label className='form-label'>Ime</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite ime korisnika'
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

                    <Form.Group controlId='password' className='mb-3'>
                        <Form.Label className='form-label'>Lozinka</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Unesite lozinku'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        Kreiraj korisnika
                    </Button>
                </Form>
            </FormContainer>
        </>
    );
};

export default UserCreateScreen;
