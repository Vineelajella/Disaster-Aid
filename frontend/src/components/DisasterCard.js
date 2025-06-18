import React from 'react';

const DisasterCard = ({ disaster, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getTagColor = (index) => {
    const colors = [
      'bg-blue-600 text-blue-100',
      'bg-green-600 text-green-100',
      'bg-yellow-600 text-yellow-100',
      'bg-red-600 text-red-100',
      'bg-purple-600 text-purple-100',
      'bg-indigo-600 text-indigo-100'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-dark-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-dark-border">
      <div className="flex flex-col h-full">
        {/* Title */}
        <h3 className="text-xl font-semibold text-dark-text mb-2 line-clamp-2">
          {disaster.title || 'Untitled Disaster'}
        </h3>

        {/* Location */}
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 text-dark-text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-dark-text-secondary text-sm">
            {disaster.location || 'Location not specified'}
          </span>
        </div>

        {/* Description */}
        <p className="text-dark-text text-sm mb-4 flex-grow">
          {truncateDescription(disaster.description)}
        </p>

        {/* Tags */}
        {disaster.tags && disaster.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {disaster.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(index)}`}
              >
                {tag}
              </span>
            ))}
            {disaster.tags.length > 3 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-100">
                +{disaster.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Created At */}
        <div className="flex items-center mb-4">
          <svg className="w-4 h-4 text-dark-text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-dark-text-secondary text-xs">
            {disaster.created_at ? formatDate(disaster.created_at) : 'Date not available'}
          </span>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(disaster)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-dark-card"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DisasterCard;