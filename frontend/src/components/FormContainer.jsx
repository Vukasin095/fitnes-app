import { Container, Card } from 'react-bootstrap'

const FormContainer = ({ children }) => {
    return (
        <Container style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 140px)',
            paddingTop: '2rem',
            paddingBottom: '2rem'
        }}>
            <Card className='border-0 w-100' style={{
                maxWidth: '520px',
                background: 'linear-gradient(135deg, #2b303d, #252b36)',
                padding: '2.5rem',
                borderRadius: '24px',
                boxShadow: '0 22px 70px rgba(0, 0, 0, 0.22)',
                border: '1px solid #3f4756'
            }}>
                {children}
            </Card>
        </Container>
    )
}

export default FormContainer;
