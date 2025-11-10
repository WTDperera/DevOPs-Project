import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import videoService from '../services/videoService';
import VideoCard from '../components/VideoCard';
import { SORT_OPTIONS } from '../constants';

const Home = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-createdAt');

  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', page, sort],
    queryFn: () => videoService.getAllVideos({ page, sort, limit: 12 }),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-video bg-gray-300 dark:bg-dark-700"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-dark-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Failed to load videos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Discover Videos</h1>
        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input w-auto"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Video Grid */}
      {data?.data?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.data.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!data.pagination.hasPreviousPage}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {data.pagination.totalPages}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={!data.pagination.hasNextPage}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No videos found</p>
        </div>
      )}
    </div>
  );
};

export default Home;
