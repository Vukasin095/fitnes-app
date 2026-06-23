import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
    return (
        <Alert 
            variant={variant} 
            className='border-0 message-box'
        >
            {children}
        </Alert>
    );
};

Message.defaultProps = {
    variant: 'info',
};

export default Message;