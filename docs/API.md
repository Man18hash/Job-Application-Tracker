# Job Tracker API Documentation

## Overview

The Job Tracker API is a RESTful service built with Node.js, Express.js, and MongoDB. It provides endpoints for managing job applications with comprehensive validation, error handling, and security features.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. In a production environment, you would implement JWT-based authentication.

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers

## Error Handling

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Endpoints

### Jobs

#### Get All Jobs
```http
GET /api/jobs
```

**Query Parameters:**
- `status` (string, optional): Filter by job status
- `priority` (string, optional): Filter by priority level
- `type` (string, optional): Filter by job type
- `search` (string, optional): Search by company name
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of jobs per page (default: 10)
- `sort` (string, optional): Sort field (default: 'dateApplied')
- `order` (string, optional): Sort order ('asc' or 'desc', default: 'desc')

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "position": "Software Engineer",
      "company": "Tech Corp",
      "salary": {
        "amount": 100000,
        "currency": "USD"
      },
      "link": "https://techcorp.com/jobs/software-engineer",
      "status": "applied",
      "priority": "high",
      "location": "San Francisco, CA",
      "type": "full_time",
      "dateApplied": "2024-01-15T00:00:00.000Z",
      "source": "LinkedIn",
      "tags": ["React", "Node.js", "MongoDB"],
      "notes": "Great opportunity with interesting projects",
      "nextAction": "Follow up next week",
      "contactName": "John Smith",
      "contactEmail": "john@techcorp.com",
      "deadline": "2024-02-15T00:00:00.000Z",
      "followUpOn": "2024-01-22T00:00:00.000Z",
      "interviews": [
        {
          "type": "phone",
          "date": "2024-01-20T00:00:00.000Z",
          "notes": "Initial screening call"
        }
      ],
      "offer": {
        "base": 100000,
        "bonus": 10000,
        "equity": "0.1%",
        "benefits": "Health, dental, vision, 401k",
        "currency": "USD",
        "startDate": "2024-03-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalJobs": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### Get Single Job
```http
GET /api/jobs/:id
```

**Parameters:**
- `id` (string, required): Job ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "position": "Software Engineer",
    "company": "Tech Corp",
    "salary": {
      "amount": 100000,
      "currency": "USD"
    },
    "link": "https://techcorp.com/jobs/software-engineer",
    "status": "applied",
    "priority": "high",
    "location": "San Francisco, CA",
    "type": "full_time",
    "dateApplied": "2024-01-15T00:00:00.000Z",
    "source": "LinkedIn",
    "tags": ["React", "Node.js", "MongoDB"],
    "notes": "Great opportunity with interesting projects",
    "nextAction": "Follow up next week",
    "contactName": "John Smith",
    "contactEmail": "john@techcorp.com",
    "deadline": "2024-02-15T00:00:00.000Z",
    "followUpOn": "2024-01-22T00:00:00.000Z",
    "interviews": [
      {
        "type": "phone",
        "date": "2024-01-20T00:00:00.000Z",
        "notes": "Initial screening call"
      }
    ],
    "offer": {
      "base": 100000,
      "bonus": 10000,
      "equity": "0.1%",
      "benefits": "Health, dental, vision, 401k",
      "currency": "USD",
      "startDate": "2024-03-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Create New Job
```http
POST /api/jobs
```

**Request Body:**
```json
{
  "position": "Software Engineer",
  "company": "Tech Corp",
  "salary": {
    "amount": 100000,
    "currency": "USD"
  },
  "link": "https://techcorp.com/jobs/software-engineer",
  "status": "applied",
  "priority": "high",
  "location": "San Francisco, CA",
  "type": "full_time",
  "dateApplied": "2024-01-15T00:00:00.000Z",
  "source": "LinkedIn",
  "tags": ["React", "Node.js", "MongoDB"],
  "notes": "Great opportunity with interesting projects",
  "nextAction": "Follow up next week",
  "contactName": "John Smith",
  "contactEmail": "john@techcorp.com",
  "deadline": "2024-02-15T00:00:00.000Z",
  "followUpOn": "2024-01-22T00:00:00.000Z",
  "interviews": [
    {
      "type": "phone",
      "date": "2024-01-20T00:00:00.000Z",
      "notes": "Initial screening call"
    }
  ],
  "offer": {
    "base": 100000,
    "bonus": 10000,
    "equity": "0.1%",
    "benefits": "Health, dental, vision, 401k",
    "currency": "USD",
    "startDate": "2024-03-01T00:00:00.000Z"
  }
}
```

**Required Fields:**
- `position` (string): Job position title
- `company` (string): Company name
- `salary.amount` (number): Salary amount (must be positive)
- `salary.currency` (string): Currency code (e.g., "USD", "EUR")
- `link` (string): Job posting URL
- `status` (string): Application status

**Optional Fields:**
- `priority` (string): Priority level ("low", "medium", "high")
- `location` (string): Job location
- `type` (string): Job type ("full_time", "part_time", "contract", "intern", "other")
- `dateApplied` (string): Application date (ISO 8601)
- `source` (string): Application source
- `tags` (array): Array of tag strings
- `notes` (string): Additional notes
- `nextAction` (string): Next action to take
- `contactName` (string): Contact person name
- `contactEmail` (string): Contact email
- `deadline` (string): Application deadline (ISO 8601)
- `followUpOn` (string): Follow-up date (ISO 8601)
- `interviews` (array): Interview details
- `offer` (object): Offer details

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "position": "Software Engineer",
    "company": "Tech Corp",
    "salary": {
      "amount": 100000,
      "currency": "USD"
    },
    "link": "https://techcorp.com/jobs/software-engineer",
    "status": "applied",
    "priority": "high",
    "location": "San Francisco, CA",
    "type": "full_time",
    "dateApplied": "2024-01-15T00:00:00.000Z",
    "source": "LinkedIn",
    "tags": ["React", "Node.js", "MongoDB"],
    "notes": "Great opportunity with interesting projects",
    "nextAction": "Follow up next week",
    "contactName": "John Smith",
    "contactEmail": "john@techcorp.com",
    "deadline": "2024-02-15T00:00:00.000Z",
    "followUpOn": "2024-01-22T00:00:00.000Z",
    "interviews": [
      {
        "type": "phone",
        "date": "2024-01-20T00:00:00.000Z",
        "notes": "Initial screening call"
      }
    ],
    "offer": {
      "base": 100000,
      "bonus": 10000,
      "equity": "0.1%",
      "benefits": "Health, dental, vision, 401k",
      "currency": "USD",
      "startDate": "2024-03-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Job created successfully"
}
```

#### Update Job
```http
PUT /api/jobs/:id
```

**Parameters:**
- `id` (string, required): Job ID

**Request Body:** Same as create job, but all fields are optional

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "position": "Software Engineer",
    "company": "Tech Corp",
    "salary": {
      "amount": 100000,
      "currency": "USD"
    },
    "link": "https://techcorp.com/jobs/software-engineer",
    "status": "interviewing",
    "priority": "high",
    "location": "San Francisco, CA",
    "type": "full_time",
    "dateApplied": "2024-01-15T00:00:00.000Z",
    "source": "LinkedIn",
    "tags": ["React", "Node.js", "MongoDB"],
    "notes": "Great opportunity with interesting projects",
    "nextAction": "Follow up next week",
    "contactName": "John Smith",
    "contactEmail": "john@techcorp.com",
    "deadline": "2024-02-15T00:00:00.000Z",
    "followUpOn": "2024-01-22T00:00:00.000Z",
    "interviews": [
      {
        "type": "phone",
        "date": "2024-01-20T00:00:00.000Z",
        "notes": "Initial screening call"
      }
    ],
    "offer": {
      "base": 100000,
      "bonus": 10000,
      "equity": "0.1%",
      "benefits": "Health, dental, vision, 401k",
      "currency": "USD",
      "startDate": "2024-03-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Job updated successfully"
}
```

#### Delete Job
```http
DELETE /api/jobs/:id
```

**Parameters:**
- `id` (string, required): Job ID

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

### Statistics

#### Get Job Statistics
```http
GET /api/jobs/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 25,
    "statusCounts": {
      "applied": 10,
      "interviewing": 8,
      "offered": 3,
      "rejected": 3,
      "withdrawn": 1,
      "accepted": 0
    },
    "priorityCounts": {
      "low": 5,
      "medium": 15,
      "high": 5
    },
    "typeCounts": {
      "full_time": 20,
      "part_time": 3,
      "contract": 2,
      "intern": 0,
      "other": 0
    },
    "averageSalary": 95000,
    "salaryRange": {
      "min": 60000,
      "max": 150000
    },
    "recentActivity": {
      "lastWeek": 5,
      "lastMonth": 15
    }
  }
}
```

### Health Check

#### API Health Status
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## Data Models

### Job Status Values
- `applied`: Application submitted
- `interviewing`: In interview process
- `offered`: Job offer received
- `rejected`: Application rejected
- `withdrawn`: Application withdrawn
- `accepted`: Offer accepted

### Priority Levels
- `low`: Low priority
- `medium`: Medium priority
- `high`: High priority

### Job Types
- `full_time`: Full-time position
- `part_time`: Part-time position
- `contract`: Contract position
- `intern`: Internship
- `other`: Other type

### Interview Types
- `phone`: Phone interview
- `video`: Video interview
- `in_person`: In-person interview
- `technical`: Technical interview
- `behavioral`: Behavioral interview
- `panel`: Panel interview

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Examples

### cURL Examples

#### Get all jobs
```bash
curl -X GET "http://localhost:5000/api/jobs" \
  -H "Content-Type: application/json"
```

#### Create a new job
```bash
curl -X POST "http://localhost:5000/api/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Software Engineer",
    "company": "Tech Corp",
    "salary": {
      "amount": 100000,
      "currency": "USD"
    },
    "link": "https://techcorp.com/jobs/software-engineer",
    "status": "applied"
  }'
```

#### Update a job
```bash
curl -X PUT "http://localhost:5000/api/jobs/64a1b2c3d4e5f6789012345" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "interviewing",
    "priority": "high",
    "notes": "Phone interview scheduled for next week"
  }'
```

#### Delete a job
```bash
curl -X DELETE "http://localhost:5000/api/jobs/64a1b2c3d4e5f6789012345" \
  -H "Content-Type: application/json"
```

### JavaScript Examples

#### Using Fetch API
```javascript
// Get all jobs
const response = await fetch('http://localhost:5000/api/jobs');
const data = await response.json();

// Create a new job
const newJob = await fetch('http://localhost:5000/api/jobs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    position: 'Software Engineer',
    company: 'Tech Corp',
    salary: {
      amount: 100000,
      currency: 'USD'
    },
    link: 'https://techcorp.com/jobs/software-engineer',
    status: 'applied'
  })
});
```

#### Using Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all jobs
const jobs = await api.get('/jobs');

// Create a new job
const newJob = await api.post('/jobs', {
  position: 'Software Engineer',
  company: 'Tech Corp',
  salary: {
    amount: 100000,
    currency: 'USD'
  },
  link: 'https://techcorp.com/jobs/software-engineer',
  status: 'applied'
});
```

## Rate Limiting Headers

When rate limiting is in effect, the following headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for the following origins:
- `http://localhost:3000` (development)
- `http://localhost:5173` (Vite dev server)

## Security Headers

The API includes security headers via Helmet.js:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
