import React from 'react';
import { formatDistance, formatDuration } from '../utils/helpers';

const RouteOptimizer = ({ 
  selectedMandis, 
  optimalRoute, 
  userLocation, 
  onOptimize, 
  onClear 
}) => {
  const hasRoute = optimalRoute && optimalRoute.routePlan;

  if (selectedMandis.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🗺️ Route Optimizer
        </h2>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Mandis Selected</h3>
          <p className="text-gray-500 text-sm mb-4">
            Select 2 or more mandis from the search results to optimize your route.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 How it works:</h4>
            <ul className="text-xs text-blue-700 space-y-1 text-left">
              <li>• Select multiple mandis you want to visit</li>
              <li>• Our algorithm finds the shortest route</li>
              <li>• Get turn-by-turn directions</li>
              <li>• Save time and fuel costs</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Route Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            🗺️ Route Optimizer
          </h2>
          <span className="badge badge-info">
            {selectedMandis.length} stops
          </span>
        </div>

        {/* Selected Mandis List */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Mandis:</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {selectedMandis.map((mandi, index) => (
              <div 
                key={mandi.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mandi.name}</p>
                    <p className="text-xs text-gray-500">{mandi.district}, {mandi.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onOptimize}
            disabled={!userLocation || selectedMandis.length < 1}
            className="btn btn-primary flex-1"
          >
            🎯 Optimize Route
          </button>
          <button
            onClick={onClear}
            className="btn btn-secondary"
          >
            Clear
          </button>
        </div>

        {!userLocation && (
          <p className="text-xs text-red-600 mt-2">
            ⚠️ Please set your location first to optimize route
          </p>
        )}
      </div>

      {/* Optimized Route Results */}
      {hasRoute && (
        <div className="card">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            ✅ Optimized Route Plan
          </h3>

          {/* Route Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600 font-medium">Total Distance</p>
              <p className="text-lg font-bold text-green-900">
                {optimalRoute.routePlan.optimalRoute?.distanceText || 
                 formatDistance(optimalRoute.routePlan.optimalRoute?.totalDistance || 0)}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">Total Time</p>
              <p className="text-lg font-bold text-blue-900">
                {optimalRoute.routePlan.optimalRoute?.timeText || 
                 formatDuration(optimalRoute.routePlan.optimalRoute?.totalTime || 0)}
              </p>
            </div>
          </div>

          {/* Route Sequence */}
          {optimalRoute.routePlan.optimalRoute?.route && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Route Sequence:</h4>
              <div className="space-y-2">
                {optimalRoute.routePlan.optimalRoute.route.map((location, index) => {
                  const isStart = index === 0;
                  const isEnd = index === optimalRoute.routePlan.optimalRoute.route.length - 1;
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-2 border border-gray-200 rounded"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isStart ? 'bg-green-100 text-green-700' :
                        isEnd ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {isStart ? '🏠' : isEnd ? '🏁' : index}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {isStart ? 'Starting Point' : location.name || `Stop ${index}`}
                        </p>
                        {location.address && (
                          <p className="text-xs text-gray-500">{location.address}</p>
                        )}
                      </div>
                      {!isStart && !isEnd && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude || location.lat},${location.longitude || location.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          🧭
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Efficiency Metrics */}
          {optimalRoute.routePlan.optimalRoute?.efficiency && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">📊 Route Efficiency</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-yellow-700">Avg Distance/Stop:</span>
                  <span className="ml-1 font-medium">
                    {optimalRoute.routePlan.optimalRoute.efficiency.distancePerStop}
                  </span>
                </div>
                <div>
                  <span className="text-yellow-700">Avg Time/Stop:</span>
                  <span className="ml-1 font-medium">
                    {optimalRoute.routePlan.optimalRoute.efficiency.timePerStop}
                  </span>
                </div>
                <div>
                  <span className="text-yellow-700">Efficiency Score:</span>
                  <span className="ml-1 font-medium">
                    {optimalRoute.routePlan.optimalRoute.efficiency.efficiencyScore}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Algorithm: {optimalRoute.routePlan.optimization?.algorithm || 'Route optimization'}
              </span>
              <span>
                Optimized for: {optimalRoute.optimization || 'time'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => {
                const route = optimalRoute.routePlan.optimalRoute?.route;
                if (route && route.length > 0) {
                  const start = route[0];
                  const waypoints = route.slice(1, -1).map(p => `${p.latitude || p.lat},${p.longitude || p.lon}`).join('|');
                  const end = route[route.length - 1];
                  const url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat || start.latitude},${start.lon || start.longitude}&destination=${end.latitude || end.lat},${end.longitude || end.lon}${waypoints ? `&waypoints=${waypoints}` : ''}`;
                  window.open(url, '_blank');
                }
              }}
              className="btn btn-primary flex-1"
            >
              🧭 Open in Google Maps
            </button>
            <button
              onClick={onOptimize}
              className="btn btn-outline"
            >
              🔄 Re-optimize
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card">
        <h3 className="font-medium text-gray-900 mb-3">💡 Route Tips</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <p>• Visit mandis during their operating hours for best prices</p>
          <p>• Consider traffic conditions during peak hours</p>
          <p>• Call ahead to confirm commodity availability</p>
          <p>• Carry proper documentation for bulk purchases</p>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizer;
