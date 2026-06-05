import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: (
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Customer Management',
    desc: 'Easily add, search, and manage your customer database with real-time filtering and paginated views.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Product Inventory',
    desc: 'Maintain your product catalog with automated pricing, stock tracking, and search capabilities.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
      </svg>
    ),
    title: 'Sales Transactions',
    desc: 'Full CRUD operations with invoice generation, multi-payment support, and edit/delete capabilities.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Sales Reports',
    desc: 'Daily, weekly, and monthly performance reports with print-ready formatting and revenue summaries.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure Authentication',
    desc: 'JWT-based login with encrypted passwords, session management, and automatic token expiry handling.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    title: 'Dashboard Analytics',
    desc: 'Real-time overview with stat cards, top-selling products, and revenue tracking at a glance.',
  },
];

const stats = [
  { value: '200+', label: 'Requests/min handled', color: 'from-blue-500 to-blue-600' },
  { value: '<50ms', label: 'Avg API response time', color: 'from-green-500 to-green-600' },
  { value: '99.9%', label: 'Uptime reliability', color: 'from-purple-500 to-purple-600' },
  { value: 'Zero', label: 'Dependencies overhead', color: 'from-yellow-500 to-yellow-600' },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(user ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="font-bold text-lg text-gray-900">SalePro</span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 transition-colors"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-white pointer-events-none" />
        <div className="absolute top-20 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-blue-700">Sales Record Management System</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Streamline Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sales Management
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A powerful, full-stack platform to manage customers, products, sales transactions, 
              and generate comprehensive business reports — built with modern web technologies 
              for speed and reliability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage sales
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From customer records to revenue reports — all in one integrated platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for Performance
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Optimized backend with response compression, rate limiting, connection pooling, 
              and lazy-loaded frontend for instant page transitions.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white/5 border border-slate-700/50 backdrop-blur-sm">
                <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-2`}>
                  {s.value}
                </div>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
              <span className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">Compression</span>
              <span className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">Rate Limiting</span>
              <span className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">Code Splitting</span>
              <span className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">Pagination</span>
              <span className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">Connection Pool</span>
              <span className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">Debounce Search</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powered By</h2>
          <p className="text-gray-500 mb-10">Modern technologies driving the platform</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { name: 'React 19', desc: 'UI Library' },
              { name: 'Tailwind CSS', desc: 'Styling' },
              { name: 'Node.js', desc: 'Runtime' },
              { name: 'Express', desc: 'API Framework' },
              { name: 'MySQL', desc: 'Database' },
              { name: 'JWT', desc: 'Auth' },
            ].map((tech, i) => (
              <div key={i} className="text-center px-6 py-4 bg-gray-50 rounded-xl border border-gray-100 min-w-[130px]">
                <p className="font-semibold text-gray-900 text-sm">{tech.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to streamline your sales?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start managing your customers, products, and sales in one place.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:bg-blue-50 hover:-translate-y-0.5 shadow-xl"
          >
            {user ? 'Go to Dashboard' : 'Get Started Now'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow">
                <span className="text-white font-bold text-xs">SP</span>
              </div>
              <span className="text-white font-semibold">SalePro</span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} SalePro SRMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
