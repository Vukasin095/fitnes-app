import { LinkContainer } from "react-router-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const steps = [
        { key: 1, active: step1, label: "Prijava", route: "/login" },
        { key: 2, active: step2, label: "Podaci o dostavi", route: "/shipping" },
        { key: 3, active: step3, label: "Plaćanje", route: "/payment" },
        { key: 4, active: step4, label: "Pregled porudžbine", route: "/complete" }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
        }}>
            {steps.map((step, index) => (
                <div key={step.key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {step.active ? (
                        <LinkContainer to={step.route}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 1.2rem',
                                background: 'rgba(204, 255, 0, 0.1)',
                                border: '1px solid #ccff00',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                color: '#ccff00',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(204, 255, 0, 0.2)';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(204, 255, 0, 0.3)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <FaCheckCircle style={{ fontSize: '1rem' }} />
                                {step.label}
                            </div>
                        </LinkContainer>
                    ) : (
                        <div style={{
                            padding: '0.6rem 1.2rem',
                            background: '#1c1f2a',
                            border: '1px solid #2e3545',
                            borderRadius: '20px',
                            color: '#64748b',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            opacity: 0.6
                        }}>
                            {step.label}
                        </div>
                    )}

                    {index < steps.length - 1 && (
                        <div style={{
                            width: '40px',
                            height: '2px',
                            background: step.active ? '#ccff00' : '#2e3545',
                            opacity: 0.5
                        }} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default CheckoutSteps;