import { useQuery } from '@tanstack/react-query';
import videoService from '../services/videoService';
import VideoCard from '../components/VideoCard';
import { FiTrendingUp } from 'react-icons/fi';

const Trending = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => videoService.getTrending(20),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-video bg-gray-300 dark:bg-dark-700"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FiTrendingUp className="w-8 h-8 text-primary-600" />
        <h1 className="text-2xl font-display font-bold">Trending Videos</h1>
      </div>

      {data?.data?.videos?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.data.videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No trending videos</p>
        </div>
      )}
    </div>
  );
};

export default Trending;
