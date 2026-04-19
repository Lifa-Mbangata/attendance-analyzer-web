import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IncidentCalendar = ({ incidents }) => {
  // Get the date range from incidents
  const dateRange = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return { minDate: new Date(), maxDate: new Date() };
    }

    const dates = incidents
      .map(inc => new Date(inc.date))
      .filter(date => !isNaN(date.getTime())); // Filter out invalid dates

    if (dates.length === 0) {
      return { minDate: new Date(), maxDate: new Date() };
    }

    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    return {
      minDate: new Date(sortedDates[0]),
      maxDate: new Date(sortedDates[sortedDates.length - 1]),
    };
  }, [incidents]);

  // Initialize with the first month from incidents
  const [currentDate, setCurrentDate] = useState(() => {
    return new Date(dateRange.minDate.getFullYear(), dateRange.minDate.getMonth(), 1);
  });

  // Parse incidents into a map for easy lookup
  const incidentsByDate = useMemo(() => {
    const map = {};
    if (incidents && incidents.length > 0) {
      incidents.forEach((incident) => {
        const date = new Date(incident.date);
        if (!isNaN(date.getTime())) {
          const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
          if (!map[dateStr]) {
            map[dateStr] = [];
          }
          map[dateStr].push(incident);
        }
      });
    }
    return map;
  }, [incidents]);

  // Get the first and last day of the month
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Get the starting day of the week (0 = Sunday)
  const startingDayOfWeek = firstDay.getDay();

  // Get number of days to display from previous month
  const daysFromPrevMonth = startingDayOfWeek;
  const daysInMonth = lastDay.getDate();
  const daysFromNextMonth = 42 - (daysFromPrevMonth + daysInMonth); // 6 rows * 7 days = 42

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    // Don't go before the first month with data
    if (newDate >= new Date(dateRange.minDate.getFullYear(), dateRange.minDate.getMonth(), 1)) {
      setCurrentDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    // Don't go past the last month with data
    if (newDate <= new Date(dateRange.maxDate.getFullYear(), dateRange.maxDate.getMonth(), 1)) {
      setCurrentDate(newDate);
    }
  };

  const handleToFirstMonth = () => {
    setCurrentDate(new Date(dateRange.minDate.getFullYear(), dateRange.minDate.getMonth(), 1));
  };

  // Generate all days to display
  const calendarDays = [];

  // Previous month's days
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      dateObj: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i),
    });
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: i,
      isCurrentMonth: true,
      dateObj: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
    });
  }

  // Next month's days
  for (let i = 1; i <= daysFromNextMonth; i++) {
    calendarDays.push({
      date: i,
      isCurrentMonth: false,
      dateObj: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
    });
  }

  const getIncidentsForDate = (dateObj) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    return incidentsByDate[dateStr] || [];
  };

  const getIncidentColor = (type) => {
    switch (type) {
      case 'LATE_ARRIVAL':
        return 'bg-red-500';
      case 'EARLY_DEPARTURE':
        return 'bg-orange-500';
      case 'MISSING_CLOCK_IN':
        return 'bg-yellow-500';
      case 'MISSING_CLOCK_OUT':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const hasDataInCurrentMonth = calendarDays.some(
    day => day.isCurrentMonth && getIncidentsForDate(day.dateObj).length > 0
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Incident Calendar (from CSV)</h3>
          <button
            onClick={handleToFirstMonth}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            First Month
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            disabled={currentDate <= new Date(dateRange.minDate.getFullYear(), dateRange.minDate.getMonth(), 1)}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <h2 className="text-xl font-bold text-gray-900 min-w-48 text-center">{monthYear}</h2>

          <button
            onClick={handleNextMonth}
            disabled={currentDate >= new Date(dateRange.maxDate.getFullYear(), dateRange.maxDate.getMonth(), 1)}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Data Range Info */}
        <div className="text-xs text-gray-600 mb-4 p-2 bg-blue-50 rounded">
          <p>Data Range: {dateRange.minDate.toLocaleDateString('en-US')} to {dateRange.maxDate.toLocaleDateString('en-US')}</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs mb-4 p-3 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Late Arrival</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">Early Departure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700">Missing Clock</span>
          </div>
        </div>
      </div>

      {!hasDataInCurrentMonth && calendarDays.some(day => getIncidentsForDate(day.dateObj).length > 0) && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          ⚠️ No incidents in this month. Use navigation to view months with data.
        </div>
      )}

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayIncidents = getIncidentsForDate(day.dateObj);
            const isToday =
              day.dateObj.toDateString() === new Date().toDateString();
            const hasIncidents = dayIncidents.length > 0;

            return (
              <div
                key={idx}
                className={`min-h-24 p-2 border border-gray-200 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50' : ''} ${hasIncidents ? 'bg-yellow-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                  {day.date}
                </div>

                {/* CSV Date Display */}
                <div className="text-xs text-gray-500 mb-1">
                  {day.dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>

                {/* Incident indicators */}
                <div className="space-y-1">
                  {dayIncidents.slice(0, 2).map((incident, incIdx) => (
                    <div
                      key={incIdx}
                      className={`text-xs text-white px-2 py-1 rounded truncate ${getIncidentColor(
                        incident.type
                      )}`}
                      title={`${incident.type.replace(/_/g, ' ')}\n${incident.time || ''}`}
                    >
                      {incident.type.replace(/_/g, ' ').substring(0, 10)}
                    </div>
                  ))}
                  {dayIncidents.length > 2 && (
                    <div className="text-xs text-gray-600 px-2 font-medium">
                      +{dayIncidents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {incidents && incidents.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{incidents.length}</span> incident{incidents.length !== 1 ? 's' : ''} recorded from {dateRange.minDate.toLocaleDateString('en-US')} to {dateRange.maxDate.toLocaleDateString('en-US')}
          </p>
        </div>
      )}

      {(!incidents || incidents.length === 0) && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-900">No incidents recorded for this employee</p>
        </div>
      )}
    </div>
  );
};

export default IncidentCalendar;
