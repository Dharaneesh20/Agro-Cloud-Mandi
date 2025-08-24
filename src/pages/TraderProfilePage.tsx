import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface TraderProfile {
  businessName: string;
  licenseNumber: string;
  businessType: string;
  specialization: string[];
  storageCapacity: number;
  transportAvailable: boolean;
  experience: number;
  tradingRadius: number;
}

const TraderProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TraderProfile>({
    businessName: 'Green Valley Traders',
    licenseNumber: 'TLR-2024-001234',
    businessType: 'wholesale',
    specialization: ['Wheat', 'Rice', 'Pulses'],
    storageCapacity: 500,
    transportAvailable: true,
    experience: 15,
    tradingRadius: 100
  });
  const [editing, setEditing] = useState(false);

  const businessTypes = ['wholesale', 'retail', 'export', 'processing'];
  const cropOptions = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Potato', 'Onion', 'Pulses'];

  const handleSave = () => {
    // Here you would typically save to backend
    setEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trader Profile</h1>
          <p className="text-gray-600">Manage your trading business details and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏢</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {user?.location?.district}, {user?.location?.state}
                </p>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member since:</span>
                    <span className="text-sm font-medium">Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profile completion:</span>
                    <span className="text-sm font-medium text-green-600">90%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">License Status:</span>
                    <span className="text-sm font-medium text-green-600">✓ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Verification:</span>
                    <span className="text-sm font-medium text-green-600">✓ Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold mb-4">Business Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Capacity:</span>
                  <span className="font-medium">{profile.storageCapacity} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-medium">{profile.specialization.length} crops</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{profile.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trading Radius:</span>
                  <span className="font-medium">{profile.tradingRadius} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Details */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Business Details</h2>
                {!editing ? (
                  <button 
                    onClick={() => setEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button 
                      onClick={handleSave}
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={profile.businessName}
                      onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                      className="form-input"
                      placeholder="Enter business name"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={profile.licenseNumber}
                      onChange={(e) => setProfile({...profile, licenseNumber: e.target.value})}
                      className="form-input"
                      placeholder="Enter license number"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.licenseNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  {editing ? (
                    <select
                      value={profile.businessType}
                      onChange={(e) => setProfile({...profile, businessType: e.target.value})}
                      className="form-input"
                      aria-label="Select business type"
                    >
                      {businessTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">{profile.businessType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Capacity (MT)
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={profile.storageCapacity}
                      onChange={(e) => setProfile({...profile, storageCapacity: Number(e.target.value)})}
                      className="form-input"
                      placeholder="Enter storage capacity"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.storageCapacity} MT</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={profile.experience}
                      onChange={(e) => setProfile({...profile, experience: Number(e.target.value)})}
                      className="form-input"
                      placeholder="Enter years of experience"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.experience} years</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trading Radius (km)
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={profile.tradingRadius}
                      onChange={(e) => setProfile({...profile, tradingRadius: Number(e.target.value)})}
                      className="form-input"
                      placeholder="Enter trading radius"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.tradingRadius} km</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport Available
                  </label>
                  {editing ? (
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={profile.transportAvailable}
                          onChange={() => setProfile({...profile, transportAvailable: true})}
                          className="mr-2"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!profile.transportAvailable}
                          onChange={() => setProfile({...profile, transportAvailable: false})}
                          className="mr-2"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-gray-900">{profile.transportAvailable ? 'Yes' : 'No'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Crop Specialization</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialized Crops
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialization.map((crop, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {editing && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      Select crops you specialize in (this will be improved with checkboxes in production):
                    </p>
                    <div className="text-sm text-gray-500">
                      Available crops: {cropOptions.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trading Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Trading Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Wheat purchase - 50 MT</p>
                    <p className="text-xs text-gray-500">From Ludhiana Mandi • 2 hours ago</p>
                  </div>
                  <div className="text-sm text-green-600">₹2,200/quintal</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Rice sale - 30 MT</p>
                    <p className="text-xs text-gray-500">To export company • 1 day ago</p>
                  </div>
                  <div className="text-sm text-blue-600">₹3,500/quintal</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Price inquiry - Maize</p>
                    <p className="text-xs text-gray-500">Bathinda Mandi • 2 days ago</p>
                  </div>
                  <div className="text-sm text-gray-600">₹1,800/quintal</div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Monthly Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹25.5L</div>
                  <div className="text-sm text-gray-600">Total Purchases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₹32.1L</div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">145 MT</div>
                  <div className="text-sm text-gray-600">Volume Traded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">18</div>
                  <div className="text-sm text-gray-600">Transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderProfilePage;
