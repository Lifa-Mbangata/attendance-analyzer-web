import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../api';
import SummaryCard from './SummaryCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle } from 'lucide-react';

const DepartmentReports = ({ refreshTrigger }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, [refreshTrigger]);

  const loadDepartments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await reportsAPI.getDepartmentSummaries();
      setDepartments(data);
      if (data.length > 0) {
        setSelectedDept(data[0]);
      }
    } catch (err) {
      console.error('Error loading departments:', err);
      setError('Failed to load department data.');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    return departments.map((dept) => ({
      name: dept.entityName.replace('Department: ', ''),
      normal: dept.totalNormalMinutes,
      extra: dept.totalExtraMinutes,
      short: dept.totalShortMinutes,
      incidents: dept.totalIncidents || 0,
    }));
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
              onClick={loadDepartments}
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Reports</h2>

      {departments.length === 0 && !loading ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-900 mb-2">No department data available.</p>
          <p className="text-sm text-blue-700">Upload a CSV file to see department summaries.</p>
        </div>
      ) : (
        <>
          {/* Department Selector */}
          {departments.length > 1 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Department</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {departments.map((dept, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDept(dept)}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      selectedDept === dept
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dept.entityName.replace('Department: ', '')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Department Summary */}
          {selectedDept && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <SummaryCard
                title={selectedDept.entityName}
                summary={selectedDept}
                isLoading={loading}
              />

              {/* Additional Metrics */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Metrics</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded">
                      <p className="text-xs text-green-700 font-medium mb-1">Avg Normal Time</p>
                      <p className="text-xl font-bold text-green-900">
                        {(selectedDept.totalNormalMinutes / (departments.length || 1)).toFixed(0)} min
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded">
                      <p className="text-xs text-yellow-700 font-medium mb-1">Avg Short Time</p>
                      <p className="text-xl font-bold text-yellow-900">
                        {(selectedDept.totalShortMinutes / (departments.length || 1)).toFixed(0)} min
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded">
                      <p className="text-xs text-purple-700 font-medium mb-1">Avg Extra Time</p>
                      <p className="text-xl font-bold text-purple-900">
                        {(selectedDept.totalExtraMinutes / (departments.length || 1)).toFixed(0)} min
                      </p>
                    </div>
                  </div>
                </div>

                {selectedDept.totalIncidents > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents Summary</h3>
                    <p className="text-3xl font-bold text-red-600 mb-4">{selectedDept.totalIncidents}</p>
                    {selectedDept.incidentTypeCounts && (
                      <div className="space-y-2">
                        {Object.entries(selectedDept.incidentTypeCounts).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{type.replace(/_/g, ' ')}</span>
                            <span className="font-semibold text-gray-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comparison Chart */}
          {departments.length > 1 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={departments.length > 5 ? -45 : 0}
                    height={departments.length > 5 ? 80 : 30}
                  />
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
            </div>
          )}

          {/* All Departments Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Departments Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Normal Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Short Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Extra Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Incidents</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {dept.entityName.replace('Department: ', '')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {Math.floor(dept.totalNormalMinutes / 60)}h {dept.totalNormalMinutes % 60}m
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {Math.floor(dept.totalShortMinutes / 60)}h {dept.totalShortMinutes % 60}m
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {Math.floor(dept.totalExtraMinutes / 60)}h {dept.totalExtraMinutes % 60}m
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            dept.totalIncidents > 0
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {dept.totalIncidents || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DepartmentReports;
