import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import JobDetails from '../pages/JobDetails'
import { jobAPI } from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  jobAPI: {
    getJob: vi.fn(),
    deleteJob: vi.fn()
  }
}))

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date) => 'Jan 01, 2024')
}))

const mockJob = {
  _id: '1',
  position: 'Software Engineer',
  company: 'Tech Corp',
  salary: { amount: 100000, currency: 'USD' },
  link: 'https://techcorp.com/jobs',
  status: 'applied',
  priority: 'high',
  location: 'San Francisco, CA',
  type: 'full_time',
  dateApplied: '2024-01-01',
  source: 'LinkedIn',
  tags: ['React', 'Node.js'],
  notes: 'Great opportunity',
  nextAction: 'Follow up next week'
}

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('JobDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    jobAPI.getJob.mockResolvedValue({ data: { data: mockJob } })
  })

  test('renders job details correctly', async () => {
    renderWithRouter(<JobDetails />)

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
      expect(screen.getByText('Tech Corp')).toBeInTheDocument()
      expect(screen.getByText('$100,000 USD')).toBeInTheDocument()
      expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
    })
  })

  test('displays status and priority badges', async () => {
    renderWithRouter(<JobDetails />)

    await waitFor(() => {
      expect(screen.getByText('applied')).toBeInTheDocument()
      expect(screen.getByText('high priority')).toBeInTheDocument()
    })
  })

  test('shows loading state initially', () => {
    jobAPI.getJob.mockImplementation(() => new Promise(() => {}))
    
    renderWithRouter(<JobDetails />)
    
    expect(screen.getByText('Loading job details...')).toBeInTheDocument()
  })

  test('handles delete action', async () => {
    const mockNavigate = vi.fn()
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useNavigate: () => mockNavigate
      }
    })

    jobAPI.deleteJob.mockResolvedValue({})
    
    renderWithRouter(<JobDetails />)

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    })

    // Mock window.confirm
    window.confirm = vi.fn(() => true)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this job?')
    expect(jobAPI.deleteJob).toHaveBeenCalledWith('1')
  })

  test('displays error message on API failure', async () => {
    jobAPI.getJob.mockRejectedValue(new Error('API Error'))
    
    renderWithRouter(<JobDetails />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load job details')).toBeInTheDocument()
    })
  })

  test('renders job link correctly', async () => {
    renderWithRouter(<JobDetails />)

    await waitFor(() => {
      const link = screen.getByText('View Job Posting')
      expect(link).toHaveAttribute('href', 'https://techcorp.com/jobs')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  test('displays tags correctly', async () => {
    renderWithRouter(<JobDetails />)

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })
  })

  test('shows notes and next action', async () => {
    renderWithRouter(<JobDetails />)

    await waitFor(() => {
      expect(screen.getByText('Great opportunity')).toBeInTheDocument()
      expect(screen.getByText('Follow up next week')).toBeInTheDocument()
    })
  })
})
