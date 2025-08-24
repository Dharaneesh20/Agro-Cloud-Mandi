import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PriceRecommendationsPage from './pages/PriceRecommendationsPage';
import MandiLocatorPage from './pages/MandiLocatorPage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import TraderProfilePage from './pages/TraderProfilePage';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/price-recommendations" element={<PriceRecommendationsPage />} />
              <Route path="/mandi-locator" element={<MandiLocatorPage />} />
              <Route path="/farmer-profile" element={<FarmerProfilePage />} />
              <Route path="/trader-profile" element={<TraderProfilePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
