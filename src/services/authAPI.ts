import api from './api';
import { User, RegisterData } from '../context/AuthContext';

export interface LoginRequest {
  email: string;
  password: string;
  userType: 'farmer' | 'trader';
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message: string;
}

export const authAPI = {
  // User registration
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Return mock data for demo
      return {
        user: {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          type: userData.type,
          location: userData.location
        },
        token: 'mock-jwt-token',
        message: 'Registration successful'
      };
    }
  },

  // User login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Return mock data for demo
      return {
        user: {
          id: '1',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          type: credentials.userType,
          location: {
            state: 'Punjab',
            district: 'Ludhiana',
            coordinates: { lat: 30.901, lng: 75.857 }
          }
        },
        token: 'mock-jwt-token',
        message: 'Login successful'
      };
    }
  },

  // User logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Handle logout locally even if API fails
      console.log('Logout completed locally');
    }
  },

  // Refresh token
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', { oldPassword, newPassword });
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  }
};
