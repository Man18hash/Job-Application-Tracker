import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target, PieChart, Activity } from 'lucide-react';
import { jobAPI } from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await jobAPI.getJobStats();
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Mock data for charts (in a real app, this would come from the API)
  const statusData = [
    { status: 'Applied', count: stats?.statusCounts?.applied || 0, color: '#3B82F6' },
    { status: 'Interviewing', count: stats?.statusCounts?.interviewing || 0, color: '#F59E0B' },
    { status: 'Offered', count: stats?.statusCounts?.offered || 0, color: '#10B981' },
    { status: 'Rejected', count: stats?.statusCounts?.rejected || 0, color: '#EF4444' },
    { status: 'Withdrawn', count: stats?.statusCounts?.withdrawn || 0, color: '#6B7280' },
    { status: 'Accepted', count: stats?.statusCounts?.accepted || 0, color: '#059669' },
  ];

  const monthlyData = [
    { month: 'Jan', applications: 12, interviews: 3, offers: 1 },
    { month: 'Feb', applications: 18, interviews: 5, offers: 2 },
    { month: 'Mar', applications: 15, interviews: 4, offers: 1 },
    { month: 'Apr', applications: 22, interviews: 6, offers: 3 },
    { month: 'May', applications: 19, interviews: 5, offers: 2 },
    { month: 'Jun', applications: 25, interviews: 7, offers: 4 },
  ];

  // Enhanced data for linear graph - total applications over time
  const weeklyApplicationData = [
    { week: 'Week 1', total: 5, cumulative: 5 },
    { week: 'Week 2', total: 8, cumulative: 13 },
    { week: 'Week 3', total: 12, cumulative: 25 },
    { week: 'Week 4', total: 15, cumulative: 40 },
    { week: 'Week 5', total: 18, cumulative: 58 },
    { week: 'Week 6', total: 22, cumulative: 80 },
    { week: 'Week 7', total: 19, cumulative: 99 },
    { week: 'Week 8', total: 25, cumulative: 124 },
    { week: 'Week 9', total: 28, cumulative: 152 },
    { week: 'Week 10', total: 31, cumulative: 183 },
    { week: 'Week 11', total: 24, cumulative: 207 },
    { week: 'Week 12', total: 29, cumulative: 236 },
  ];

  // Job type analysis data
  const jobTypeData = [
    { type: 'Full-time', count: 45, percentage: 35.2, color: '#3B82F6' },
    { type: 'Part-time', count: 18, percentage: 14.1, color: '#10B981' },
    { type: 'Contract', count: 32, percentage: 25.0, color: '#F59E0B' },
    { type: 'Intern', count: 15, percentage: 11.7, color: '#8B5CF6' },
    { type: 'Freelance', count: 12, percentage: 9.4, color: '#EF4444' },
    { type: 'Other', count: 6, percentage: 4.7, color: '#6B7280' },
  ];

  // Company size analysis
  const companySizeData = [
    { size: 'Startup (1-50)', count: 28, color: '#3B82F6' },
    { size: 'Small (51-200)', count: 35, color: '#10B981' },
    { size: 'Medium (201-1000)', count: 42, color: '#F59E0B' },
    { size: 'Large (1000+)', count: 23, color: '#8B5CF6' },
  ];

  // Application source analysis
  const sourceData = [
    { source: 'LinkedIn', count: 38, color: '#0077B5' },
    { source: 'Company Website', count: 25, color: '#3B82F6' },
    { source: 'Indeed', count: 22, color: '#2557A7' },
    { source: 'Referral', count: 18, color: '#10B981' },
    { source: 'Glassdoor', count: 15, color: '#0CAA41' },
    { source: 'Other', count: 10, color: '#6B7280' },
  ];

  const priorityData = [
    { priority: 'High', count: 8, color: '#EF4444' },
    { priority: 'Medium', count: 15, color: '#F59E0B' },
    { priority: 'Low', count: 12, color: '#10B981' },
  ];

  const SimpleBarChart = ({ data, title, maxValue }) => {
    const maxCount = maxValue || Math.max(...data.map(d => d.count));
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600">{item.status || item.priority}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="h-6 rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  >
                    <span className="text-white text-xs font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.flatMap(d => [d.applications, d.interviews, d.offers]));
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center space-y-1 mb-2">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(item.applications / maxValue) * 200}px` }}
                  title={`Applications: ${item.applications}`}
                ></div>
                <div
                  className="w-full bg-yellow-500"
                  style={{ height: `${(item.interviews / maxValue) * 200}px` }}
                  title={`Interviews: ${item.interviews}`}
                ></div>
                <div
                  className="w-full bg-green-500 rounded-b"
                  style={{ height: `${(item.offers / maxValue) * 200}px` }}
                  title={`Offers: ${item.offers}`}
                ></div>
              </div>
              <span className="text-xs text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Applications</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Interviews</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Offers</span>
          </div>
        </div>
      </div>
    );
  };

  const PieChartComponent = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const cumulativePercentage = data.slice(0, index).reduce((sum, d) => sum + (d.count / total) * 100, 0);
                const startAngle = (cumulativePercentage / 100) * 360;
                const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
                
                const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                
                const largeArcFlag = percentage > 50 ? 1 : 0;
                
                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.priority}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Linear Graph Component for Total Applications Over Time
  const LinearGraph = ({ data, title, dataKey }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    const minValue = Math.min(...data.map(d => d[dataKey]));
    const range = maxValue - minValue;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y, index) => (
              <line
                key={index}
                x1="40"
                y1={20 + (y / 100) * 160}
                x2="380"
                y2={20 + (y / 100) * 160}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((y, index) => (
              <text
                key={index}
                x="35"
                y={25 + (y / 100) * 160}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {Math.round(minValue + (range * (100 - y) / 100))}
              </text>
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              points={data.map((item, index) => {
                const x = 40 + (index / (data.length - 1)) * 340;
                const y = 20 + ((maxValue - item[dataKey]) / range) * 160;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = 40 + (index / (data.length - 1)) * 340;
              const y = 20 + ((maxValue - item[dataKey]) / range) * 160;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3B82F6"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* X-axis labels */}
            {data.map((item, index) => {
              const x = 40 + (index / (data.length - 1)) * 340;
              return (
                <text
                  key={index}
                  x={x}
                  y="195"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {item.week || item.month}
                </text>
              );
            })}
          </svg>
        </div>
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">
            Total Applications: <span className="font-semibold text-gray-900">{data[data.length - 1]?.[dataKey] || 0}</span>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Bar Chart Component for Job Types
  const JobTypeBarChart = ({ data, title }) => {
    const maxCount = Math.max(...data.map(d => d.count));
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm text-gray-600">{item.type}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="h-8 rounded-full flex items-center justify-between px-3"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  >
                    <span className="text-white text-sm font-medium">{item.count}</span>
                    <span className="text-white text-xs">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {data.length}
            </div>
            <div className="text-sm text-gray-600">Job Types</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-600">Track your job application progress and insights</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.statusCounts ? 
                  Math.round(((stats.statusCounts.accepted || 0) / stats.totalJobs) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interview Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.statusCounts ? 
                  Math.round(((stats.statusCounts.interviewing || 0) / stats.totalJobs) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats?.statusCounts?.applied || 0) + (stats?.statusCounts?.interviewing || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LinearGraph 
          data={weeklyApplicationData} 
          title="Total Applications Over Time (Weekly)" 
          dataKey="cumulative"
        />
        <JobTypeBarChart 
          data={jobTypeData} 
          title="Applications by Job Type" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart 
          data={statusData} 
          title="Applications by Status" 
          maxValue={Math.max(...statusData.map(d => d.count))}
        />
        <PieChartComponent 
          data={priorityData} 
          title="Applications by Priority" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={monthlyData} 
          title="Monthly Application Trends" 
        />
        <SimpleBarChart 
          data={companySizeData} 
          title="Applications by Company Size" 
          maxValue={Math.max(...companySizeData.map(d => d.count))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart 
          data={sourceData} 
          title="Applications by Source" 
          maxValue={Math.max(...sourceData.map(d => d.count))}
        />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Growth Rate</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600">+12%</span>
                <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600">+28%</span>
                <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Quarter</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600">+45%</span>
                <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Year</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600">+156%</span>
                <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Response Time</span>
              <span className="text-sm font-medium text-gray-900">5.2 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Best Application Day</span>
              <span className="text-sm font-medium text-gray-900">Tuesday</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Most Common Status</span>
              <span className="text-sm font-medium text-gray-900">Applied</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-medium text-gray-900">12.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Applications This Month</span>
              <span className="text-sm font-medium text-gray-900">+15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Interview Rate</span>
              <span className="text-sm font-medium text-gray-900">+8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Offer Rate</span>
              <span className="text-sm font-medium text-gray-900">+3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
