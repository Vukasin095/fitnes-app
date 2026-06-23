import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
    return (
        <Alert 
            variant={variant} 
            className='border-0'
            style={{
                borderRadius: '16px',
                padding: '1.5rem',
                fontWeight: 500,
                letterSpacing: '0.01em'
            }}
        >
            {children}
        </Alert>
    );
};

Message.defaultProps = {
    variant: 'info',
};

export default Message;