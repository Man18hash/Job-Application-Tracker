import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Home, Plus, Filter, BarChart3, Calendar, TrendingUp, ChevronDown, Activity } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    dateRange: 'all'
  });

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/jobs/new', label: 'Add Job', icon: Plus },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/analytics-volume', label: 'Volume Analytics', icon: Activity },
  ];

  const statusOptions = ['all', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn', 'accepted'];
  const priorityOptions = ['all', 'low', 'medium', 'high'];
  const typeOptions = ['all', 'full-time', 'part-time', 'contract', 'intern', 'other'];
  const dateRangeOptions = ['all', 'last-7-days', 'last-30-days', 'last-3-months', 'last-year'];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="bg-white shadow-md border-b fixed top-0 left-0 right-0 z-50 h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
                <h1 className="text-lg font-bold text-gray-900">Job Tracker</h1>
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

                {/* Compact Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filters
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </button>

                  {/* Compact Filter Dropdown */}
                  {showFilters && (
                    <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Status Filter */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={filters.status}
                              onChange={(e) => handleFilterChange('status', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {statusOptions.map(option => (
                                <option key={option} value={option}>
                                  {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Priority Filter */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                            <select
                              value={filters.priority}
                              onChange={(e) => handleFilterChange('priority', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {priorityOptions.map(option => (
                                <option key={option} value={option}>
                                  {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Type Filter */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Job Type</label>
                            <select
                              value={filters.type}
                              onChange={(e) => handleFilterChange('type', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {typeOptions.map(option => (
                                <option key={option} value={option}>
                                  {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Date Range Filter */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                            <select
                              value={filters.dateRange}
                              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {dateRangeOptions.map(option => (
                                <option key={option} value={option}>
                                  {option === 'all' ? 'All Time' : 
                                   option === 'last-7-days' ? 'Last 7 Days' :
                                   option === 'last-30-days' ? 'Last 30 Days' :
                                   option === 'last-3-months' ? 'Last 3 Months' :
                                   option === 'last-year' ? 'Last Year' : option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        {/* Clear Filters Button */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setFilters({
                                status: 'all',
                                priority: 'all',
                                type: 'all',
                                dateRange: 'all'
                              });
                              setShowFilters(false);
                            }}
                            className="w-full px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
          </div>
        </div>
      </header>

      {/* Main Content with proper spacing */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-gray-500 text-sm">
            © 2025 Job Tracker. Built with MERN Stack.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;



