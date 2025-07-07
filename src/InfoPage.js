import React from 'react';
import TrustedBySection from './components/TrustedBySection';
import { Link } from 'react-router-dom';

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
              <span className="mr-2">✨</span>
              AI-Powered College Essay Analysis
            </div>
            <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm mb-2">
              🎉 100% Free
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Get Into Your Dream School
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Admitly's AI analyzes your college essay with expert-level feedback to help you stand out in admissions.
          </p>
          <Link to="/analyze">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-6">
              🚀 Start Your Free Analysis
            </button>
          </Link>
        </div>
      </div>

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Admitly?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get the same level of feedback that helped students get into top universities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">💸</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Free</h3>
              <p className="text-gray-600">
                Enjoy unlimited essay analysis and feedback with no cost, subscriptions, or hidden fees.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Targeted Feedback</h3>
              <p className="text-gray-600">
                Get feedback tailored to your target school's difficulty level - from state universities to Ivy League
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Analysis</h3>
              <p className="text-gray-600">
                Receive detailed feedback in seconds, not days. No waiting for human reviewers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Essay?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students who've improved their essays with Admitly's AI analysis. <span className="font-bold text-green-700">Completely free!</span>
          </p>
          <Link to="/analyze">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Start Your Free Analysis
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 