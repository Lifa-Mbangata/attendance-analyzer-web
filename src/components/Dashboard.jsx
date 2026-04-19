import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../api';
import SummaryCard from './SummaryCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Download } from 'lucide-react';
import { generateComprehensiveCSV, downloadCSV, generateCompanyIncidentReportCSV } from '../utils/csvExport';

const Dashboard = ({ refreshTrigger }) => {
  const [companySummary, setCompanySummary] = useState(null);
  const [departmentSummaries, setDepartmentSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [companySummaryData, departmentSummariesData] = await Promise.all([
        reportsAPI.getCompanySummary(),
        reportsAPI.getDepartmentSummaries(),
      ]);

      setCompanySummary(companySummaryData);
      setDepartmentSummaries(departmentSummariesData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentChartData = () => {
    return departmentSummaries.map((dept) => ({
      name: dept.entityName.replace('Department: ', ''),
      normal: dept.totalNormalMinutes,
      short: dept.totalShortMinutes,
      extra: dept.totalExtraMinutes,
    }));
  };

  const getIncidentChartData = () => {
    if (!companySummary?.incidentTypeCounts) return [];
    return Object.entries(companySummary.incidentTypeCounts).map(([type, count]) => ({
      name: type.replace(/_/g, ' '),
      value: count,
    }));
  };

  const handleDownloadCSV = () => {
    if (!companySummary) {
      alert('No data available to download');
      return;
    }

    const csvContent = generateComprehensiveCSV(companySummary, departmentSummaries);
    const filename = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleDownloadCompanyIncidentReport = async () => {
    if (!companySummary) {
      alert('No data available to download');
      return;
    }

    try {
      // Fetch company incident report endpoint if available
      const incidentReport = await reportsAPI.getCompanyIncidentReport?.();
      if (incidentReport) {
        const csvContent = generateCompanyIncidentReportCSV(incidentReport);
        const filename = `company-incident-report-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(csvContent, filename);
      } else {
        alert('Company incident report data not available yet. Please ensure the backend endpoint is available.');
      }
    } catch (err) {
      console.error('Error fetching company incident report:', err);
      alert('Error fetching company incident report. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle size={24} className="text-red-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Data</h3>
            <p className="text-sm text-red-800 mt-1">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Download Buttons */}
      {companySummary && (
        <div className="mb-8 flex justify-end gap-3">
          <button
            onClick={handleDownloadCompanyIncidentReport}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <Download size={20} />
            Company Incident Report CSV
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <Download size={20} />
            Download Report CSV
          </button>
        </div>
      )}

      {/* Company Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Overview</h2>
        <SummaryCard
          title="Company Wide Summary"
          summary={companySummary}
          isLoading={loading}
        />
      </div>

      {/* Department Summary Cards */}
      {departmentSummaries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Summaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentSummaries.slice(0, 6).map((dept, idx) => (
              <SummaryCard
                key={idx}
                title={dept.entityName}
                summary={dept}
                isLoading={loading}
                isCompact={true}
              />
            ))}
          </div>
          {departmentSummaries.length > 6 && (
            <p className="text-sm text-gray-600 mt-4">
              Showing 6 of {departmentSummaries.length} departments
            </p>
          )}
        </div>
      )}

      {/* Charts */}
      {departmentSummaries.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Time Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Time Distribution</h3>
            {getDepartmentChartData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getDepartmentChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                    formatter={(value) => `${value} min`}
                  />
                  <Legend />
                  <Bar dataKey="normal" stackId="a" fill="#10b981" name="Normal" />
                  <Bar dataKey="extra" stackId="a" fill="#8b5cf6" name="Extra" />
                  <Bar dataKey="short" stackId="a" fill="#f59e0b" name="Short" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No department data available</p>
            )}
          </div>

          {/* Incidents Distribution */}
          {getIncidentChartData().length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getIncidentChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getIncidentChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} incidents`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* No Data Message */}
      {!loading && !companySummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-900 mb-4">No attendance data available yet.</p>
          <p className="text-sm text-blue-700">Upload a CSV file to get started with attendance tracking and reporting.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
