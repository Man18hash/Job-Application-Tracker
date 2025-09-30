import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../src/server.js'
import Job from '../src/models/Job.js'

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  await Job.deleteMany({})
})

describe('Job API Endpoints', () => {
  describe('GET /api/jobs', () => {
    test('should get all jobs', async () => {
      // Create test jobs
      const job1 = new Job({
        position: 'Software Engineer',
        company: 'Tech Corp',
        salary: { amount: 100000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
      })

      const job2 = new Job({
        position: 'Frontend Developer',
        company: 'Web Inc',
        salary: { amount: 90000, currency: 'USD' },
        link: 'https://webinc.com/jobs',
        status: 'interviewing'
      })

      await job1.save()
      await job2.save()

      const response = await request(app)
        .get('/api/jobs')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0].position).toBe('Software Engineer')
      expect(response.body.data[1].position).toBe('Frontend Developer')
    })

    test('should filter jobs by status', async () => {
      const job1 = new Job({
        position: 'Software Engineer',
        company: 'Tech Corp',
        salary: { amount: 100000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
      })

      const job2 = new Job({
        position: 'Frontend Developer',
        company: 'Web Inc',
        salary: { amount: 90000, currency: 'USD' },
        link: 'https://webinc.com/jobs',
        status: 'interviewing'
      })

      await job1.save()
      await job2.save()

      const response = await request(app)
        .get('/api/jobs?status=applied')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].status).toBe('applied')
    })

    test('should search jobs by company name', async () => {
      const job1 = new Job({
        position: 'Software Engineer',
        company: 'Tech Corp',
        salary: { amount: 100000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
      })

      const job2 = new Job({
        position: 'Frontend Developer',
        company: 'Web Inc',
        salary: { amount: 90000, currency: 'USD' },
        link: 'https://webinc.com/jobs',
        status: 'applied'
      })

      await job1.save()
      await job2.save()

      const response = await request(app)
        .get('/api/jobs?search=Tech')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].company).toBe('Tech Corp')
    })
  })

  describe('POST /api/jobs', () => {
    test('should create a new job', async () => {
      const jobData = {
        position: 'Software Engineer',
        company: 'Tech Corp',
        salary: { amount: 100000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
      }

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.position).toBe('Software Engineer')
      expect(response.body.data.company).toBe('Tech Corp')
      expect(response.body.data.salary.amount).toBe(100000)
    })

    test('should validate required fields', async () => {
      const invalidJobData = {
        company: 'Tech Corp',
        salary: { amount: 100000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
        // Missing position field
      }

      const response = await request(app)
        .post('/api/jobs')
        .send(invalidJobData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Position is required')
    })

    test('should validate salary amount', async () => {
      const invalidJobData = {
        position: 'Software Engineer',
        company: 'Tech Corp',
        salary: { amount: -1000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
      }

      const response = await request(app)
        .post('/api/jobs')
        .send(invalidJobData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Salary amount must be positive')
    })
  })

  describe('GET /api/jobs/:id', () => {
    test('should get a single job by ID', async () => {
      const job = new Job({
        position: 'Software Engineer',
        company: 'Tech Corp',
        salary: { amount: 100000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
      })

      await job.save()

      const response = await request(app)
        .get(`/api/jobs/${job._id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.position).toBe('Software Engineer')
      expect(response.body.data.company).toBe('Tech Corp')
    })

    test('should return 404 for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .get(`/api/jobs/${fakeId}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Job not found')
    })

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/jobs/invalid-id')
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid job ID')
    })
  })

  describe('PUT /api/jobs/:id', () => {
    test('should update a job', async () => {
      const job = new Job({
        position: 'Software Engineer',
        company: 'Tech Corp',
        salary: { amount: 100000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
      })

      await job.save()

      const updateData = {
        status: 'interviewing',
        priority: 'high',
        notes: 'Phone interview scheduled'
      }

      const response = await request(app)
        .put(`/api/jobs/${job._id}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe('interviewing')
      expect(response.body.data.priority).toBe('high')
      expect(response.body.data.notes).toBe('Phone interview scheduled')
    })

    test('should return 404 for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .put(`/api/jobs/${fakeId}`)
        .send({ status: 'interviewing' })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Job not found')
    })
  })

  describe('DELETE /api/jobs/:id', () => {
    test('should delete a job', async () => {
      const job = new Job({
        position: 'Software Engineer',
        company: 'Tech Corp',
        salary: { amount: 100000, currency: 'USD' },
        link: 'https://techcorp.com/jobs',
        status: 'applied'
      })

      await job.save()

      const response = await request(app)
        .delete(`/api/jobs/${job._id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Job deleted successfully')

      // Verify job is deleted
      const deletedJob = await Job.findById(job._id)
      expect(deletedJob).toBeNull()
    })

    test('should return 404 for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .delete(`/api/jobs/${fakeId}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Job not found')
    })
  })

  describe('GET /api/jobs/stats/summary', () => {
    test('should get job statistics', async () => {
      // Create jobs with different statuses
      const jobs = [
        { position: 'Engineer 1', company: 'Corp 1', salary: { amount: 100000, currency: 'USD' }, link: 'https://corp1.com', status: 'applied' },
        { position: 'Engineer 2', company: 'Corp 2', salary: { amount: 110000, currency: 'USD' }, link: 'https://corp2.com', status: 'applied' },
        { position: 'Engineer 3', company: 'Corp 3', salary: { amount: 120000, currency: 'USD' }, link: 'https://corp3.com', status: 'interviewing' },
        { position: 'Engineer 4', company: 'Corp 4', salary: { amount: 130000, currency: 'USD' }, link: 'https://corp4.com', status: 'offered' },
        { position: 'Engineer 5', company: 'Corp 5', salary: { amount: 140000, currency: 'USD' }, link: 'https://corp5.com', status: 'rejected' }
      ]

      await Job.insertMany(jobs)

      const response = await request(app)
        .get('/api/jobs/stats/summary')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.totalJobs).toBe(5)
      expect(response.body.data.statusCounts.applied).toBe(2)
      expect(response.body.data.statusCounts.interviewing).toBe(1)
      expect(response.body.data.statusCounts.offered).toBe(1)
      expect(response.body.data.statusCounts.rejected).toBe(1)
      expect(response.body.data.averageSalary).toBe(120000)
    })
  })

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('API is healthy')
      expect(response.body.timestamp).toBeDefined()
    })
  })
})
