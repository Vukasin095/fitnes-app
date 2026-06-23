import { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetProductsQuery } from '../slices/productsApiSlice'
const HomeScreen = () => {
    const [activeCategory, setActiveCategory] = useState('Sve');
    const [searchQuery, setSearchQuery] = useState('');
    const { data: products, isLoading, error } = useGetProductsQuery();

    const categories = ['Sve', 'Suplementi', 'Oprema', 'Zdravlje'];

    const filteredProducts = products
        ? products
            .filter((product) => product.category !== 'Članarine')
            .filter((product) =>
                activeCategory === 'Sve' ? true : product.category === activeCategory
            )
            .filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        : [];

    return (
        <Container className='section-shell'>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <Row className='gx-4 gy-4'>
                        <Col md={3} lg={2} className='mb-4'>
                            <div className='p-3 rounded-3' style={{ backgroundColor: '#282d3a', border: '1px solid #3f4756' }}>
                                <h5 className='text-white mb-3 fw-bold tracking-wider' style={{ fontSize: '0.95rem' }}>
                                    FILTERI
                                </h5>

                                <div className='mb-3'>
                                    <label className='form-label text-white-50 mb-2' style={{ fontSize: '0.85rem' }}>
                                        Pretraga proizvoda
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control bg-dark text-white border-secondary w-100'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder='Unesite pojam...'
                                        style={{ minHeight: '42px' }}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label text-white-50 mb-2' style={{ fontSize: '0.85rem' }}>
                                        Kategorija
                                    </label>
                                    <div className='d-grid gap-2'>
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                type='button'
                                                onClick={() => setActiveCategory(category)}
                                                className={`btn btn-outline-secondary text-start text-white ${category === activeCategory ? 'border-2 border-warning text-warning' : ''}`}
                                                style={{
                                                    backgroundColor: category === activeCategory ? '#2a3344' : 'transparent',
                                                    borderColor: category === activeCategory ? '#ccff00' : '#3f4756',
                                                    width: '100%',
                                                    borderRadius: '0.85rem',
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.85rem',
                                                    letterSpacing: '0.04em'
                                                }}
                                            >
                                                {category === 'Sve' && '🎯'}
                                                {category === 'Suplementi' && '💊'}
                                                {category === 'Oprema' && '🏃'}
                                                {category === 'Zdravlje' && '❤️'}
                                                {' '}{category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col md={9} lg={10}>
                            <div className='mb-4'>
                                <div className='hero-kicker mb-2'>🏋️ FITNESS ELITA</div>
                                <h2 className='hero-title mb-3'>PREMIUM SUPLEMENTI I OPREMA</h2>
                                <p className='hero-subtitle mb-4'>
                                    Izaberite vrhunske, testirane suplemente i opremu koji će ubrzati vaš napredak i podići trening na viši nivo.
                                </p>
                            </div>

                            <Row className='gy-4'>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                            <Product product={product} />
                                        </Col>
                                    ))
                                ) : (
                                    <Col xs={12}>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '3rem 1rem',
                                            color: '#94a3b8'
                                        }}>
                                            <p style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                                                Nema dostupnih proizvoda u ovoj kategoriji
                                            </p>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    )
}
export default HomeScreen