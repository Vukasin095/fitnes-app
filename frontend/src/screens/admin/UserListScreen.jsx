import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';

const UserListScreen = () => {
    const { data: users, isLoading, error, refetch } = useGetUsersQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
    const navigate = useNavigate();

    const deleteHandler = async (id) => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika ? ')) {
            try {
                await deleteUser(id).unwrap();
                toast.success('Korisnik uspešno obrisan');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createUserHandler = () => {
        navigate('/admin/user/create');
    };

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Korisnici</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='btn-sm m-3' onClick={createUserHandler}>
                        Kreiraj Novog Korisnika
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Table striped bordered hover responsive className='tablesm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>IME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>MEMBER</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'DA' : 'NE'}</td>
                                <td>{user.isMember ? 'DA' : 'NE'}</td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => deleteHandler(user._id)}
                                    >
                                        <FaTrash style={{ color: 'white' }} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default UserListScreen;
