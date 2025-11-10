import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-white mb-2">🪷 Lotus</h1>
          <p className="text-primary-100">Modern Video Sharing Platform</p>
        </div>
        
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8">
          <Outlet />
        </div>
        
        <p className="text-center text-primary-100 text-sm mt-6">
          © 2025 Lotus. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
