import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { jobAPI } from '../services/api';
import { format } from 'date-fns';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    company: '',
    priority: '',
    type: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.current]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: 10,
        ...filters
      };
      
      const response = await jobAPI.getJobs(params);
      setJobs(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load jobs');
      console.error('Jobs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(id);
        setJobs(jobs.filter(job => job._id !== id));
      } catch (err) {
        setError('Failed to delete job');
        console.error('Delete error:', err);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'status-applied',
      interviewing: 'status-interviewing',
      offered: 'status-offered',
      rejected: 'status-rejected',
      withdrawn: 'status-withdrawn',
      accepted: 'status-accepted'
    };
    return colors[status] || 'status-applied';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high'
    };
    return colors[priority] || 'priority-medium';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="text-gray-500">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <Link to="/jobs/new" className="btn btn-primary">
          <Plus className="h-4 w-4" />
          Add New Job
        </Link>
      </div>

      {error && (
        <div className="error mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
          <div>
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="form-label">Company</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by company..."
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="card">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No jobs found</p>
            <Link to="/jobs/new" className="btn btn-primary mt-4">
              <Plus className="h-4 w-4" />
              Add Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.position}</h3>
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      <span className={`priority-badge ${getPriorityColor(job.priority)}`}>
                        {job.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="capitalize">{job.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Applied: {format(new Date(job.dateApplied), 'MMM dd, yyyy')}</span>
                    </div>
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      ${job.salary.amount.toLocaleString()} {job.salary.currency}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/jobs/${job._id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
              disabled={pagination.current === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.current} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
              disabled={pagination.current === pagination.pages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;



