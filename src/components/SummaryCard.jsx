import React from 'react';
import { formatMinutes } from '../utils';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const SummaryCard = ({ title, summary, isLoading = false, isCompact = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const normalRatio = summary.totalWorkedMinutes > 0 
    ? (summary.totalNormalMinutes / summary.totalWorkedMinutes * 100).toFixed(1)
    : 0;
  const shortRatio = summary.totalWorkedMinutes > 0
    ? (summary.totalShortMinutes / summary.totalWorkedMinutes * 100).toFixed(1)
    : 0;

  return (
    <div className={`bg-white rounded-lg shadow ${isCompact ? 'p-4' : 'p-6'}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-sm text-gray-600 mb-6">{summary.entityName}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-green-700 uppercase tracking-wider">
              Normal Time
            </span>
            <TrendingUp size={16} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatMinutes(summary.totalNormalMinutes)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700 uppercase tracking-wider">
              Total Worked
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {formatMinutes(summary.totalWorkedMinutes)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-yellow-700 uppercase tracking-wider">
              Short Time
            </span>
            <TrendingDown size={16} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-700">
            {formatMinutes(summary.totalShortMinutes)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-700 uppercase tracking-wider">
              Extra Time
            </span>
            <TrendingUp size={16} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {formatMinutes(summary.totalExtraMinutes)}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-sm text-gray-600 mb-3">Work Distribution</div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-700">Normal Hours: {normalRatio}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.min(normalRatio, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-700">Short Hours: {shortRatio}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${Math.min(shortRatio, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {summary.totalIncidents > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center mb-3">
            <AlertCircle size={16} className="text-red-500 mr-2" />
            <span className="text-sm font-semibold text-red-700">Incidents: {summary.totalIncidents}</span>
          </div>
          {summary.incidentTypeCounts && (
            <div className="space-y-2">
              {Object.entries(summary.incidentTypeCounts).map(([type, count]) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="text-gray-600">{type.replace(/_/g, ' ')}:</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
