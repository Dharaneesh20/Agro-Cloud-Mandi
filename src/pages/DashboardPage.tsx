import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface DashboardData {
  recentPrices: Array<{
    crop: string;
    price: number;
    change: number;
    mandi: string;
  }>;
  nearbyMandis: Array<{
    name: string;
    distance: number;
    activeTraders: number;
  }>;
  recommendations: Array<{
    type: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        const response = await fetch('/api/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          // Mock data for demo
          setDashboardData({
            recentPrices: [
              { crop: 'Wheat', price: 2200, change: 5.2, mandi: 'Ludhiana Mandi' },
              { crop: 'Rice', price: 3500, change: -2.1, mandi: 'Amritsar Mandi' },
              { crop: 'Maize', price: 1800, change: 3.7, mandi: 'Bathinda Mandi' },
              { crop: 'Sugarcane', price: 350, change: 1.2, mandi: 'Jalandhar Mandi' },
            ],
            nearbyMandis: [
              { name: 'Ludhiana Mandi', distance: 12, activeTraders: 45 },
              { name: 'Amritsar Mandi', distance: 18, activeTraders: 32 },
              { name: 'Bathinda Mandi', distance: 25, activeTraders: 28 },
            ],
            recommendations: [
              {
                type: 'Price Alert',
                message: 'Wheat prices are expected to rise by 8% next week',
                priority: 'high'
              },
              {
                type: 'Weather',
                message: 'Rain expected in 3 days, consider harvesting',
                priority: 'medium'
              },
              {
                type: 'Market Trend',
                message: 'High demand for organic produce in nearby markets',
                priority: 'low'
              },
            ]
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.type === 'farmer' ? 'Farmer' : 'Trader'} Dashboard - {user?.location?.district}, {user?.location?.state}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/price-recommendations" className="card hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900">Price Recommendations</h3>
              <p className="text-sm text-gray-600">Get AI-powered price insights</p>
            </div>
          </Link>
          
          <Link to="/mandi-locator" className="card hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl mb-2">📍</div>
              <h3 className="font-semibold text-gray-900">Find Mandis</h3>
              <p className="text-sm text-gray-600">Locate nearby markets</p>
            </div>
          </Link>
          
          <Link to={user?.type === 'farmer' ? '/farmer-profile' : '/trader-profile'} className="card hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="font-semibold text-gray-900">Profile</h3>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </Link>
          
          <div className="card">
            <div className="text-center">
              <div className="text-3xl mb-2">🌾</div>
              <h3 className="font-semibold text-gray-900">Crop Management</h3>
              <p className="text-sm text-gray-600">Track your crops</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Prices */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Recent Crop Prices</h2>
              <div className="space-y-4">
                {dashboardData?.recentPrices.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.crop}</h3>
                      <p className="text-sm text-gray-600">{item.mandi}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price}/quintal</p>
                      <p className={`text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Nearby Mandis */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Nearby Mandis</h2>
              <div className="space-y-3">
                {dashboardData?.nearbyMandis.map((mandi, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{mandi.name}</p>
                      <p className="text-sm text-gray-600">{mandi.distance} km away</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {mandi.activeTraders} traders
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/mandi-locator" className="btn-primary mt-4 w-full">
                View All Mandis
              </Link>
            </div>

            {/* Recommendations */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Smart Recommendations</h2>
              <div className="space-y-3">
                {dashboardData?.recommendations.map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}>
                    <p className="font-medium text-gray-900">{rec.type}</p>
                    <p className="text-sm text-gray-600">{rec.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
