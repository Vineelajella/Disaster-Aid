import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DisasterManagement from './pages/DisasterManagement';
import SocialMediaFeed from './pages/SocialMediaFeed';
import ResourcesMap from './pages/ResourcesMap';
import OfficialUpdates from './pages/OfficialUpdates';
import ImageVerification from './pages/ImageVerification';
import Navigation from './components/Navigation';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-dark-bg">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/disasters" element={<DisasterManagement />} />
            <Route path="/social-feed" element={<SocialMediaFeed />} />
            <Route path="/resources" element={<ResourcesMap />} />
            <Route path="/updates" element={<OfficialUpdates />} />
            <Route path="/verify-image" element={<ImageVerification />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;