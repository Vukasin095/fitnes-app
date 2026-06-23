import { Container, Card } from 'react-bootstrap'

const FormContainer = ({ children }) => {
    return (
        <Container className="form-container-shell">
            <Card className='border-0 w-100 form-card'>
                {children}
            </Card>
        </Container>
    )
}

export default FormContainer;
