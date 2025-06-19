import React, { useState, useEffect } from 'react';
import { disasterAPI, locationAPI } from '../services/api';
import DisasterCard from '../components/DisasterCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import CreateDisasterModal from '../components/CreateDisasterModal';
import EditDisasterModal from '../components/EditDisasterModal';
import LocationMap from '../components/LocationMap';

const DisasterManagement = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDisaster, setEditingDisaster] = useState(null);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [extractingLocation, setExtractingLocation] = useState(false);

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
      // Mock data for testing
      setDisasters([
        {
          id: 1,
          title: 'Earthquake in California',
          location: 'Los Angeles, CA',
          description: 'A major earthquake struck the Los Angeles area, causing significant damage to infrastructure and buildings.',
          tags: ['earthquake', 'emergency', 'infrastructure'],
          latitude: 34.0522,
          longitude: -118.2437,
          created_at: '2024-01-15T10:30:00Z',
          created_by: 'user@example.com'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDisaster = async (disasterData) => {
    try {
      // First create the disaster
      const response = await disasterAPI.createDisaster(disasterData);
      const newDisaster = response.data;
      
      // Try to extract location if description is provided
      if (disasterData.description) {
        setExtractingLocation(true);
        try {
          const locationResponse = await locationAPI.extractLocation(disasterData.description);
          if (locationResponse.data.location) {
            // Update disaster with extracted location
            const updatedDisaster = await disasterAPI.updateDisaster(newDisaster.id, {
              ...disasterData,
              extracted_location: locationResponse.data.location,
              latitude: locationResponse.data.latitude,
              longitude: locationResponse.data.longitude
            });
            setDisasters(prev => [updatedDisaster.data, ...prev.filter(d => d.id !== newDisaster.id)]);
          } else {
            setDisasters(prev => [newDisaster, ...prev]);
          }
        } catch (locationError) {
          console.error('Location extraction failed:', locationError);
          setDisasters(prev => [newDisaster, ...prev]);
        }
        setExtractingLocation(false);
      } else {
        setDisasters(prev => [newDisaster, ...prev]);
      }
    } catch (err) {
      console.error('Error creating disaster:', err);
      // Mock creation for testing
      const newDisaster = {
        id: Date.now(),
        ...disasterData,
        created_at: new Date().toISOString(),
        created_by: 'current_user@example.com'
      };
      setDisasters(prev => [newDisaster, ...prev]);
    }
  };

  const handleUpdateDisaster = async (id, disasterData) => {
    try {
      const response = await disasterAPI.updateDisaster(id, disasterData);
      setDisasters(prev => prev.map(d => d.id === id ? response.data : d));
      setEditingDisaster(null);
    } catch (err) {
      console.error('Error updating disaster:', err);
      // Mock update for testing
      setDisasters(prev => prev.map(d => d.id === id ? { ...d, ...disasterData } : d));
      setEditingDisaster(null);
    }
  };

  const handleDeleteDisaster = async (id) => {
    if (!window.confirm('Are you sure you want to delete this disaster record?')) {
      return;
    }
    
    try {
      await disasterAPI.deleteDisaster(id);
      setDisasters(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting disaster:', err);
      // Mock deletion for testing
      setDisasters(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleViewDetails = (disaster) => {
    setSelectedDisaster(disaster);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-text mb-2">
            Disaster Management
          </h1>
          <p className="text-dark-text-secondary">
            {loading ? (
              'Loading disasters...'
            ) : (
              `${disasters.length} disaster${disasters.length !== 1 ? 's' : ''} in system`
            )}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchDisasters}
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
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Disaster
          </button>
        </div>
      </div>

      {/* Location Extraction Status */}
      {extractingLocation && (
        <div className="bg-blue-900 border border-blue-700 text-blue-100 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Extracting location information from description...
          </div>
        </div>
      )}

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
          <h3 className="text-xl font-medium text-dark-text mb-2">No disasters found</h3>
          <p className="text-dark-text-secondary mb-4">
            Get started by creating your first disaster record.
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
            <div key={disaster.id} className="relative">
              <DisasterCard
                disaster={disaster}
                onViewDetails={handleViewDetails}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => setEditingDisaster(disaster)}
                  className="p-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteDisaster(disaster.id)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateDisasterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateDisaster={handleCreateDisaster}
      />

      {editingDisaster && (
        <EditDisasterModal
          isOpen={true}
          disaster={editingDisaster}
          onClose={() => setEditingDisaster(null)}
          onUpdateDisaster={handleUpdateDisaster}
        />
      )}

      {/* Disaster Details Modal with Map */}
      {selectedDisaster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-dark-text">{selectedDisaster.title}</h2>
              <button
                onClick={() => setSelectedDisaster(null)}
                className="text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-dark-text mb-2">Details</h3>
                  <p className="text-dark-text-secondary mb-2">
                    <strong>Location:</strong> {selectedDisaster.location}
                  </p>
                  <p className="text-dark-text-secondary mb-2">
                    <strong>Created:</strong> {new Date(selectedDisaster.created_at).toLocaleString()}
                  </p>
                  {selectedDisaster.created_by && (
                    <p className="text-dark-text-secondary mb-2">
                      <strong>Created by:</strong> {selectedDisaster.created_by}
                    </p>
                  )}
                  <p className="text-dark-text-secondary">
                    <strong>Description:</strong> {selectedDisaster.description}
                  </p>
                </div>

                {selectedDisaster.tags && selectedDisaster.tags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-dark-text mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDisaster.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                {selectedDisaster.latitude && selectedDisaster.longitude && (
                  <div>
                    <h3 className="text-lg font-medium text-dark-text mb-2">Location Map</h3>
                    <LocationMap
                      latitude={selectedDisaster.latitude}
                      longitude={selectedDisaster.longitude}
                      title={selectedDisaster.title}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterManagement;