import React from 'react';
import { 
  formatDistance, 
  getRatingColor, 
  isMarketOpen,
  getCommodityIcon,
  formatAddress
} from '../../utils/mapHelpers';
import { MapMandi, LocationPoint } from '../../services/map/mapApiService';

interface MandiListProps {
  mandis: MapMandi[];
  selectedMandis: MapMandi[];
  onMandiSelect: (mandi: MapMandi) => void;
  userLocation?: LocationPoint | null;
}

const MandiList: React.FC<MandiListProps> = ({ mandis, selectedMandis, onMandiSelect, userLocation }) => {
  const isSelected = (mandi: MapMandi): boolean => {
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
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            {selectedMandis.length} Selected
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedMandis.map((mandi) => {
          const selected = isSelected(mandi);
          const marketOpen = isMarketOpen(mandi.operatingHours);
          
          return (
            <div
              key={mandi.id}
              className={`p-3 border rounded-lg transition-all cursor-pointer ${
                selected
                  ? 'border-green-300 bg-green-50'
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
                  <span className="rating-badge px-2 py-1 text-xs rounded-full font-medium">
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
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{mandi.commodities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMandiSelect(mandi);
                  }}
                  className={`px-3 py-1 text-xs rounded-md transition-colors flex-1 ${
                    selected
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {selected ? '✓ Selected' : '+ Select'}
                </button>
                
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${mandi.latitude},${mandi.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  🧭 Directions
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedMandis.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Mandis:</h4>
          <div className="space-y-1">
            {selectedMandis.map((mandi) => (
              <div key={mandi.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-700">{mandi.name}</span>
                <button
                  onClick={() => onMandiSelect(mandi)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MandiList;
