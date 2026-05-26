import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant = 'info', children }) => {
  const getStyle = () => {
    if (variant === 'danger') return { backgroundColor: '#fff3f3', color: '#ff4a4a', borderLeft: '5px solid #ff4a4a', border: 'none' };
    if (variant === 'success') return { backgroundColor: '#f3fff5', color: '#28a745', borderLeft: '5px solid #28a745', border: 'none' };
    return { backgroundColor: '#f8f9fa', color: '#333', borderLeft: '5px solid #333', border: 'none' };
  };

  return (
    <Alert variant={variant} className='shadow-sm fw-bold rounded-0 my-3' style={getStyle()}>
      {children}
    </Alert>
  );
};

export default Message;