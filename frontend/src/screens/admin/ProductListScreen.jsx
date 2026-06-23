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
        <Container style={{ paddingBottom: '3rem' }}>
            <Row className='align-items-center mb-4' style={{
                paddingBottom: '2rem',
                borderBottom: '2px solid #3f4756'
            }}>
                <Col>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        letterSpacing: '0.02em',
                        margin: 0
                    }}>
                        📦 UPRAVLJANJE PROIZVODIMA
                    </h1>
                </Col>
                <Col className='text-end'>
                    <Button className='add-to-cart-btn' style={{
                        padding: '0.8rem 1.5rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        fontSize: '0.9rem'
                    }} onClick={createProductHandler}>
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
                <Card className='border-0 shadow-soft' style={{
                    background: 'linear-gradient(135deg, #282d3a, #222631)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid #3f4756'
                }}>
                    <div style={{
                        overflowX: 'auto',
                        borderRadius: '12px'
                    }}>
                        <Table striped hover responsive className='table-sm mb-0' style={{
                            color: '#ffffff'
                        }}>
                            <thead style={{
                                background: '#1a1e27',
                                borderBottom: '2px solid #3f4756'
                            }}>
                                <tr>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>ID</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>NAZIV</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>CENA</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>KATEGORIJA</th>
                                    <th style={{
                                        color: '#94a3b8',
                                        fontWeight: 800,
                                        padding: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.02em',
                                        fontSize: '0.85rem'
                                    }}>AKCIJE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} style={{
                                        borderBottom: '1px solid #3f4756',
                                        transition: 'all 0.3s ease'
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(204, 255, 0, 0.05)';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}>
                                        <td style={{ color: '#ccff00', fontWeight: 700, padding: '1rem' }}>
                                            {product._id.substring(0, 8)}...
                                        </td>
                                        <td style={{ color: '#cbd5e1', padding: '1rem' }}>
                                            {product.name}
                                        </td>
                                        <td style={{ color: '#ccff00', fontWeight: 800, padding: '1rem' }}>
                                            {product.price} RSD
                                        </td>
                                        <td style={{ color: '#94a3b8', padding: '1rem', fontSize: '0.9rem' }}>
                                            {product.category}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button style={{
                                                    background: 'transparent',
                                                    border: '1px solid #ccff00',
                                                    color: '#ccff00',
                                                    borderRadius: '8px',
                                                    padding: '0.5rem 0.8rem',
                                                    marginRight: '0.5rem',
                                                    fontWeight: 700,
                                                    transition: 'all 0.3s ease',
                                                    fontSize: '0.85rem'
                                                }} onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#ccff00';
                                                    e.currentTarget.style.color = '#0f1117';
                                                }} onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#ccff00';
                                                }}>
                                                    <FaEdit /> Uredi
                                                </Button>
                                            </LinkContainer>
                                            <Button style={{
                                                background: 'rgba(239, 68, 68, 0.2)',
                                                border: '1px solid rgba(239, 68, 68, 0.5)',
                                                color: '#fca5a5',
                                                borderRadius: '8px',
                                                padding: '0.5rem 0.8rem',
                                                fontWeight: 700,
                                                transition: 'all 0.3s ease',
                                                fontSize: '0.85rem'
                                            }} onClick={() => deleteHandler(product._id)}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                                }}>
                                                <FaTrash /> Obriši
                                            </Button>
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