import { Spinner } from "react-bootstrap";

const Loader = () => {
    return (
        <div className="loader-center">
            <Spinner
                animation="border"
                role="status"
                className="loader-spinner"
            >
                <span className="visually-hidden">Učitavanje...</span>
            </Spinner>
        </div>
    );
};

export default Loader;
