import { Spinner } from "react-bootstrap";

const Loader = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px'
        }}>
            <Spinner
                animation="border"
                role="status"
                style={{
                    width: "100px",
                    height: "100px",
                    color: '#ccff00',
                    borderWidth: '4px'
                }}
            >
                <span className="visually-hidden">Učitavanje...</span>
            </Spinner>
        </div>
    );
};

export default Loader;
