import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ParameterCard from './components/ParameterCard';
import { generateMockData, getStationInfo } from './utils/mockData';
import { ParameterData, StationInfo } from './types';

function App() {
  const [parameters, setParameters] = useState<ParameterData[]>([]);
  const [stationInfo, setStationInfo] = useState<StationInfo>(getStationInfo());

  useEffect(() => {
    // Initial data load
    setParameters(generateMockData());

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setParameters(generateMockData());
      setStationInfo(prev => ({
        ...prev,
        lastSync: new Date()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const criticalCount = parameters.filter(p => p.status === 'critical').length;
  const warningCount = parameters.filter(p => p.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header stationInfo={stationInfo} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Summary */}
        {(criticalCount > 0 || warningCount > 0) && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">System Status</h2>
              <div className="flex flex-wrap gap-4">
                {criticalCount > 0 && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">{criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''}</span>
                  </div>
                )}
                {warningCount > 0 && (
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">{warningCount} Warning{warningCount > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Parameter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {parameters.map((parameter) => (
            <ParameterCard key={parameter.id} parameter={parameter} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Station ID:</span>
              <span className="ml-2 font-medium text-gray-900">{stationInfo.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Total Parameters:</span>
              <span className="ml-2 font-medium text-gray-900">{parameters.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Update Frequency:</span>
              <span className="ml-2 font-medium text-gray-900">Every 30 seconds</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;