import React, { useState, useEffect } from 'react';
import { disasterAPI } from '../services/api';
import DisasterCard from '../components/DisasterCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import CreateDisasterModal from '../components/CreateDisasterModal';

const Dashboard = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await disasterAPI.getAllDisasters();
      setDisasters(response.data || []);
    } catch (err) {
      console.error('Error fetching disasters:', err);
      setError('Failed to load disasters. Please try again later.');
      // For demo purposes, set mock data if API fails
      setDisasters([
        {
          id: 1,
          title: 'Earthquake in California',
          location: 'Los Angeles, CA',
          description: 'A major earthquake struck the Los Angeles area, causing significant damage to infrastructure and buildings. Emergency services are responding to multiple incidents across the city.',
          tags: ['earthquake', 'emergency', 'infrastructure'],
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Wildfire in Oregon',
          location: 'Portland, OR',
          description: 'Fast-moving wildfire threatens residential areas. Evacuation orders have been issued for several neighborhoods.',
          tags: ['wildfire', 'evacuation', 'residential'],
          created_at: '2024-01-14T14:20:00Z'
        },
        {
          id: 3,
          title: 'Hurricane Approaching Florida',
          location: 'Miami, FL',
          description: 'Category 3 hurricane expected to make landfall within 48 hours. Residents advised to prepare for severe weather conditions.',
          tags: ['hurricane', 'weather', 'preparation'],
          created_at: '2024-01-13T08:15:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (disaster) => {
    // Navigate to disaster details page
    console.log('View details for disaster:', disaster.id);
    // In a real app, you would use React Router: navigate(`/disasters/${disaster.id}`)
    alert(`Viewing details for: ${disaster.title}\n\nThis would navigate to /disasters/${disaster.id}`);
  };

  const handleCreateDisaster = async (disasterData) => {
    try {
      const response = await disasterAPI.createDisaster(disasterData);
      setDisasters(prev => [response.data, ...prev]);
    } catch (err) {
      console.error('Error creating disaster:', err);
      // For demo purposes, add to local state
      const newDisaster = {
        id: Date.now(),
        ...disasterData,
        created_at: new Date().toISOString()
      };
      setDisasters(prev => [newDisaster, ...prev]);
    }
  };

  const handleRefresh = () => {
    fetchDisasters();
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark-text mb-2">
              Disaster Dashboard
            </h1>
            <p className="text-dark-text-secondary">
              {loading ? (
                'Loading disasters...'
              ) : (
                `${disasters.length} disaster${disasters.length !== 1 ? 's' : ''} reported`
              )}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-dark-card hover:bg-gray-700 text-dark-text border border-dark-border rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-dark-bg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Disaster
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

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : disasters.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-dark-text mb-2">No disasters reported</h3>
            <p className="text-dark-text-secondary mb-4">
              Get started by creating your first disaster report.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create New Disaster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasters.map((disaster) => (
              <DisasterCard
                key={disaster.id}
                disaster={disaster}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Disaster Modal */}
      <CreateDisasterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateDisaster={handleCreateDisaster}
      />
    </div>
  );
};

export default Dashboard;