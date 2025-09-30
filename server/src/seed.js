import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';

dotenv.config();

const sampleJobs = [
  {
    position: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    salary: {
      amount: 120000,
      currency: 'USD'
    },
    link: 'https://techcorp.com/careers/senior-developer',
    status: 'interviewing',
    location: 'San Francisco, CA',
    type: 'full_time',
    source: 'LinkedIn',
    dateApplied: new Date('2024-01-15'),
    deadline: new Date('2024-02-15'),
    followUpOn: new Date('2024-01-25'),
    priority: 'high',
    tags: ['React', 'Node.js', 'MongoDB', 'AWS'],
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@techcorp.com',
    nextAction: 'Technical interview scheduled for next week',
    notes: 'Great company culture, remote work available',
    interviews: [
      {
        type: 'phone',
        date: new Date('2024-01-20'),
        notes: 'Initial phone screening went well'
      },
      {
        type: 'tech',
        date: new Date('2024-01-30'),
        notes: 'Technical interview scheduled'
      }
    ],
    attachments: {
      resumeUrl: '/uploads/resume_techcorp.pdf',
      coverLetterUrl: '/uploads/cover_techcorp.pdf'
    }
  },
  {
    position: 'Frontend Developer',
    company: 'StartupXYZ',
    salary: {
      amount: 85000,
      currency: 'USD'
    },
    link: 'https://startupxyz.com/jobs/frontend-dev',
    status: 'applied',
    location: 'Remote',
    type: 'full_time',
    source: 'Company Website',
    dateApplied: new Date('2024-01-10'),
    priority: 'medium',
    tags: ['React', 'TypeScript', 'CSS'],
    contactName: 'Mike Chen',
    contactEmail: 'mike@startupxyz.com',
    nextAction: 'Waiting for response',
    notes: 'Small startup, equity options available'
  },
  {
    position: 'Software Engineer Intern',
    company: 'BigTech Corp',
    salary: {
      amount: 6000,
      currency: 'USD'
    },
    link: 'https://bigtech.com/internships',
    status: 'offered',
    location: 'Seattle, WA',
    type: 'intern',
    source: 'University Career Fair',
    dateApplied: new Date('2024-01-05'),
    priority: 'high',
    tags: ['Python', 'Machine Learning', 'Internship'],
    contactName: 'Dr. Emily Rodriguez',
    contactEmail: 'emily.rodriguez@bigtech.com',
    nextAction: 'Review offer details',
    notes: 'Summer internship program',
    offer: {
      base: 6000,
      currency: 'USD',
      bonus: 1000,
      equity: 'Stock options',
      benefits: 'Health insurance, housing stipend',
      startDate: new Date('2024-06-01')
    }
  },
  {
    position: 'DevOps Engineer',
    company: 'CloudSolutions Ltd',
    salary: {
      amount: 110000,
      currency: 'USD'
    },
    link: 'https://cloudsolutions.com/careers/devops',
    status: 'rejected',
    location: 'Austin, TX',
    type: 'full_time',
    source: 'Referral',
    dateApplied: new Date('2024-01-08'),
    priority: 'medium',
    tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    contactName: 'Alex Thompson',
    contactEmail: 'alex.thompson@cloudsolutions.com',
    nextAction: 'Apply to similar positions',
    notes: 'Position filled internally'
  },
  {
    position: 'Backend Developer',
    company: 'FinTech Startup',
    salary: {
      amount: 95000,
      currency: 'USD'
    },
    link: 'https://fintech-startup.com/jobs/backend',
    status: 'applied',
    location: 'New York, NY',
    type: 'contract',
    source: 'Indeed',
    dateApplied: new Date('2024-01-12'),
    deadline: new Date('2024-02-01'),
    priority: 'low',
    tags: ['Node.js', 'PostgreSQL', 'Microservices'],
    contactName: 'Jennifer Lee',
    contactEmail: 'jennifer@fintech-startup.com',
    nextAction: 'Follow up next week',
    notes: '6-month contract with possibility of extension'
  },
  {
    position: 'Product Manager',
    company: 'Innovation Labs',
    salary: {
      amount: 130000,
      currency: 'USD'
    },
    link: 'https://innovationlabs.com/careers/pm',
    status: 'interviewing',
    location: 'Boston, MA',
    type: 'full_time',
    source: 'AngelList',
    dateApplied: new Date('2024-01-18'),
    priority: 'high',
    tags: ['Product Management', 'Agile', 'User Research'],
    contactName: 'David Park',
    contactEmail: 'david.park@innovationlabs.com',
    nextAction: 'Prepare for case study presentation',
    notes: 'Series A startup, exciting product roadmap',
    interviews: [
      {
        type: 'hr',
        date: new Date('2024-01-22'),
        notes: 'HR screening completed'
      },
      {
        type: 'onsite',
        date: new Date('2024-01-28'),
        notes: 'Onsite interview scheduled'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobtracker');
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert sample jobs
    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`Created ${createdJobs.length} sample jobs`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();



