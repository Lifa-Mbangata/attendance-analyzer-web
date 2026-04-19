import React, { useState, useEffect } from 'react';
import { reportsAPI, attendanceAPI } from '../api';
import SummaryCard from './SummaryCard';
import IncidentCalendar from './IncidentCalendar';
import { AlertCircle, Search, Download, Calendar } from 'lucide-react';
import { generateEmployeeDetailedCSV, downloadCSV, escapeCSVField, formatMinutesForCSV } from '../utils/csvExport';

const EmployeeReports = ({ refreshTrigger }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeSummary, setEmployeeSummary] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEmployees();
  }, [refreshTrigger]);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load company data to get unique employees
      const companySummary = await reportsAPI.getCompanySummary();
      // We'll set up a dummy employees list - in a real scenario, this would come from an employee list endpoint
      setEmployees([]);
      setSelectedEmployee(null);
      setEmployeeSummary(null);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError('Failed to load employee data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSearch = async (employeeId) => {
    if (!employeeId.trim()) {
      setSelectedEmployee(null);
      setEmployeeSummary(null);
      setIncidents([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const summary = await reportsAPI.getEmployeeSummary(employeeId);
      if (summary && summary.entityName) {
        setSelectedEmployee(employeeId);
        setEmployeeSummary(summary);
        
        // Extract incidents from the summary response (may already contain incidents)
        let incidentData = [];
        
        // Check if summary already contains incidents
        if (summary.incidents && Array.isArray(summary.incidents) && summary.incidents.length > 0) {
          incidentData = summary.incidents;
          console.log('Incidents found in summary:', incidentData);
        } else {
          // Try to fetch incident details from separate endpoint
          try {
            const incidentDetails = await reportsAPI.getEmployeeIncidents?.(employeeId);
            if (incidentDetails && Array.isArray(incidentDetails) && incidentDetails.length > 0) {
              incidentData = incidentDetails;
              console.log('Incidents fetched from endpoint:', incidentData);
            }
          } catch (err) {
            console.log('Incident details endpoint not available');
          }
        }
        
        // Process and validate incident dates
        const processedIncidents = incidentData.map(inc => ({
          ...inc,
          date: new Date(inc.date) // Ensure date is properly parsed
        })).filter(inc => !isNaN(inc.date.getTime())); // Filter out invalid dates
        
        setIncidents(processedIncidents);
        console.log('Final processed incidents:', processedIncidents);
      } else {
        setError('Employee not found. Please check the employee ID.');
        setEmployeeSummary(null);
        setIncidents([]);
      }
    } catch (err) {
      console.error('Error loading employee summary:', err);
      setError(`Employee ID ${employeeId} not found.`);
      setEmployeeSummary(null);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEmployeeCSV = () => {
    if (!employeeSummary) {
      alert('No employee data available to download');
      return;
    }

    const csvContent = generateEmployeeDetailedCSV(employeeSummary, incidents);
    const filename = `employee-${selectedEmployee}-report-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Reports</h2>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Search Employee by ID
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter Employee ID (e.g., 1001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEmployeeSearch(searchQuery);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleEmployeeSearch(searchQuery)}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start mb-6">
            <AlertCircle size={24} className="text-red-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Employee Summary */}
        {selectedEmployee && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SummaryCard
                title="Employee Summary"
                summary={employeeSummary}
                isLoading={loading}
              />
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              {/* Download Button */}
              <div className="bg-white rounded-lg shadow p-6">
                <button
                  onClick={handleDownloadEmployeeCSV}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                >
                  <Download size={20} />
                  Download Employee Report
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Employee ID</span>
                    <span className="font-mono font-semibold text-gray-900">{selectedEmployee}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Name</span>
                    <span className="font-semibold text-gray-900">{employeeSummary?.entityName}</span>
                  </div>

                  {employeeSummary?.totalIncidents > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                      <span className="text-sm text-red-700 font-medium">Total Incidents</span>
                      <span className="font-semibold text-red-900">{employeeSummary?.totalIncidents}</span>
                    </div>
                  )}

                  {employeeSummary?.totalShortMinutes > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
                      <span className="text-sm text-yellow-700 font-medium">Total Short Time</span>
                      <span className="font-semibold text-yellow-900">
                        {Math.floor(employeeSummary?.totalShortMinutes / 60)}h {employeeSummary?.totalShortMinutes % 60}m
                      </span>
                    </div>
                  )}

                  {employeeSummary?.totalExtraMinutes > 0 && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                      <span className="text-sm text-green-700 font-medium">Total Extra Time</span>
                      <span className="font-semibold text-green-900">
                        {Math.floor(employeeSummary?.totalExtraMinutes / 60)}h {employeeSummary?.totalExtraMinutes % 60}m
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {employeeSummary?.incidentTypeCounts && Object.keys(employeeSummary.incidentTypeCounts).length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents Breakdown</h3>
                  <div className="space-y-2">
                    {Object.entries(employeeSummary.incidentTypeCounts).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{type.replace(/_/g, ' ')}</span>
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Incident Timeline */}
        {selectedEmployee && incidents.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Incident Timeline</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Day of Week</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Incident Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident, idx) => {
                    const date = new Date(incident.date);
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const formattedDate = date.toLocaleDateString('en-US');
                    
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{formattedDate}</td>
                        <td className="px-4 py-3 text-gray-700">{dayOfWeek}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            {incident.type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{incident.time || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{incident.details || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Incident Calendar */}
        {selectedEmployee && (
          <div className="mt-8">
            <IncidentCalendar incidents={incidents} />
          </div>
        )}

        {/* No Incidents Message */}
        {selectedEmployee && employeeSummary?.totalIncidents === 0 && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-900 font-medium">No incidents recorded for this employee</p>
            <p className="text-sm text-green-700 mt-1">Great attendance record!</p>
          </div>
        )}

        {!selectedEmployee && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-900 mb-2">Search for an employee by ID to view their attendance summary</p>
            <p className="text-sm text-blue-700">Enter an employee ID in the search box above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeReports;
