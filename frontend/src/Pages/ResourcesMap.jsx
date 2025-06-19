import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import LocationMap from '../components/LocationMap';

const ResourcesMap = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedResource, setSelectedResource] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco

  const fetchNearbyResources = async () => {
    if (!searchLocation.trim()) {
      setError('Please enter a location to search for resources.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await resourceAPI.getNearbyResources({
        location: searchLocation,
        radius: searchRadius
      });
      
      setResources(response.data || []);
      
      // Update map center if we have results
      if (response.data && response.data.length > 0) {
        const firstResource = response.data[0];
        if (firstResource.latitude && firstResource.longitude) {
          setMapCenter({
            lat: firstResource.latitude,
            lng: firstResource.longitude
          });
        }
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again.');
      // Mock data for testing
      setResources([
        {
          id: 1,
          name: 'Downtown Emergency Shelter',
          type: 'shelter',
          address: '123 Main St, Los Angeles, CA',
          latitude: 34.0522,
          longitude: -118.2437,
          capacity: 200,
          current_occupancy: 150,
          contact_phone: '(555) 123-4567',
          services: ['food', 'medical', 'clothing'],
          distance: 2.5
        },
        {
          id: 2,
          name: 'Red Cross Medical Station',
          type: 'medical',
          address: '456 Oak Ave, Los Angeles, CA',
          latitude: 34.0622,
          longitude: -118.2537,
          capacity: 50,
          current_occupancy: 30,
          contact_phone: '(555) 987-6543',
          services: ['medical', 'first_aid', 'pharmacy'],
          distance: 3.2
        },
        {
          id: 3,
          name: 'Community Food Bank',
          type: 'food',
          address: '789 Pine St, Los Angeles, CA',
          latitude: 34.0422,
          longitude: -118.2337,
          capacity: 100,
          current_occupancy: 75,
          contact_phone: '(555) 456-7890',
          services: ['food', 'water', 'supplies'],
          distance: 1.8
        }
      ]);
      setMapCenter({ lat: 34.0522, lng: -118.2437 });
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type) => {
    const icons = {
      shelter: '🏠',
      medical: '🏥',
      food: '🍽️',
      water: '💧',
      supplies: '📦',
      transport: '🚐'
    };
    return icons[type] || '📍';
  };

  const getResourceColor = (type) => {
    const colors = {
      shelter: 'bg-blue-600 text-blue-100',
      medical: 'bg-red-600 text-red-100',
      food: 'bg-green-600 text-green-100',
      water: 'bg-cyan-600 text-cyan-100',
      supplies: 'bg-purple-600 text-purple-100',
      transport: 'bg-yellow-600 text-yellow-100'
    };
    return colors[type] || 'bg-gray-600 text-gray-100';
  };

  const getOccupancyStatus = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return { color: 'text-red-400', status: 'Full' };
    if (percentage >= 70) return { color: 'text-yellow-400', status: 'High' };
    return { color: 'text-green-400', status: 'Available' };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">
          Nearby Resources
        </h1>
        <p className="text-dark-text-secondary">
          Find shelters, medical facilities, and other resources near disaster areas
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-dark-card rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-text mb-2">
              Location or Address
            </label>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Enter city, address, or coordinates..."
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && fetchNearbyResources()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Search Radius (km)
            </label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={fetchNearbyResources}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
          >
            {loading ? 'Searching...' : 'Search Resources'}
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

      {/* Results */}
      {resources.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resources List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark-text mb-4">
              Found {resources.length} resource{resources.length !== 1 ? 's' : ''}
            </h2>
            
            {resources.map((resource) => {
              const occupancyStatus = getOccupancyStatus(resource.current_occupancy, resource.capacity);
              
              return (
                <div
                  key={resource.id}
                  className={`bg-dark-card rounded-lg p-4 border transition-colors cursor-pointer ${
                    selectedResource?.id === resource.id
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-dark-border hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getResourceIcon(resource.type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-dark-text">{resource.name}</h3>
                        <p className="text-dark-text-secondary text-sm">{resource.address}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getResourceColor(resource.type)}`}>
                        {resource.type}
                      </span>
                      <p className="text-dark-text-secondary text-sm mt-1">
                        {resource.distance} km away
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-dark-text-secondary text-sm">Capacity</p>
                      <p className="text-dark-text">
                        {resource.current_occupancy}/{resource.capacity}
                        <span className={`ml-2 text-sm ${occupancyStatus.color}`}>
                          ({occupancyStatus.status})
                        </span>
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-dark-text-secondary text-sm">Contact</p>
                      <p className="text-dark-text">{resource.contact_phone}</p>
                    </div>
                  </div>

                  {resource.services && resource.services.length > 0 && (
                    <div>
                      <p className="text-dark-text-secondary text-sm mb-2">Services</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.services.map((service, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-600 text-gray-100 rounded text-xs"
                          >
                            {service.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map */}
          <div className="sticky top-20">
            <h2 className="text-xl font-semibold text-dark-text mb-4">Location Map</h2>
            <LocationMap
              latitude={selectedResource?.latitude || mapCenter.lat}
              longitude={selectedResource?.longitude || mapCenter.lng}
              title={selectedResource?.name || 'Search Area'}
              height="500px"
            />
            
            {selectedResource && (
              <div className="mt-4 bg-dark-card rounded-lg p-4">
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  {selectedResource.name}
                </h3>
                <p className="text-dark-text-secondary text-sm mb-2">
                  {selectedResource.address}
                </p>
                <p className="text-dark-text text-sm">
                  Click on the map marker for more details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && resources.length === 0 && searchLocation && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-xl font-medium text-dark-text mb-2">No resources found</h3>
          <p className="text-dark-text-secondary">
            Try searching in a different location or increasing the search radius.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourcesMap;