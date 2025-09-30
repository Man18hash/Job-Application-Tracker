import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { jobAPI } from '../services/api';

const JobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    position: '',
    company: '',
    salary: {
      amount: '',
      currency: 'USD'
    },
    link: '',
    status: 'applied',
    location: '',
    type: 'full_time',
    source: '',
    dateApplied: new Date().toISOString().split('T')[0],
    deadline: '',
    followUpOn: '',
    priority: 'medium',
    tags: [],
    contactName: '',
    contactEmail: '',
    nextAction: '',
    notes: '',
    interviews: [],
    offer: {
      base: '',
      currency: 'USD',
      bonus: '',
      equity: '',
      benefits: '',
      startDate: ''
    },
    attachments: {
      resumeUrl: '',
      coverLetterUrl: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchJob();
    }
  }, [id, isEdit]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJob(id);
      const job = response.data.data;
      
      // Format dates for input fields
      const formattedJob = {
        ...job,
        dateApplied: job.dateApplied ? new Date(job.dateApplied).toISOString().split('T')[0] : '',
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        followUpOn: job.followUpOn ? new Date(job.followUpOn).toISOString().split('T')[0] : '',
        offer: {
          ...job.offer,
          startDate: job.offer?.startDate ? new Date(job.offer.startDate).toISOString().split('T')[0] : ''
        }
      };
      
      setFormData(formattedJob);
    } catch (err) {
      setError('Failed to load job details');
      console.error('Fetch job error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleInterviewAdd = () => {
    setFormData(prev => ({
      ...prev,
      interviews: [...prev.interviews, {
        type: 'phone',
        date: '',
        notes: ''
      }]
    }));
  };

  const handleInterviewChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      interviews: prev.interviews.map((interview, i) => 
        i === index ? { ...interview, [field]: value } : interview
      )
    }));
  };

  const handleInterviewRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      interviews: prev.interviews.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        salary: {
          amount: formData.salary.amount,
          currency: formData.salary.currency
        },
        dateApplied: formData.dateApplied ? new Date(formData.dateApplied).toISOString() : new Date().toISOString(),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        followUpOn: formData.followUpOn ? new Date(formData.followUpOn).toISOString() : null,
        interviews: formData.interviews.length > 0 ? formData.interviews.map(interview => ({
          ...interview,
          date: interview.date ? new Date(interview.date).toISOString() : new Date().toISOString()
        })) : [],
        offer: formData.offer.base || formData.offer.bonus || formData.offer.equity || formData.offer.benefits || formData.offer.startDate ? {
          base: formData.offer.base || '',
          bonus: formData.offer.bonus || '',
          equity: formData.offer.equity || '',
          benefits: formData.offer.benefits || '',
          currency: formData.offer.currency || 'USD',
          startDate: formData.offer.startDate ? new Date(formData.offer.startDate).toISOString() : null
        } : undefined,
      };

      if (isEdit) {
        await jobAPI.updateJob(id, submitData);
      } else {
        await jobAPI.createJob(submitData);
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="loading">
        <div className="text-gray-500">Loading job details...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Job' : 'Add New Job'}
        </h1>
        <button
          onClick={() => navigate('/')}
          className="btn btn-outline"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>

      {error && (
        <div className="error mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Link *</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., LinkedIn, Company Website"
              />
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Salary Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Salary Amount *</label>
              <input
                type="text"
                name="salary.amount"
                value={formData.salary.amount}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 50000, Negotiable, Competitive"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                name="salary.currency"
                value={formData.salary.currency}
                onChange={handleChange}
                className="form-select"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="PHP">PHP (Peso)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Application Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date Applied</label>
              <input
                type="date"
                name="dateApplied"
                value={formData.dateApplied}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Follow Up Date</label>
              <input
                type="date"
                name="followUpOn"
                value={formData.followUpOn}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Tags</h2>
          <div className="form-group">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="form-input"
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="btn btn-outline"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Notes & Next Action</h2>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Next Action</label>
              <input
                type="text"
                name="nextAction"
                value={formData.nextAction}
                onChange={handleChange}
                className="form-input"
                placeholder="What's the next step?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="Additional notes about this application..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : (isEdit ? 'Update Job' : 'Create Job')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;



