import React from 'react';
import { 
  formatDistance, 
  getRatingColor, 
  isMarketOpen,
  getCommodityIcon,
  formatAddress
} from '../utils/helpers';

const MandiList = ({ mandis, selectedMandis, onMandiSelect, userLocation }) => {
  const isSelected = (mandi) => {
    return selectedMandis.some(selected => selected.id === mandi.id);
  };

  const sortedMandis = [...mandis].sort((a, b) => {
    // Sort by distance if available, otherwise by rating
    if (a.distance && b.distance) {
      return a.distance - b.distance;
    }
    return b.rating - a.rating;
  });

  if (mandis.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Mandis Found</h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your location or commodity filter to find nearby mandis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          🏪 Nearby Mandis ({mandis.length})
        </h2>
        {selectedMandis.length > 0 && (
          <span className="badge badge-success">
            {selectedMandis.length} Selected
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {sortedMandis.map((mandi) => {
          const selected = isSelected(mandi);
          const marketOpen = isMarketOpen(mandi.operatingHours);
          
          return (
            <div
              key={mandi.id}
              className={`p-3 border rounded-lg transition-all cursor-pointer ${
                selected
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onMandiSelect(mandi)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {mandi.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {formatAddress(mandi.address)}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <span 
                    className="px-2 py-1 text-xs rounded-full font-medium"
                    style={{ 
                      backgroundColor: getRatingColor(mandi.rating) + '20',
                      color: getRatingColor(mandi.rating)
                    }}
                  >
                    ⭐ {mandi.rating}
                  </span>
                  {mandi.isVerified && (
                    <span className="text-green-600 text-xs" title="Verified">✓</span>
                  )}
                </div>
              </div>

              {/* Market Info */}
              <div className="flex items-center space-x-4 mb-2 text-xs text-gray-600">
                <span className="flex items-center space-x-1">
                  <span>🏷️</span>
                  <span className="capitalize">{mandi.type}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🕒</span>
                  <span className={marketOpen ? 'text-green-600' : 'text-red-600'}>
                    {marketOpen ? 'Open' : 'Closed'}
                  </span>
                </span>
                {mandi.distance && (
                  <span className="flex items-center space-x-1">
                    <span>📏</span>
                    <span>{formatDistance(mandi.distance * 1000)}</span>
                  </span>
                )}
              </div>

              {/* Commodities */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {mandi.commodities.slice(0, 3).map((commodity, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {getCommodityIcon(commodity)} {commodity}
                    </span>
                  ))}
                  {mandi.commodities.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                      +{mandi.commodities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Facilities */}
              {mandi.facilities && mandi.facilities.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Facilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {mandi.facilities.slice(0, 3).map((facility, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                      >
                        {facility.replace('_', ' ')}
                      </span>
                    ))}
                    {mandi.facilities.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-blue-200 text-blue-600 rounded">
                        +{mandi.facilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span 
                    className={`text-xs px-2 py-1 rounded ${
                      selected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {selected ? '✓ Selected' : 'Click to select'}
                  </span>
                  {mandi.marketFee && (
                    <span className="text-xs text-gray-500">
                      Fee: {mandi.marketFee}%
                    </span>
                  )}
                </div>
                
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${mandi.latitude},${mandi.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  🧭 Directions
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Mandis:</span>
            <span className="ml-1 font-medium">{mandis.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Selected:</span>
            <span className="ml-1 font-medium text-primary-600">{selectedMandis.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiList;
