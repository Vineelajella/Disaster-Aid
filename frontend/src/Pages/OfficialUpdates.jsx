import React, { useState, useEffect } from 'react';
import { updatesAPI } from '../services/api';

const OfficialUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    fetchUpdates();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchUpdates, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchUpdates = async () => {
    try {
      setError(null);
      const response = await updatesAPI.getOfficialUpdates();
      setUpdates(response.data || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching official updates:', err);
      setError('Failed to load official updates.');
      // Mock data for testing
      setUpdates([
        {
          id: 1,
          title: 'FEMA Declares Major Disaster for California Earthquake',
          snippet: 'Federal Emergency Management Agency has declared a major disaster for the recent earthquake in Southern California, making federal funding available to affected individuals and communities.',
          source: 'FEMA',
          source_url: 'https://www.fema.gov',
          link: 'https://www.fema.gov/disaster/4683',
          published_at: '2024-01-15T14:30:00Z',
          category: 'federal',
          disaster_type: 'earthquake'
        },
        {
          id: 2,
          title: 'Red Cross Opens Additional Shelters in Wildfire Areas',
          snippet: 'The American Red Cross has opened three additional emergency shelters in Oregon to accommodate evacuees from the ongoing wildfire. Shelters are providing food, water, and temporary housing.',
          source: 'American Red Cross',
          source_url: 'https://www.redcross.org',
          link: 'https://www.redcross.org/about-us/news-and-events/press-release/2024/wildfire-shelters-oregon',
          published_at: '2024-01-15T12:15:00Z',
          category: 'humanitarian',
          disaster_type: 'wildfire'
        },
        {
          id: 3,
          title: 'Hurricane Warning Extended for Florida Coast',
          snippet: 'The National Hurricane Center has extended hurricane warnings along the Florida coast as Hurricane approaches. Residents in evacuation zones are urged to complete preparations immediately.',
          source: 'National Hurricane Center',
          source_url: 'https://www.nhc.noaa.gov',
          link: 'https://www.nhc.noaa.gov/text/refresh/MIATCPAT1+shtml/151800.shtml',
          published_at: '2024-01-15T11:00:00Z',
          category: 'weather',
          disaster_type: 'hurricane'
        },
        {
          id: 4,
          title: 'CDC Issues Health Advisory for Disaster Areas',
          snippet: 'The Centers for Disease Control and Prevention has issued a health advisory for areas affected by recent disasters, providing guidance on water safety, food handling, and disease prevention.',
          source: 'CDC',
          source_url: 'https://www.cdc.gov',
          link: 'https://www.cdc.gov/disasters/health-advisory-2024-01-15',
          published_at: '2024-01-15T09:45:00Z',
          category: 'health',
          disaster_type: 'general'
        }
      ]);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  };

  const filteredUpdates = updates.filter(update => {
    if (filter === 'all') return true;
    return update.category === filter || update.disaster_type === filter;
  });

  const getCategoryColor = (category) => {
    const colors = {
      federal: 'bg-blue-600 text-blue-100',
      weather: 'bg-yellow-600 text-yellow-100',
      humanitarian: 'bg-green-600 text-green-100',
      health: 'bg-purple-600 text-purple-100',
      local: 'bg-indigo-600 text-indigo-100',
      emergency: 'bg-red-600 text-red-100'
    };
    return colors[category] || 'bg-gray-600 text-gray-100';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceIcon = (source) => {
    const icons = {
      'FEMA': '🏛️',
      'American Red Cross': '🔴',
      'National Hurricane Center': '🌀',
      'CDC': '🏥',
      'USGS': '🌍',
      'National Weather Service': '⛈️'
    };
    return icons[source] || '📰';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-text mb-2">
            Official Updates
          </h1>
          <p className="text-dark-text-secondary">
            Latest updates from government agencies and official sources
          </p>
          {lastRefresh && (
            <p className="text-dark-text-secondary text-sm mt-1">
              Last updated: {formatTimestamp(lastRefresh)}
            </p>
          )}
        </div>
        
        <button
          onClick={fetchUpdates}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Updates
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-card rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-dark-bg text-dark-text hover:bg-gray-700'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setFilter('federal')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'federal'
                ? 'bg-blue-600 text-white'
                : 'bg-dark-bg text-dark-text hover:bg-gray-700'
            }`}
          >
            Federal
          </button>
          <button
            onClick={() => setFilter('weather')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'weather'
                ? 'bg-blue-600 text-white'
                : 'bg-dark-bg text-dark-text hover:bg-gray-700'
            }`}
          >
            Weather
          </button>
          <button
            onClick={() => setFilter('humanitarian')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'humanitarian'
                ? 'bg-blue-600 text-white'
                : 'bg-dark-bg text-dark-text hover:bg-gray-700'
            }`}
          >
            Humanitarian
          </button>
          <button
            onClick={() => setFilter('health')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'health'
                ? 'bg-blue-600 text-white'
                : 'bg-dark-bg text-dark-text hover:bg-gray-700'
            }`}
          >
            Health
          </button>
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

      {/* Updates */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-dark-card rounded-lg p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-dark-border rounded mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-border rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-dark-border rounded w-1/6"></div>
                </div>
                <div className="h-6 bg-dark-border rounded-full w-20"></div>
              </div>
              <div className="h-6 bg-dark-border rounded mb-3"></div>
              <div className="h-4 bg-dark-border rounded mb-2"></div>
              <div className="h-4 bg-dark-border rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : filteredUpdates.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-medium text-dark-text mb-2">No updates found</h3>
          <p className="text-dark-text-secondary">
            {filter !== 'all' ? 'Try selecting a different filter.' : 'No official updates available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <div key={update.id} className="bg-dark-card rounded-lg p-6 border border-dark-border hover:border-gray-600 transition-colors">
              {/* Update Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getSourceIcon(update.source)}</span>
                  <div>
                    <p className="text-dark-text font-medium">{update.source}</p>
                    <p className="text-dark-text-secondary text-sm">
                      {formatTimestamp(update.published_at)}
                    </p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(update.category)}`}>
                  {update.category}
                </span>
              </div>

              {/* Update Content */}
              <h3 className="text-xl font-semibold text-dark-text mb-3 leading-tight">
                {update.title}
              </h3>
              
              <p className="text-dark-text-secondary mb-4 leading-relaxed">
                {update.snippet}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <a
                    href={update.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Read Full Update
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  <a
                    href={update.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-text-secondary hover:text-dark-text transition-colors text-sm"
                  >
                    Visit {update.source}
                  </a>
                </div>

                {update.disaster_type && update.disaster_type !== 'general' && (
                  <span className="px-2 py-1 bg-gray-600 text-gray-100 rounded text-xs">
                    {update.disaster_type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 bg-dark-card rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-400">{updates.length}</p>
            <p className="text-dark-text-secondary text-sm">Total Updates</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {updates.filter(u => u.category === 'federal').length}
            </p>
            <p className="text-dark-text-secondary text-sm">Federal</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {updates.filter(u => u.category === 'weather').length}
            </p>
            <p className="text-dark-text-secondary text-sm">Weather</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">
              {updates.filter(u => u.category === 'health').length}
            </p>
            <p className="text-dark-text-secondary text-sm">Health</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialUpdates;