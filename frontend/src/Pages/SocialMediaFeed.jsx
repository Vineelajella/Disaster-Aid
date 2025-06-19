import React, { useState, useEffect } from 'react';
import { socialMediaAPI } from '../services/api';

const SocialMediaFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchSocialMediaPosts();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchSocialMediaPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSocialMediaPosts = async () => {
    try {
      setError(null);
      const response = await socialMediaAPI.getPosts();
      setPosts(response.data || []);
    } catch (err) {
      console.error('Error fetching social media posts:', err);
      setError('Failed to load social media posts.');
      // Mock data for testing
      setPosts([
        {
          id: 1,
          text: 'Urgent: Need medical supplies at downtown shelter. Anyone who can help please contact us. #earthquake #help #medical',
          author: '@emergencyhelper',
          location: 'Los Angeles, CA',
          timestamp: '2024-01-15T10:30:00Z',
          tags: ['need', 'medical', 'help'],
          platform: 'twitter',
          disaster_id: 1
        },
        {
          id: 2,
          text: 'Offering free transportation to evacuation centers. DM me if you need a ride. #wildfire #offer #transport',
          author: '@helpinghand',
          location: 'Portland, OR',
          timestamp: '2024-01-15T09:45:00Z',
          tags: ['offer', 'transport'],
          platform: 'twitter',
          disaster_id: 2
        },
        {
          id: 3,
          text: 'ALERT: Road closure on Highway 101 due to flooding. Seek alternate routes. #alert #flooding #traffic',
          author: '@trafficupdates',
          location: 'San Francisco, CA',
          timestamp: '2024-01-15T08:20:00Z',
          tags: ['alert', 'traffic'],
          platform: 'twitter',
          disaster_id: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter !== 'all' && !post.tags.includes(filter)) return false;
    if (locationFilter && !post.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    return true;
  });

  const getTagColor = (tag) => {
    const colors = {
      'need': 'bg-red-600 text-red-100',
      'help': 'bg-red-600 text-red-100',
      'offer': 'bg-green-600 text-green-100',
      'alert': 'bg-yellow-600 text-yellow-100',
      'emergency': 'bg-red-700 text-red-100',
      'medical': 'bg-purple-600 text-purple-100',
      'transport': 'bg-blue-600 text-blue-100',
      'shelter': 'bg-indigo-600 text-indigo-100',
      'food': 'bg-orange-600 text-orange-100',
      'water': 'bg-cyan-600 text-cyan-100'
    };
    return colors[tag] || 'bg-gray-600 text-gray-100';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-text mb-2">
            Social Media Feed
          </h1>
          <p className="text-dark-text-secondary">
            Real-time disaster-related social media posts
          </p>
        </div>
        
        <button
          onClick={fetchSocialMediaPosts}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Feed
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-card rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-dark-text mb-2">Filter by Tag</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Posts</option>
              <option value="need">Need Help</option>
              <option value="offer">Offering Help</option>
              <option value="alert">Alerts</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-dark-text mb-2">Filter by Location</label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Enter location..."
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-dark-card rounded-lg p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-dark-border rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-border rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-dark-border rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-dark-border rounded mb-2"></div>
              <div className="h-4 bg-dark-border rounded w-3/4 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-dark-border rounded-full w-16"></div>
                <div className="h-6 bg-dark-border rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-xl font-medium text-dark-text mb-2">No posts found</h3>
          <p className="text-dark-text-secondary">
            {filter !== 'all' || locationFilter ? 'Try adjusting your filters.' : 'No social media posts available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-dark-card rounded-lg p-6 border border-dark-border hover:border-gray-600 transition-colors">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {post.platform === 'twitter' ? '🐦' : '📱'}
                  </div>
                  <div>
                    <p className="text-dark-text font-medium">{post.author}</p>
                    <p className="text-dark-text-secondary text-sm">
                      {post.location} • {formatTimestamp(post.timestamp)}
                    </p>
                  </div>
                </div>
                
                {post.disaster_id && (
                  <span className="px-2 py-1 bg-orange-600 text-orange-100 rounded text-xs">
                    Linked to Disaster #{post.disaster_id}
                  </span>
                )}
              </div>

              {/* Post Content */}
              <p className="text-dark-text mb-4 leading-relaxed">
                {post.text}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 bg-dark-card rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-400">{posts.length}</p>
            <p className="text-dark-text-secondary text-sm">Total Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">
              {posts.filter(p => p.tags.some(t => ['need', 'help', 'emergency'].includes(t))).length}
            </p>
            <p className="text-dark-text-secondary text-sm">Help Needed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {posts.filter(p => p.tags.includes('offer')).length}
            </p>
            <p className="text-dark-text-secondary text-sm">Help Offered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {posts.filter(p => p.tags.includes('alert')).length}
            </p>
            <p className="text-dark-text-secondary text-sm">Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFeed;