import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toggleDarkMode } from '../store/slices/themeSlice';
import { FiSearch, FiMenu, FiMoon, FiSun, FiUpload, FiUser, FiLogOut, FiBell } from 'react-icons/fi';
import { useState } from 'react';
import { getInitials, getAssetUrl } from '../utils/helpers';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🪷</span>
            <span className="font-display font-bold text-xl hidden sm:block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Lotus
            </span>
          </Link>
        </div>

        {/* Center - Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-4 pr-12 py-2 border border-gray-300 dark:border-dark-600 rounded-full bg-gray-50 dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-full transition"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Upload button */}
              <Link
                to="/upload"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                <FiUpload className="w-4 h-4" />
                <span>Upload</span>
              </Link>

              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition relative">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={getAssetUrl(user.avatar, 'avatar')}
                        alt={user?.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(user?.fullName || user?.username)
                    )}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 transition"
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to={`/channel/${user?._id}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 transition"
                    >
                      <span>📺</span>
                      <span>My Channel</span>
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-dark-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 transition text-red-600"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <FiUser className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
