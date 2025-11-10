import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import videoService from '../services/videoService';

const VideoPlayer = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['video', id],
    queryFn: () => videoService.getVideoById(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="aspect-video bg-gray-300 dark:bg-dark-700 rounded-lg animate-pulse"></div>
        <div className="mt-4 space-y-3">
          <div className="h-8 bg-gray-300 dark:bg-dark-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Video not found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          The video you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const video = data.data.video;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-full"
          src={`http://localhost:5000/uploads/videos/${video.videoFile}`}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Info */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
          {video.description}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
