import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Card, Container } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
    useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
    const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const [createProduct, { isLoading: loadingCreate }] =
        useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] =
        useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovaj proizvod?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Proizvod uspešno obrisan');
                refetch();
            }
            catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Da li ste sigurni da želite da napravite novi proizvod?')) {
            try {
                await createProduct().unwrap();
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <Container className='admin-page-container'>
            <Row className='align-items-center mb-4 admin-header-row'>
                <Col>
                    <h1 className='admin-page-title'>📦 UPRAVLJANJE PROIZVODIMA</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='add-to-cart-btn admin-add-btn' onClick={createProductHandler}>
                        <FaPlus /> Novi proizvod
                    </Button>
                </Col>
            </Row>

            {loadingCreate && <Loader />}
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
                                    <th className='admin-th'>NAZIV</th>
                                    <th className='admin-th'>CENA</th>
                                    <th className='admin-th'>KATEGORIJA</th>
                                    <th className='admin-th'>AKCIJE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className='admin-table-row'>
                                        <td className='admin-td id-col'>{product._id.substring(0, 8)}...</td>
                                        <td className='admin-td name-col'>{product.name}</td>
                                        <td className='admin-td price-col'>{product.price} RSD</td>
                                        <td className='admin-td email-col'>{product.category}</td>
                                        <td className='admin-td actions-col'>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button className='admin-edit-btn'><FaEdit /> Uredi</Button>
                                            </LinkContainer>
                                            <Button className='admin-delete-btn' onClick={() => deleteHandler(product._id)}><FaTrash /> Obriši</Button>
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

export default ProductListScreen;