import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    const wrapperStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1e222b 0%, #191f27 100%)',
        color: '#f8fafc',
        paddingTop: '140px'
    };

    return userInfo ? (
        <div style={wrapperStyle}>
            <Outlet />
        </div>
    ) : (
        <Navigate to='/login' replace />
    );
};

export default PrivateRoute;
