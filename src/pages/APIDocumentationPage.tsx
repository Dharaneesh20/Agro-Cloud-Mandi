import React, { useState } from 'react';
import { DocumentTextIcon, CodeBracketIcon, ServerIcon, KeyIcon } from '@heroicons/react/24/outline';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  request?: {
    type: string;
    example: any;
  };
  response: {
    type: string;
    example: any;
  };
}

interface ApiSection {
  title: string;
  description: string;
  baseUrl: string;
  endpoints: ApiEndpoint[];
}

const APIDocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('authentication');
  const [activeEndpoint, setActiveEndpoint] = useState<string>('');

  const apiSections: ApiSection[] = [
    {
      title: 'Authentication API',
      description: 'User authentication and authorization endpoints',
      baseUrl: 'http://localhost:5000/api/auth',
      endpoints: [
        {
          method: 'POST',
          path: '/register',
          description: 'Register a new user (farmer or trader)',
          auth: false,
          request: {
            type: 'RegisterData',
            example: {
              name: 'John Doe',
              email: 'john@example.com',
              password: 'password123',
              type: 'farmer',
              location: {
                state: 'Punjab',
                district: 'Ludhiana',
                coordinates: { lat: 30.901, lng: 75.857 }
              }
            }
          },
          response: {
            type: 'RegisterResponse',
            example: {
              user: {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                type: 'farmer',
                location: {
                  state: 'Punjab',
                  district: 'Ludhiana',
                  coordinates: { lat: 30.901, lng: 75.857 }
                }
              },
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              message: 'Registration successful'
            }
          }
        },
        {
          method: 'POST',
          path: '/login',
          description: 'Authenticate user and get access token',
          auth: false,
          request: {
            type: 'LoginRequest',
            example: {
              email: 'john@example.com',
              password: 'password123',
              userType: 'farmer'
            }
          },
          response: {
            type: 'LoginResponse',
            example: {
              user: {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                type: 'farmer'
              },
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              message: 'Login successful'
            }
          }
        },
        {
          method: 'POST',
          path: '/logout',
          description: 'Logout user and invalidate token',
          auth: true,
          response: {
            type: 'void',
            example: { message: 'Logged out successfully' }
          }
        },
        {
          method: 'GET',
          path: '/profile',
          description: 'Get current user profile',
          auth: true,
          response: {
            type: 'User',
            example: {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              type: 'farmer',
              location: {
                state: 'Punjab',
                district: 'Ludhiana'
              }
            }
          }
        },
        {
          method: 'PUT',
          path: '/profile',
          description: 'Update user profile information',
          auth: true,
          request: {
            type: 'Partial<User>',
            example: {
              name: 'John Smith',
              location: {
                state: 'Haryana',
                district: 'Karnal'
              }
            }
          },
          response: {
            type: 'User',
            example: {
              id: '1',
              name: 'John Smith',
              email: 'john@example.com',
              type: 'farmer'
            }
          }
        }
      ]
    },
    {
      title: 'Price API',
      description: 'Crop price data and recommendations',
      baseUrl: 'http://localhost:5000/api/prices',
      endpoints: [
        {
          method: 'GET',
          path: '/recommendations',
          description: 'Get AI-powered price recommendations',
          auth: true,
          parameters: [
            { name: 'crop', type: 'string', required: false, description: 'Filter by crop type' },
            { name: 'state', type: 'string', required: false, description: 'Filter by state' },
            { name: 'district', type: 'string', required: false, description: 'Filter by district' },
            { name: 'mandi', type: 'string', required: false, description: 'Filter by mandi' }
          ],
          response: {
            type: 'PriceData[]',
            example: [
              {
                crop: 'Wheat',
                currentPrice: 2200,
                predictedPrice: 2376,
                confidence: 87,
                trend: 'up',
                mandi: 'Ludhiana Mandi',
                lastUpdated: '2024-01-15T10:30:00Z',
                priceHistory: [
                  { date: '2024-01-01', price: 2100 },
                  { date: '2024-01-15', price: 2200 }
                ]
              }
            ]
          }
        },
        {
          method: 'GET',
          path: '/history/{crop}',
          description: 'Get historical price data for a specific crop',
          auth: true,
          parameters: [
            { name: 'crop', type: 'string', required: true, description: 'Crop name' },
            { name: 'start', type: 'string', required: true, description: 'Start date (ISO format)' },
            { name: 'end', type: 'string', required: true, description: 'End date (ISO format)' }
          ],
          response: {
            type: 'Array<{date: string, price: number}>',
            example: [
              { date: '2024-01-01', price: 2100 },
              { date: '2024-01-15', price: 2150 },
              { date: '2024-02-01', price: 2200 }
            ]
          }
        },
        {
          method: 'GET',
          path: '/current',
          description: 'Get current market prices for multiple crops',
          auth: true,
          parameters: [
            { name: 'crops', type: 'string', required: true, description: 'Comma-separated crop names' }
          ],
          response: {
            type: 'Array<{crop: string, price: number, mandi: string}>',
            example: [
              { crop: 'Wheat', price: 2200, mandi: 'Ludhiana Mandi' },
              { crop: 'Rice', price: 3500, mandi: 'Amritsar Mandi' }
            ]
          }
        },
        {
          method: 'GET',
          path: '/insights',
          description: 'Get market insights and analysis',
          auth: true,
          response: {
            type: 'MarketInsight[]',
            example: [
              {
                type: 'weather',
                title: 'Weather Impact',
                description: 'Expected rainfall may impact harvesting',
                impact: 'negative',
                crops: ['Wheat', 'Barley'],
                severity: 'medium'
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Mandi API',
      description: 'Agricultural market (mandi) information and location services',
      baseUrl: 'http://localhost:5000/api/mandis',
      endpoints: [
        {
          method: 'GET',
          path: '/nearby',
          description: 'Find nearby mandis based on location and filters',
          auth: true,
          parameters: [
            { name: 'lat', type: 'number', required: false, description: 'Latitude coordinate' },
            { name: 'lng', type: 'number', required: false, description: 'Longitude coordinate' },
            { name: 'maxDistance', type: 'number', required: false, description: 'Maximum distance in km' },
            { name: 'commodity', type: 'string', required: false, description: 'Filter by commodity' },
            { name: 'minRating', type: 'number', required: false, description: 'Minimum rating filter' }
          ],
          response: {
            type: 'Mandi[]',
            example: [
              {
                id: '1',
                name: 'Ludhiana Grain Market',
                location: {
                  district: 'Ludhiana',
                  state: 'Punjab',
                  coordinates: { lat: 30.901, lng: 75.857 },
                  address: 'Grain Market Road, Ludhiana, Punjab'
                },
                distance: 12,
                activeTraders: 45,
                commodities: ['Wheat', 'Rice', 'Maize'],
                avgPrice: 2200,
                rating: 4.5,
                facilities: ['Storage', 'Transport', 'Quality Testing'],
                operatingHours: {
                  open: '06:00',
                  close: '18:00',
                  daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                },
                contact: {
                  phone: '+91-9876543210',
                  email: 'info@ludhianamandi.com'
                }
              }
            ]
          }
        },
        {
          method: 'GET',
          path: '/{id}',
          description: 'Get detailed information about a specific mandi',
          auth: true,
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Mandi ID' }
          ],
          response: {
            type: 'Mandi',
            example: {
              id: '1',
              name: 'Ludhiana Grain Market',
              location: {
                district: 'Ludhiana',
                state: 'Punjab',
                coordinates: { lat: 30.901, lng: 75.857 }
              },
              activeTraders: 45,
              commodities: ['Wheat', 'Rice', 'Maize'],
              rating: 4.5
            }
          }
        },
        {
          method: 'GET',
          path: '/{id}/traders',
          description: 'Get list of traders in a specific mandi',
          auth: true,
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Mandi ID' }
          ],
          response: {
            type: 'TraderInfo[]',
            example: [
              {
                id: '1',
                name: 'Ram Singh',
                businessName: 'Singh Grain Trading',
                specialization: ['Wheat', 'Rice'],
                rating: 4.2,
                contact: {
                  phone: '+91-9876543210',
                  email: 'ram@singhtrading.com'
                },
                isVerified: true
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Map API',
      description: 'Interactive map services and route optimization',
      baseUrl: 'http://localhost:5000/api/map',
      endpoints: [
        {
          method: 'GET',
          path: '/mandis',
          description: 'Get mandis data for map visualization',
          auth: true,
          parameters: [
            { name: 'bounds', type: 'string', required: false, description: 'Map bounds (lat1,lng1,lat2,lng2)' },
            { name: 'commodity', type: 'string', required: false, description: 'Filter by commodity' }
          ],
          response: {
            type: 'MapMandi[]',
            example: [
              {
                id: '1',
                name: 'Ludhiana Grain Market',
                latitude: 30.901,
                longitude: 75.857,
                address: 'Grain Market Road, Ludhiana, Punjab',
                type: 'grain',
                rating: 4.5,
                commodities: ['Wheat', 'Rice', 'Maize'],
                operatingHours: '06:00 - 18:00',
                isVerified: true,
                facilities: ['Storage', 'Transport']
              }
            ]
          }
        },
        {
          method: 'POST',
          path: '/route/optimize',
          description: 'Get optimized route for visiting multiple mandis',
          auth: true,
          request: {
            type: 'RouteRequest',
            example: {
              origin: { lat: 30.901, lon: 75.857 },
              destinations: [
                { lat: 31.634, lon: 74.872 },
                { lat: 30.373, lon: 76.783 }
              ],
              preferences: {
                avoidTolls: false,
                routeType: 'fastest'
              }
            }
          },
          response: {
            type: 'OptimalRoute',
            example: {
              routePlan: {
                detailedRoutes: [
                  {
                    route: {
                      routePoints: [
                        { lat: 30.901, lon: 75.857 },
                        { lat: 31.634, lon: 74.872 }
                      ]
                    }
                  }
                ]
              }
            }
          }
        },
        {
          method: 'GET',
          path: '/geocode',
          description: 'Convert address to coordinates',
          auth: true,
          parameters: [
            { name: 'address', type: 'string', required: true, description: 'Address to geocode' }
          ],
          response: {
            type: 'LocationPoint',
            example: {
              lat: 30.901,
              lon: 75.857,
              address: 'Ludhiana, Punjab, India'
            }
          }
        }
      ]
    },
    {
      title: 'Gemini AI API',
      description: 'AI-powered chatbot and agricultural assistance',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash',
      endpoints: [
        {
          method: 'POST',
          path: ':generateContent',
          description: 'Generate AI responses for agricultural queries',
          auth: true,
          parameters: [
            { name: 'key', type: 'string', required: true, description: 'Gemini API key (query parameter)' }
          ],
          request: {
            type: 'GeminiRequest',
            example: {
              contents: [
                {
                  parts: [
                    {
                      text: 'What is the best time to plant wheat in Punjab?'
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.8,
                maxOutputTokens: 1024
              }
            }
          },
          response: {
            type: 'GeminiResponse',
            example: {
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: 'The best time to plant wheat in Punjab is typically from mid-October to early December...'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      ]
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
              <p className="text-gray-600 mt-1">
                Complete reference for Agro Cloud Mandi APIs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="font-semibold text-gray-900 mb-4">API Sections</h2>
              <nav className="space-y-2">
                {apiSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(section.title.toLowerCase().replace(' api', '').replace(' ', '-'))}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.title.toLowerCase().replace(' api', '').replace(' ', '-')
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Quick Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Authentication
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Most endpoints require Bearer token authentication.
                </p>
                <code className="text-xs bg-white px-2 py-1 rounded border">
                  Authorization: Bearer &lt;token&gt;
                </code>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                  <ServerIcon className="h-4 w-4 mr-2" />
                  Base URL
                </h3>
                <code className="text-xs text-blue-800 break-all">
                  http://localhost:5000/api
                </code>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {apiSections.map((section, sectionIndex) => {
              const sectionId = section.title.toLowerCase().replace(' api', '').replace(' ', '-');
              if (activeSection !== sectionId) return null;

              return (
                <div key={sectionIndex} className="space-y-6">
                  {/* Section Header */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                    <p className="text-gray-600 mb-4">{section.description}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Base URL:</p>
                      <code className="text-sm text-primary-600">{section.baseUrl}</code>
                    </div>
                  </div>

                  {/* Endpoints */}
                  {section.endpoints.map((endpoint, endpointIndex) => {
                    const endpointId = `${sectionId}-${endpointIndex}`;
                    
                    return (
                      <div key={endpointIndex} className="bg-white rounded-lg shadow-sm border">
                        {/* Endpoint Header */}
                        <div className="p-6 border-b">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                                {endpoint.method}
                              </span>
                              <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                              {endpoint.auth && (
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                                  🔒 Auth Required
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => setActiveEndpoint(activeEndpoint === endpointId ? '' : endpointId)}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              {activeEndpoint === endpointId ? 'Hide Details' : 'Show Details'}
                            </button>
                          </div>
                          <p className="text-gray-600">{endpoint.description}</p>
                        </div>

                        {/* Endpoint Details */}
                        {activeEndpoint === endpointId && (
                          <div className="p-6 space-y-6">
                            {/* Parameters */}
                            {endpoint.parameters && endpoint.parameters.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Parameters</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {endpoint.parameters.map((param, paramIndex) => (
                                        <tr key={paramIndex}>
                                          <td className="px-4 py-2 text-sm font-mono text-gray-900">{param.name}</td>
                                          <td className="px-4 py-2 text-sm text-gray-600">{param.type}</td>
                                          <td className="px-4 py-2 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                              param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                              {param.required ? 'Required' : 'Optional'}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Request Body */}
                            {endpoint.request && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                                <p className="text-sm text-gray-600 mb-2">Type: <code>{endpoint.request.type}</code></p>
                                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                  <pre className="text-green-400 text-sm">
                                    <code>{JSON.stringify(endpoint.request.example, null, 2)}</code>
                                  </pre>
                                </div>
                              </div>
                            )}

                            {/* Response */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Response</h4>
                              <p className="text-sm text-gray-600 mb-2">Type: <code>{endpoint.response.type}</code></p>
                              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-blue-400 text-sm">
                                  <code>{JSON.stringify(endpoint.response.example, null, 2)}</code>
                                </pre>
                              </div>
                            </div>

                            {/* Code Example */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <CodeBracketIcon className="h-4 w-4 mr-2" />
                                JavaScript Example
                              </h4>
                              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-gray-300 text-sm">
                                  <code>{`
// Using axios
const response = await api.${endpoint.method.toLowerCase()}('${endpoint.path}'${
  endpoint.request ? ', requestData' : ''
});
console.log(response.data);

// Using fetch
const response = await fetch('${section.baseUrl}${endpoint.path}', {
  method: '${endpoint.method}',${
    endpoint.auth ? `
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },` : ''
  }${
    endpoint.request ? `
  body: JSON.stringify(requestData)` : ''
  }
});
const data = await response.json();`}
                                  </code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentationPage;
