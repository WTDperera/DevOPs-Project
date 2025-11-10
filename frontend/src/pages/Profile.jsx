import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-6">My Profile</h1>
      
      <div className="card p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Full Name
            </label>
            <p className="text-lg">{user?.fullName}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Username
            </label>
            <p className="text-lg">@{user?.username}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Email
            </label>
            <p className="text-lg">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
