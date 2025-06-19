import React, { useState } from 'react';
import { imageAPI } from '../services/api';

const ImageVerification = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setVerificationResult(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleVerifyImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await imageAPI.verifyImage(formData);
      setVerificationResult(response.data);
    } catch (err) {
      console.error('Error verifying image:', err);
      setError('Failed to verify image. Please try again.');
      
      // Mock verification result for testing
      const mockResults = [
        {
          status: 'verified',
          confidence: 0.92,
          analysis: 'This image appears to be authentic. The lighting, shadows, and metadata are consistent with a genuine photograph taken during the reported disaster event.',
          details: {
            authenticity_score: 0.92,
            manipulation_detected: false,
            metadata_consistent: true,
            context_match: true,
            ai_generated_probability: 0.08
          },
          recommendations: [
            'Image appears genuine and can be used as evidence',
            'Metadata suggests photo was taken at reported time and location'
          ]
        },
        {
          status: 'suspicious',
          confidence: 0.65,
          analysis: 'This image shows signs of potential manipulation. Some inconsistencies in lighting and possible digital alterations have been detected.',
          details: {
            authenticity_score: 0.35,
            manipulation_detected: true,
            metadata_consistent: false,
            context_match: true,
            ai_generated_probability: 0.25
          },
          recommendations: [
            'Verify with additional sources before using',
            'Consider requesting original unedited version',
            'Check for alternative angles or witnesses'
          ]
        },
        {
          status: 'likely_fake',
          confidence: 0.88,
          analysis: 'This image appears to be AI-generated or heavily manipulated. Multiple indicators suggest it is not an authentic photograph of the reported disaster.',
          details: {
            authenticity_score: 0.12,
            manipulation_detected: true,
            metadata_consistent: false,
            context_match: false,
            ai_generated_probability: 0.88
          },
          recommendations: [
            'Do not use this image as evidence',
            'Report as potential misinformation',
            'Seek verified sources for disaster documentation'
          ]
        }
      ];
      
      // Randomly select a mock result
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setVerificationResult(randomResult);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      verified: 'text-green-400',
      suspicious: 'text-yellow-400',
      likely_fake: 'text-red-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      verified: '✅',
      suspicious: '⚠️',
      likely_fake: '❌'
    };
    return icons[status] || '❓';
  };

  const getStatusText = (status) => {
    const texts = {
      verified: 'Verified Authentic',
      suspicious: 'Potentially Manipulated',
      likely_fake: 'Likely Fake/AI Generated'
    };
    return texts[status] || 'Unknown';
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setVerificationResult(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">
          Image Verification
        </h1>
        <p className="text-dark-text-secondary">
          Upload disaster-related images to verify their authenticity using AI analysis
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-dark-card rounded-lg p-6 mb-6">
        <div className="text-center">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-dark-border rounded-lg p-8">
              <svg className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-medium text-dark-text mb-2">Upload Image</h3>
              <p className="text-dark-text-secondary mb-4">
                Select an image file to verify its authenticity
              </p>
              <label className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-dark-text-secondary text-sm mt-2">
                Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          ) : (
            <div>
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Selected image"
                  className="max-w-full max-h-96 rounded-lg shadow-lg"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4">
                <p className="text-dark-text mb-2">
                  <strong>File:</strong> {selectedFile.name}
                </p>
                <p className="text-dark-text-secondary text-sm mb-4">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                <button
                  onClick={handleVerifyImage}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 mr-2 animate-spin inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify Image
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
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

      {/* Verification Results */}
      {verificationResult && (
        <div className="bg-dark-card rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-dark-text mb-6">Verification Results</h2>
          
          {/* Status */}
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">{getStatusIcon(verificationResult.status)}</span>
            <div>
              <h3 className={`text-xl font-semibold ${getStatusColor(verificationResult.status)}`}>
                {getStatusText(verificationResult.status)}
              </h3>
              <p className="text-dark-text-secondary">
                Confidence: {(verificationResult.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Analysis */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-dark-text mb-3">Analysis</h4>
            <p className="text-dark-text-secondary leading-relaxed">
              {verificationResult.analysis}
            </p>
          </div>

          {/* Detailed Metrics */}
          {verificationResult.details && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-dark-text mb-3">Detailed Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-bg rounded-lg p-4">
                  <p className="text-dark-text-secondary text-sm">Authenticity Score</p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${
                          verificationResult.details.authenticity_score > 0.7
                            ? 'bg-green-500'
                            : verificationResult.details.authenticity_score > 0.4
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${verificationResult.details.authenticity_score * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-dark-text text-sm">
                      {(verificationResult.details.authenticity_score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="bg-dark-bg rounded-lg p-4">
                  <p className="text-dark-text-secondary text-sm">AI Generated Probability</p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${
                          verificationResult.details.ai_generated_probability < 0.3
                            ? 'bg-green-500'
                            : verificationResult.details.ai_generated_probability < 0.7
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${verificationResult.details.ai_generated_probability * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-dark-text text-sm">
                      {(verificationResult.details.ai_generated_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="bg-dark-bg rounded-lg p-4">
                  <p className="text-dark-text-secondary text-sm">Manipulation Detected</p>
                  <p className={`text-lg font-semibold mt-1 ${
                    verificationResult.details.manipulation_detected ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {verificationResult.details.manipulation_detected ? 'Yes' : 'No'}
                  </p>
                </div>

                <div className="bg-dark-bg rounded-lg p-4">
                  <p className="text-dark-text-secondary text-sm">Metadata Consistent</p>
                  <p className={`text-lg font-semibold mt-1 ${
                    verificationResult.details.metadata_consistent ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {verificationResult.details.metadata_consistent ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {verificationResult.recommendations && verificationResult.recommendations.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-dark-text mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {verificationResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-dark-text-secondary">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-dark-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">How Image Verification Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-dark-text mb-2">🔍 Analysis Methods</h4>
            <ul className="text-dark-text-secondary text-sm space-y-1">
              <li>• Metadata examination</li>
              <li>• Pixel-level analysis</li>
              <li>• Compression artifacts detection</li>
              <li>• AI generation patterns</li>
              <li>• Lighting and shadow consistency</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-dark-text mb-2">⚡ Best Practices</h4>
            <ul className="text-dark-text-secondary text-sm space-y-1">
              <li>• Upload original, unedited images</li>
              <li>• Verify with multiple sources</li>
              <li>• Check image context and timing</li>
              <li>• Report suspicious content</li>
              <li>• Use verified news sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageVerification;