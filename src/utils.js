export const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatDecimal = (value) => {
  return Math.round(value * 100) / 100;
};

export const getIncidentColor = (type) => {
  switch (type) {
    case 'LATE_ARRIVAL':
      return 'bg-red-100 text-red-800';
    case 'EARLY_DEPARTURE':
      return 'bg-orange-100 text-orange-800';
    case 'MISSING_CLOCK_IN':
      return 'bg-yellow-100 text-yellow-800';
    case 'MISSING_CLOCK_OUT':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getIncidentLabel = (type) => {
  switch (type) {
    case 'LATE_ARRIVAL':
      return 'Late Arrival';
    case 'EARLY_DEPARTURE':
      return 'Early Departure';
    case 'MISSING_CLOCK_IN':
      return 'Missing Clock In';
    case 'MISSING_CLOCK_OUT':
      return 'Missing Clock Out';
    default:
      return type;
  }
};
