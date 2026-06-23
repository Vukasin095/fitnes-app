import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    return userInfo ? (
        <div className='private-route-shell'>
            <Outlet />
        </div>
    ) : (
        <Navigate to='/login' replace />
    );
};

export default PrivateRoute;
