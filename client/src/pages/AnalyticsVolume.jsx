import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Briefcase, Calendar, BarChart3, LineChart, PieChart, Activity } from 'lucide-react';
import { jobAPI } from '../services/api';

const AnalyticsVolume = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const statsResponse = await jobAPI.getJobStats();
        setStats(statsResponse.data.data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Mock data for comprehensive analytics (in a real app, this would come from the API)
  const applicationVolumeData = [
    { week: 'Week 1', applications: 8, interviews: 2, offers: 0 },
    { week: 'Week 2', applications: 12, interviews: 3, offers: 1 },
    { week: 'Week 3', applications: 15, interviews: 4, offers: 1 },
    { week: 'Week 4', applications: 18, interviews: 5, offers: 2 },
    { week: 'Week 5', applications: 22, interviews: 6, offers: 3 },
    { week: 'Week 6', applications: 25, interviews: 7, offers: 4 },
    { week: 'Week 7', applications: 20, interviews: 5, offers: 2 },
    { week: 'Week 8', applications: 28, interviews: 8, offers: 5 },
    { week: 'Week 9', applications: 32, interviews: 9, offers: 6 },
    { week: 'Week 10', applications: 35, interviews: 10, offers: 7 },
    { week: 'Week 11', applications: 30, interviews: 8, offers: 5 },
    { week: 'Week 12', applications: 38, interviews: 11, offers: 8 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', applications: 45, interviews: 12, offers: 3 },
    { month: 'Feb', applications: 52, interviews: 15, offers: 4 },
    { month: 'Mar', applications: 48, interviews: 14, offers: 5 },
    { month: 'Apr', applications: 65, interviews: 18, offers: 6 },
    { month: 'May', applications: 58, interviews: 16, offers: 7 },
    { month: 'Jun', applications: 72, interviews: 20, offers: 8 },
    { month: 'Jul', applications: 68, interviews: 19, offers: 9 },
    { month: 'Aug', applications: 75, interviews: 22, offers: 10 },
    { month: 'Sep', applications: 82, interviews: 25, offers: 12 },
    { month: 'Oct', applications: 78, interviews: 23, offers: 11 },
    { month: 'Nov', applications: 85, interviews: 26, offers: 13 },
    { month: 'Dec', applications: 90, interviews: 28, offers: 15 },
  ];

  const statusDistributionData = [
    { status: 'Applied', count: 156, color: '#3B82F6', percentage: 45.2 },
    { status: 'Interviewing', count: 89, color: '#F59E0B', percentage: 25.8 },
    { status: 'Offered', count: 45, color: '#10B981', percentage: 13.0 },
    { status: 'Rejected', count: 38, color: '#EF4444', percentage: 11.0 },
    { status: 'Withdrawn', count: 12, color: '#6B7280', percentage: 3.5 },
    { status: 'Accepted', count: 5, color: '#059669', percentage: 1.5 },
  ];

  const jobTypeVolumeData = [
    { type: 'Full-time', count: 198, color: '#3B82F6' },
    { type: 'Part-time', count: 45, color: '#10B981' },
    { type: 'Contract', count: 67, color: '#F59E0B' },
    { type: 'Intern', count: 23, color: '#8B5CF6' },
    { type: 'Freelance', count: 12, color: '#EF4444' },
  ];

  const companySizeData = [
    { size: 'Startup (1-50)', count: 78, color: '#3B82F6' },
    { size: 'Small (51-200)', count: 95, color: '#10B981' },
    { size: 'Medium (201-1000)', count: 112, color: '#F59E0B' },
    { size: 'Large (1000+)', count: 60, color: '#8B7280' },
  ];

  const sourceVolumeData = [
    { source: 'LinkedIn', count: 125, color: '#0077B5' },
    { source: 'Company Website', count: 89, color: '#3B82F6' },
    { source: 'Indeed', count: 67, color: '#2557A7' },
    { source: 'Referral', count: 45, color: '#10B981' },
    { source: 'Glassdoor', count: 23, color: '#0CAA41' },
    { source: 'Other', count: 6, color: '#6B7280' },
  ];

  // Chart Components
  const VolumeLineChart = ({ data, title, dataKey }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    const minValue = Math.min(...data.map(d => d[dataKey]));
    const range = maxValue - minValue;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-80 relative">
          <svg className="w-full h-full" viewBox="0 0 500 300">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y, index) => (
              <line
                key={index}
                x1="50"
                y1={30 + (y / 100) * 240}
                x2="480"
                y2={30 + (y / 100) * 240}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((y, index) => (
              <text
                key={index}
                x="45"
                y={35 + (y / 100) * 240}
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
                const x = 50 + (index / (data.length - 1)) * 430;
                const y = 30 + ((maxValue - item[dataKey]) / range) * 240;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = 50 + (index / (data.length - 1)) * 430;
              const y = 30 + ((maxValue - item[dataKey]) / range) * 240;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#3B82F6"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* X-axis labels */}
            {data.map((item, index) => {
              const x = 50 + (index / (data.length - 1)) * 430;
              return (
                <text
                  key={index}
                  x={x}
                  y="285"
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
            Peak Volume: <span className="font-semibold text-gray-900">{maxValue}</span>
          </div>
        </div>
      </div>
    );
  };

  const VolumeBarChart = ({ data, title, maxValue }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-end space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t-lg relative"
                style={{
                  height: `${(item.count / maxValue) * 100}%`,
                  backgroundColor: item.color,
                  minHeight: '20px'
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                  {item.count}
                </div>
              </div>
              <span className="mt-2 text-xs text-gray-600 text-center">{item.status || item.type || item.size || item.source}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold text-gray-900">{data.reduce((sum, item) => sum + item.count, 0)}</span>
          </div>
        </div>
      </div>
    );
  };

  const MultiLineChart = ({ data, title }) => {
    const maxApplications = Math.max(...data.map(d => d.applications));
    const maxInterviews = Math.max(...data.map(d => d.interviews));
    const maxOffers = Math.max(...data.map(d => d.offers));
    const overallMax = Math.max(maxApplications, maxInterviews, maxOffers);

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-80 relative">
          <svg className="w-full h-full" viewBox="0 0 500 300">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y, index) => (
              <line
                key={index}
                x1="50"
                y1={30 + (y / 100) * 240}
                x2="480"
                y2={30 + (y / 100) * 240}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((y, index) => (
              <text
                key={index}
                x="45"
                y={35 + (y / 100) * 240}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {Math.round(overallMax * (100 - y) / 100)}
              </text>
            ))}

            {/* Applications Line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              points={data.map((item, index) => {
                const x = 50 + (index / (data.length - 1)) * 430;
                const y = 30 + ((overallMax - item.applications) / overallMax) * 240;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Interviews Line */}
            <polyline
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
              points={data.map((item, index) => {
                const x = 50 + (index / (data.length - 1)) * 430;
                const y = 30 + ((overallMax - item.interviews) / overallMax) * 240;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Offers Line */}
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              points={data.map((item, index) => {
                const x = 50 + (index / (data.length - 1)) * 430;
                const y = 30 + ((overallMax - item.offers) / overallMax) * 240;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* X-axis labels */}
            {data.map((item, index) => {
              const x = 50 + (index / (data.length - 1)) * 430;
              return (
                <text
                  key={index}
                  x={x}
                  y="285"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {item.week || item.month}
                </text>
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 mt-2">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-blue-600 mr-2"></div>
              <span className="text-xs text-gray-600">Applications</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-yellow-600 mr-2"></div>
              <span className="text-xs text-gray-600">Interviews</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-green-600 mr-2"></div>
              <span className="text-xs text-gray-600">Offers</span>
            </div>
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
          <div className="relative w-64 h-64">
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
                <div className="text-3xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded mr-3" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.status || item.type || item.size || item.source}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
                <span className="text-xs text-gray-500 ml-2">({item.percentage || Math.round((item.count / total) * 100)}%)</span>
              </div>
            </div>
          ))}
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
      <div className="error">
        <AlertCircle className="h-5 w-5 inline mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application Volume Analytics</h1>
          <p className="mt-1 text-gray-600">Track your application volume and success metrics</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalJobs || 345}</p>
            <p className="text-sm text-green-600">+12% from last month</p>
          </div>
          <Activity className="h-8 w-8 text-blue-400" />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Interview Rate</p>
            <p className="text-3xl font-bold text-yellow-600">25.8%</p>
            <p className="text-sm text-green-600">+3% from last month</p>
          </div>
          <Calendar className="h-8 w-8 text-yellow-400" />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Offer Rate</p>
            <p className="text-3xl font-bold text-green-600">13.0%</p>
            <p className="text-sm text-green-600">+2% from last month</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-400" />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-3xl font-bold text-purple-600">1.5%</p>
            <p className="text-sm text-red-600">-0.5% from last month</p>
          </div>
          <Briefcase className="h-8 w-8 text-purple-400" />
        </div>
      </div>

      {/* Volume Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeLineChart 
          data={applicationVolumeData} 
          title="Weekly Application Volume" 
          dataKey="applications"
        />
        <MultiLineChart 
          data={applicationVolumeData} 
          title="Application Pipeline Flow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeLineChart 
          data={monthlyTrendData} 
          title="Monthly Application Trends" 
          dataKey="applications"
        />
        <PieChartComponent 
          data={statusDistributionData} 
          title="Application Status Distribution" 
        />
      </div>

      {/* Volume Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeBarChart 
          data={jobTypeVolumeData} 
          title="Applications by Job Type" 
          maxValue={Math.max(...jobTypeVolumeData.map(d => d.count))}
        />
        <VolumeBarChart 
          data={companySizeData} 
          title="Applications by Company Size" 
          maxValue={Math.max(...companySizeData.map(d => d.count))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeBarChart 
          data={sourceVolumeData} 
          title="Applications by Source" 
          maxValue={Math.max(...sourceVolumeData.map(d => d.count))}
        />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Peak Application Week</span>
              <span className="text-lg font-semibold text-blue-600">Week 12 (38 apps)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Best Interview Week</span>
              <span className="text-lg font-semibold text-green-600">Week 10 (10 interviews)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm text-gray-700">Highest Offer Week</span>
              <span className="text-lg font-semibold text-yellow-600">Week 12 (8 offers)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-700">Average Weekly Volume</span>
              <span className="text-lg font-semibold text-purple-600">24 applications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Applications per Day</span>
              <span className="text-lg font-semibold text-gray-900">3.4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Applications per Week</span>
              <span className="text-lg font-semibold text-gray-900">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Applications per Month</span>
              <span className="text-lg font-semibold text-gray-900">104</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-lg font-semibold text-gray-900">4.3%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Trends</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Weekly Growth</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600">+8%</span>
                <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Growth</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600">+15%</span>
                <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quarterly Growth</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600">+32%</span>
                <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Yearly Growth</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-green-600">+156%</span>
                <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsVolume;

