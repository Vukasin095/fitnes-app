import { useState } from 'react';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetProductsQuery } from '../slices/productsApiSlice'
const HomeScreen = () => {
    const [activeCategory, setActiveCategory] = useState('Sve');
    const { data: products, isLoading, error } = useGetProductsQuery();

    const categories = ['Sve', 'Suplementi', 'Oprema', 'Zdravlje'];

    const filteredProducts = products
        ? products
            .filter((product) => product.category !== 'Članarine')
            .filter((product) =>
                activeCategory === 'Sve' ? true : product.category === activeCategory
            )
        : [];

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <h1>Novi proizvodi</h1>
                    <ButtonGroup className='mb-4'>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={category === activeCategory ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </ButtonGroup>
                    <Row>
                        {filteredProducts.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </>
    )
}
export default HomeScreen