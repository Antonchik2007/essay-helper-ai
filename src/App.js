import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import InfoPage from './InfoPage';
import EssayAnalyzer from './EssayAnalyzer';
import PaymentModal from './components/PaymentModal';

function NavBar({ isPro, onUpgradeToPro, onResetPro }) {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admitly</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Home
              </Link>
              <Link to="/analyze" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Analyze
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isPro ? (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                <span className="text-white text-sm font-bold">★</span>
                <span className="text-white text-sm font-bold">PRO</span>
              </div>
            ) : (
              <button
                onClick={onUpgradeToPro}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Upgrade to Pro
              </button>
            )}
            {isPro && (
              <button
                onClick={onResetPro}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Reset Pro
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [isPro, setIsPro] = React.useState(() => {
    return localStorage.getItem('admitly_pro') === 'true';
  });
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);

  const handleUpgradeToPro = () => {
    setShowPaymentModal(true);
  };
  const handlePaymentSuccess = (paymentResult) => {
    setIsPro(true);
    localStorage.setItem('admitly_pro', 'true');
    setShowPaymentModal(false);
  };
  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };
  const handleResetPro = () => {
    setIsPro(false);
    localStorage.removeItem('admitly_pro');
  };

  return (
    <Router>
      <NavBar isPro={isPro} onUpgradeToPro={handleUpgradeToPro} onResetPro={handleResetPro} />
      <Routes>
        <Route path="/" element={<InfoPage />} />
        <Route path="/analyze" element={<EssayAnalyzer />} />
      </Routes>
      <PaymentModal
        isOpen={showPaymentModal}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    </Router>
  );
}