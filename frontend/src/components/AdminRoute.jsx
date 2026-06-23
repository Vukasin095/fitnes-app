import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    const wrapperStyle = {
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, rgba(204,255,0,0.14), transparent 28%), linear-gradient(180deg, #1f252f 0%, #171c23 100%)',
        color: '#eef2ff',
        paddingTop: '140px'
    };

    return userInfo && userInfo.isAdmin ? (
        <div style={wrapperStyle}>
            <Outlet />
        </div>
    ) : (
        <Navigate to='/login' replace />
    );
};

export default AdminRoute;
