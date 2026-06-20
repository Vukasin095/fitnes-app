import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, FormControl } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
    useGetProductDetailsQuery,
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
    const [updateProduct, { isLoading: loadingUpdate }] =
        useUpdateProductMutation();
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
            toast.success('Proizvod ažuriran uspešno');
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
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Nazad
            </Link>
            <FormContainer>
                <h1>Izmena Proizvoda</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Naziv</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Upišite naziv proizvoda'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='price'>
                            <Form.Label>Cena</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Upišite cenu proizvoda'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='image' className='my-2'>
                            <Form.Label>Slika</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Upišite URL slike proizvoda'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}>
                            </Form.Control>
                            <FormControl type='file' label='Izaberi sliku'
                                onChange={uploadFileHandler}>
                            </FormControl>
                        </Form.Group>
                        <Form.Group controlId='countInStock'>
                            <Form.Label>Dostupna količina</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Upišite dostupnu količinu proizvoda'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='category'>
                            <Form.Label>Kategorija</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Upišite kategoriju proizvoda'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label>Opis</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Upišite opis proizvoda'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Button
                            type='submit'
                            variant='primary'
                            style={{ marginTop: '1rem' }}
                        >
                            Ažuriraj
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};
export default ProductEditScreen;