import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import videoService from '../services/videoService';
import VideoCard from '../components/VideoCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['search', query, page],
    queryFn: () => videoService.searchVideos(query, { page, limit: 12 }),
    enabled: !!query,
  });

  if (!query) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Search for videos</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter a search term to find videos
        </p>
      </div>
    );
  }

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
      <h1 className="text-2xl font-display font-bold">
        Search results for "{query}"
      </h1>

      {data?.data?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.data.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No videos found</p>
        </div>
      )}
    </div>
  );
};

export default Search;
