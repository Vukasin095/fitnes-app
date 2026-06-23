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
        <div className="checkout-steps">
            {steps.map((step, index) => (
                <div key={step.key} className="checkout-step">
                    {step.active ? (
                        <LinkContainer to={step.route}>
                            <div className="checkout-step-box">
                                <FaCheckCircle className="checkout-step-icon" />
                                {step.label}
                            </div>
                        </LinkContainer>
                    ) : (
                        <div className="checkout-step-inactive-box">
                            {step.label}
                        </div>
                    )}

                    {index < steps.length - 1 && (
                        <div className="checkout-step-separator" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default CheckoutSteps;