import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiClock, FiThumbsUp, FiFolder, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: FiTrendingUp, label: 'Trending', path: '/trending' },
  ];

  const authenticatedItems = [
    { icon: FiClock, label: 'History', path: '/history' },
    { icon: FiThumbsUp, label: 'Liked Videos', path: '/liked' },
    { icon: FiFolder, label: 'Library', path: '/library' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 overflow-y-auto scrollbar-thin transition-transform duration-300',
          {
            'translate-x-0': isOpen,
            '-translate-x-full lg:translate-x-0': !isOpen,
          }
        )}
      >
        <div className="p-4">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Main menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-4 px-4 py-3 rounded-lg transition-colors',
                  {
                    'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400':
                      isActive(item.path),
                    'hover:bg-gray-100 dark:hover:bg-dark-700': !isActive(item.path),
                  }
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Authenticated menu */}
          {isAuthenticated && (
            <>
              <hr className="my-4 border-gray-200 dark:border-dark-700" />
              <nav className="space-y-1">
                {authenticatedItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={clsx(
                      'flex items-center gap-4 px-4 py-3 rounded-lg transition-colors',
                      {
                        'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400':
                          isActive(item.path),
                        'hover:bg-gray-100 dark:hover:bg-dark-700': !isActive(item.path),
                      }
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-dark-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
              © 2025 Lotus Platform
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 px-4 mt-1">
              Built with ❤️ using MERN Stack
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
