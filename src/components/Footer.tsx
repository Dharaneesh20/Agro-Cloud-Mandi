import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Agro Cloud Mandi</h3>
            <p className="text-gray-300">
              Empowering farmers with smart recommendations and fair market prices.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">For Farmers</h4>
            <ul className="space-y-2">
              <li><a href="/price-recommendations" className="text-gray-300 hover:text-white">Price Recommendations</a></li>
              <li><a href="/mandi-locator" className="text-gray-300 hover:text-white">Mandi Locator</a></li>
              <li><a href="/farmer-profile" className="text-gray-300 hover:text-white">Farmer Portal</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">For Traders</h4>
            <ul className="space-y-2">
              <li><a href="/trader-profile" className="text-gray-300 hover:text-white">Trader Portal</a></li>
              <li><a href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Market Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">API Documentation</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Agro Cloud Mandi. All rights reserved. Built with ❤️ for farmers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
