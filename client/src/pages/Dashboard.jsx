import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Calendar, AlertCircle, Briefcase } from 'lucide-react';
import { jobAPI } from '../services/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, jobsResponse] = await Promise.all([
          jobAPI.getJobStats(),
          jobAPI.getJobs({ limit: 5, sortBy: 'dateApplied', sortOrder: 'desc' })
        ]);
        
        setStats(statsResponse.data.data);
        setRecentJobs(jobsResponse.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      applied: 'text-blue-600',
      interviewing: 'text-yellow-600',
      offered: 'text-green-600',
      rejected: 'text-red-600',
      withdrawn: 'text-gray-600',
      accepted: 'text-green-700'
    };
    return colors[status] || 'text-gray-600';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[priority] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <AlertCircle className="h-5 w-5 inline mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/jobs/new" className="btn btn-primary">
          <Plus className="h-4 w-4" />
          Add New Job
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.recentJobs || 0}</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats?.statusCounts?.interviewing || 0) + (stats?.statusCounts?.applied || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      {stats?.statusCounts && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold mb-4">Application Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">{status}</p>
                <p className={`text-2xl font-bold ${getStatusColor(status)}`}>{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Jobs */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Applications</h2>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {recentJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No job applications yet</p>
            <Link to="/jobs/new" className="btn btn-primary mt-4">
              <Plus className="h-4 w-4" />
              Add Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{job.position}</h3>
                      <span className={`status-badge status-${job.status}`}>
                        {job.status}
                      </span>
                      <span className={`priority-badge priority-${job.priority}`}>
                        {job.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{job.company}</p>
                    <p className="text-sm text-gray-500">
                      Applied: {format(new Date(job.dateApplied), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${job.salary.amount.toLocaleString()} {job.salary.currency}
                    </p>
                    <Link 
                      to={`/jobs/${job._id}`} 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
