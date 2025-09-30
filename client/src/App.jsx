import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import JobList from './pages/JobList'
import JobForm from './pages/JobForm'
import JobDetails from './pages/JobDetails'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import AnalyticsVolume from './pages/AnalyticsVolume'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/new" element={<JobForm />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/edit" element={<JobForm />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics-volume" element={<AnalyticsVolume />} />
      </Routes>
    </Layout>
  )
}

export default App



