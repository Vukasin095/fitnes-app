import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    return userInfo && userInfo.isAdmin ? (
        <div className='admin-route-shell'>
            <Outlet />
        </div>
    ) : (
        <Navigate to='/login' replace />
    );
};

export default AdminRoute;
