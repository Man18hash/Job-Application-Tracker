import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['phone', 'tech', 'onsite', 'hr', 'other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
});

const offerSchema = new mongoose.Schema({
  base: {
    type: String,
    trim: true,
    default: ''
  },
  currency: {
    type: String,
    default: 'USD'
  },
  bonus: {
    type: String,
    default: ''
  },
  equity: {
    type: String,
    default: ''
  },
  benefits: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date
  }
});

const attachmentsSchema = new mongoose.Schema({
  resumeUrl: {
    type: String,
    default: ''
  },
  coverLetterUrl: {
    type: String,
    default: ''
  }
});

const jobSchema = new mongoose.Schema({
  position: String,
  company: String,
  salary: mongoose.Schema.Types.Mixed,
  link: String,
  status: String
});

// Basic schema without complex features

export default mongoose.model('Job', jobSchema);



