import express from 'express';
import Job from '../models/Job.js';
import { validateJob, validateJobUpdate } from '../middleware/validation.js';
import { validateRequest } from '../middleware/errorHandler.js';
import { MongoClient } from 'mongodb';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with optional filtering and pagination
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      company,
      priority,
      type,
      sortBy = 'dateApplied',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (company) filter.company = new RegExp(company, 'i');
    if (priority) filter.priority = priority;
    if (type) filter.type = type;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await Job.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Public
router.post('/', validateJob, validateRequest, async (req, res, next) => {
  try {
    const job = new Job(req.body);
    await job.save();

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Public
router.put('/:id', validateJobUpdate, validateRequest, async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job,
      message: 'Job updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Public
router.delete('/:id', async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/jobs/stats/summary
// @desc    Get job application statistics
// @access  Public
router.get('/stats/summary', async (req, res, next) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalJobs = await Job.countDocuments();
    const recentJobs = await Job.countDocuments({
      dateApplied: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const statusCounts = {};
    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        totalJobs,
        recentJobs,
        statusCounts
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;


