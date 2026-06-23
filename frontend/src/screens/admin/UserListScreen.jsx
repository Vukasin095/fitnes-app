import { Table, Button, Row, Col, Card, Container } from 'react-bootstrap';
import { FaTrash, FaEdit, FaUserPlus } from 'react-icons/fa';
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
        if (window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
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
        <Container className='admin-page-container'>
            <Row className='align-items-center mb-4 admin-header-row'>
                <Col>
                    <h1 className='admin-page-title'>👥 UPRAVLJANJE KORISNICIMA</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='add-to-cart-btn admin-add-btn' onClick={createUserHandler}>
                        <FaUserPlus /> Novi korisnik
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Card className='border-0 shadow-soft admin-list-card'>
                    <div className='admin-table-wrap'>
                        <Table striped hover responsive className='table-sm mb-0 admin-table'>
                            <thead className='admin-table-head'>
                                <tr>
                                    <th className='admin-th'>ID</th>
                                    <th className='admin-th'>IME</th>
                                    <th className='admin-th'>EMAIL</th>
                                    <th className='admin-th'>ADMIN</th>
                                    <th className='admin-th'>ČLAN</th>
                                    <th className='admin-th'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((user) => (
                                    <tr key={user._id} className='admin-table-row'>
                                        <td className='admin-td id-col'>{user._id.substring(0, 8)}...</td>
                                        <td className='admin-td name-col'>{user.name}</td>
                                        <td className='admin-td email-col'>{user.email}</td>
                                        <td className={`admin-td status-col ${user.isAdmin ? 'status-yes' : 'status-no'}`}>{user.isAdmin ? '✓ DA' : '✗ NE'}</td>
                                        <td className={`admin-td status-col ${user.isMember ? 'status-yes' : 'status-no'}`}>{user.isMember ? '✓ DA' : '✗ NE'}</td>
                                        <td className='admin-td actions-col'>
                                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                <Button className='admin-edit-btn'><FaEdit /> Uredi</Button>
                                            </LinkContainer>
                                            <Button className='admin-delete-btn' onClick={() => deleteHandler(user._id)}><FaTrash /> Obriši</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}
        </Container>
    );
};

export default UserListScreen;
