import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Calendar, MapPin, DollarSign, Mail, User, ExternalLink } from 'lucide-react';
import { jobAPI } from '../services/api';
import { format } from 'date-fns';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJob(id);
      setJob(response.data.data);
    } catch (err) {
      setError('Failed to load job details');
      console.error('Job details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(id);
        navigate('/jobs');
      } catch (err) {
        setError('Failed to delete job');
        console.error('Delete error:', err);
      }
    }
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
        <div className="text-gray-500">Loading job details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="error">
        Job not found
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.position}</h1>
          <p className="text-lg text-gray-600">{job.company}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/jobs/${job._id}/edit`}
            className="btn btn-outline"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status and Priority */}
          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <span className={`status-badge ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
              <span className={`priority-badge ${getPriorityColor(job.priority)}`}>
                {job.priority} priority
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ExternalLink className="h-4 w-4" />
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                View Job Posting
              </a>
            </div>
          </div>

          {/* Job Information */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Job Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{job.location || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{job.type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Applied:</span>
                <span className="font-medium">{format(new Date(job.dateApplied), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Source:</span>
                <span className="font-medium">{job.source || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Salary Information</h2>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold text-gray-900">
                ${job.salary.amount.toLocaleString()} {job.salary.currency}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          {(job.contactName || job.contactEmail) && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-2">
                {job.contactName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{job.contactName}</span>
                  </div>
                )}
                {job.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Email:</span>
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {job.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Important Dates */}
          {(job.deadline || job.followUpOn) && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Important Dates</h2>
              <div className="space-y-2">
                {job.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium">{format(new Date(job.deadline), 'MMM dd, yyyy')}</span>
                  </div>
                )}
                {job.followUpOn && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Follow Up:</span>
                    <span className="font-medium">{format(new Date(job.followUpOn), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {(job.notes || job.nextAction) && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Notes & Next Action</h2>
              <div className="space-y-4">
                {job.nextAction && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Next Action</h3>
                    <p className="text-gray-600">{job.nextAction}</p>
                  </div>
                )}
                {job.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Notes</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{job.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interviews */}
          {job.interviews && job.interviews.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Interviews</h2>
              <div className="space-y-4">
                {job.interviews.map((interview, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium capitalize">{interview.type} Interview</h3>
                      <span className="text-sm text-gray-500">
                        {format(new Date(interview.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    {interview.notes && (
                      <p className="text-gray-600 text-sm">{interview.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offer Details */}
          {job.offer && job.offer.base && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Offer Details</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Base Salary:</span>
                  <span className="font-medium">${job.offer.base.toLocaleString()} {job.offer.currency}</span>
                </div>
                {job.offer.bonus && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Bonus:</span>
                    <span className="font-medium">${job.offer.bonus.toLocaleString()}</span>
                  </div>
                )}
                {job.offer.equity && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Equity:</span>
                    <span className="font-medium">{job.offer.equity}</span>
                  </div>
                )}
                {job.offer.benefits && (
                  <div>
                    <span className="text-gray-600">Benefits:</span>
                    <p className="font-medium mt-1">{job.offer.benefits}</p>
                  </div>
                )}
                {job.offer.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{format(new Date(job.offer.startDate), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to={`/jobs/${job._id}/edit`}
                className="btn btn-primary w-full"
              >
                <Edit className="h-4 w-4" />
                Edit Job
              </Link>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
              >
                <ExternalLink className="h-4 w-4" />
                View Job Posting
              </a>
            </div>
          </div>

          {/* Job Timeline */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Applied</p>
                  <p className="text-xs text-gray-500">{format(new Date(job.dateApplied), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              {job.interviews && job.interviews.map((interview, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium capitalize">{interview.type} Interview</p>
                    <p className="text-xs text-gray-500">{format(new Date(interview.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              ))}
              {job.offer && job.offer.base && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Offer Received</p>
                    <p className="text-xs text-gray-500">${job.offer.base.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;




