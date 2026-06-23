import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, FormControl, Container, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import {
    useGetProductDetailsQuery,
    useGetProductsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);
    const { data: products } = useGetProductsQuery();
    const [updateProduct, { isLoading: loadingUpdate }] =
        useUpdateProductMutation();
    // eslint-disable-next-line no-unused-vars
    const [uploadProductImage, { isLoading: loadingUpload }] =
        useUploadProductImageMutation();
    const navigate = useNavigate();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                category,
                description,
                countInStock,
            }).unwrap();
            toast.success('Proizvod uspešno ažuriran');
            refetch();
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const uniqueCategories = products ? [...new Set(products.map((p) => p.category))].filter(Boolean) : [];

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            setImage(res.image);
            toast.success('Slika uspešno otpremljena');
        }
        catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    return (
        <Container className='admin-page-container'>
            <Row className='mb-4'>
                <Col>
                    <Link to='/admin/productlist' className='back-link'>
                        <FaArrowLeft /> Nazad
                    </Link>
                </Col>
            </Row>
            <FormContainer>
                <h1 className='page-heading'>⚙️ UREDI PROIZVOD</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='mb-3'>
                            <Form.Label className='form-label'>Naziv proizvoda</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Unesite naziv proizvoda'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='form-input'
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='price' className='mb-3'>
                            <Form.Label className='form-label'>Cena (RSD)</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Unesite cenu proizvoda'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className='form-input'
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='image' className='mb-3'>
                            <Form.Label className='form-label'>Slika</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Unesite URL slike proizvoda'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className='form-input mb-3'>
                            </Form.Control>
                            <FormControl 
                                type='file' 
                                label='Odaberi sliku'
                                onChange={uploadFileHandler}
                                className='form-input'>
                            </FormControl>
                        </Form.Group>
                        <Form.Group controlId='countInStock' className='mb-3'>
                            <Form.Label className='form-label'>Količina na skladištu</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Unesite dostupnu količinu'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                className='form-input'
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='category' className='mb-3'>
                            <Form.Label className='form-label'>Kategorija</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='form-input'
                            >
                                <option value=''>Izaberite kategoriju...</option>
                                {uniqueCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId='description' className='mb-3'>
                            <Form.Label className='form-label'>Opis</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                placeholder='Unesite opis proizvoda'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='form-input'
                            ></Form.Control>
                        </Form.Group>
                        <Button
                            type='submit'
                            className='add-to-cart-btn w-100 mt-3'
                        >
                            Ažuriraj proizvod
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </Container>
    );
};
export default ProductEditScreen;