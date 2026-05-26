import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-0 border-0 rounded shadow-sm w-100 d-flex flex-column' style={{ 
      overflow: 'hidden', 
      backgroundColor: '#1e1e1e', 
      minHeight: '420px', // Fiksira visinu cele kartice
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    }}>
      <Link to={`/product/${product._id}`}>
        <Card.Img 
          src={product.image} 
          variant='top' 
          style={{ height: '200px', objectFit: 'cover', filter: 'brightness(0.85)' }} 
        />
      </Link>

      <Card.Body className='d-flex flex-column p-3 text-white flex-grow-1'>
        <span className='text-uppercase small fw-bold mb-1' style={{ color: '#ff4a4a', fontSize: '0.75rem' }}>
          {product.category}
        </span>
        
        <Link to={`/product/${product._id}`} className='text-decoration-none text-white mb-2'>
          <Card.Title as='div' className='mb-0' style={{ 
            height: '48px', 
            overflow: 'hidden', 
            fontSize: '1.05rem', 
            fontWeight: '700',
            lineHeight: '1.3'
          }}>
            {product.name}
          </Card.Title>
        </Link>

        <Card.Text as='div' className='mb-3 small'>
          <Rating value={product.rating} text={`${product.numReviews}`} />
        </Card.Text>

        <div className='mt-auto d-flex justify-content-between align-items-center pt-2' style={{ borderTop: '1px solid #333' }}>
          <span className='text-muted small'>{product.brand}</span>
          <span className='fs-5 fw-bold' style={{ color: '#ff4a4a' }}>
            {product.price.toLocaleString('sr-RS')} <span style={{ fontSize: '0.75rem' }}>RSD</span>
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;