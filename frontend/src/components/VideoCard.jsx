import { Link } from 'react-router-dom';
import { formatDuration, formatViewCount, getTimeAgo, getAssetUrl, getInitials } from '../utils/helpers';
import { FiPlay } from 'react-icons/fi';

const VideoCard = ({ video }) => {
  const thumbnailUrl = getAssetUrl(video.thumbnail, 'thumbnail');
  const avatarUrl = getAssetUrl(video.owner?.avatar, 'avatar');

  return (
    <Link
      to={`/video/${video._id}`}
      className="video-card group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 dark:bg-dark-700 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/default-thumbnail.jpg';
          }}
        />
        
        {/* Duration */}
        {video.duration > 0 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded">
            {formatDuration(video.duration)}
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <FiPlay className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Video info */}
      <div className="p-3">
        <div className="flex gap-3">
          {/* Channel avatar */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
              {video.owner?.avatar ? (
                <img
                  src={avatarUrl}
                  alt={video.owner?.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = getInitials(
                      video.owner?.fullName || video.owner?.username
                    );
                  }}
                />
              ) : (
                getInitials(video.owner?.fullName || video.owner?.username)
              )}
            </div>
          </div>

          {/* Title and metadata */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
              {video.title}
            </h3>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {video.owner?.channelName || video.owner?.fullName}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <span>{formatViewCount(video.views)}</span>
              <span>•</span>
              <span>{getTimeAgo(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
