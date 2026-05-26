import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className='d-flex justify-content-center align-items-center my-5' style={{ width: '100%' }}>
      <Spinner
        animation='border'
        role='status'
        style={{
          width: '60px',
          height: '60px',
          margin: 'auto',
          display: 'block',
          color: '#ff4a4a',
          borderWidth: '4px'
        }}
      />
    </div>
  );
};

export default Loader;