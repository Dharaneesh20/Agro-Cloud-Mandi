import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface FarmerProfile {
  farmSize: number;
  farmType: string;
  primaryCrops: string[];
  secondaryCrops: string[];
  irrigation: string;
  soilType: string;
  experience: number;
}

const FarmerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile>({
    farmSize: 5,
    farmType: 'individual',
    primaryCrops: ['Wheat', 'Rice'],
    secondaryCrops: ['Maize'],
    irrigation: 'tube-well',
    soilType: 'alluvial',
    experience: 10
  });
  const [editing, setEditing] = useState(false);

  const farmTypes = ['individual', 'partnership', 'cooperative'];
  const irrigationTypes = ['rainwater', 'tube-well', 'canal', 'drip-irrigation'];
  const soilTypes = ['alluvial', 'black', 'red', 'sandy', 'clay'];
  const cropOptions = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Potato', 'Onion'];

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
          <h1 className="text-3xl font-bold text-gray-900">Farmer Profile</h1>
          <p className="text-gray-600">Manage your farming details and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍🌾</span>
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
                    <span className="text-sm font-medium text-green-600">85%</span>
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
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Farm Size:</span>
                  <span className="font-medium">{profile.farmSize} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Primary Crops:</span>
                  <span className="font-medium">{profile.primaryCrops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{profile.experience} years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farm Details */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Farm Details</h2>
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
                    Farm Size (acres)
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={profile.farmSize}
                      onChange={(e) => setProfile({...profile, farmSize: Number(e.target.value)})}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.farmSize} acres</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Type
                  </label>
                  {editing ? (
                    <select
                      value={profile.farmType}
                      onChange={(e) => setProfile({...profile, farmType: e.target.value})}
                      className="form-input"
                    >
                      {farmTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">{profile.farmType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irrigation Method
                  </label>
                  {editing ? (
                    <select
                      value={profile.irrigation}
                      onChange={(e) => setProfile({...profile, irrigation: e.target.value})}
                      className="form-input"
                    >
                      {irrigationTypes.map(type => (
                        <option key={type} value={type}>
                          {type.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">{profile.irrigation.replace('-', ' ')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil Type
                  </label>
                  {editing ? (
                    <select
                      value={profile.soilType}
                      onChange={(e) => setProfile({...profile, soilType: e.target.value})}
                      className="form-input"
                    >
                      {soilTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">{profile.soilType}</p>
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
                    />
                  ) : (
                    <p className="text-gray-900">{profile.experience} years</p>
                  )}
                </div>
              </div>
            </div>

            {/* Crop Details */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Crop Portfolio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Crops
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.primaryCrops.map((crop, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Crops
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.secondaryCrops.map((crop, index) => (
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
                      Select crops you grow (this will be improved with checkboxes in production):
                    </p>
                    <div className="text-sm text-gray-500">
                      Available crops: {cropOptions.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Price check for Wheat</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <div className="text-sm text-green-600">₹2,200/quintal</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Visited Ludhiana Mandi</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <div className="text-sm text-gray-600">12 km away</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Profile updated</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                  <div className="text-sm text-blue-600">Profile complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;
