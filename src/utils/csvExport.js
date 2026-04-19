/**
 * CSV Export Utility
 * Generates CSV files for company summaries, department summaries, and employee data
 */

/**
 * Download CSV file with given filename and content
 * @param {string} csvContent - The CSV content
 * @param {string} filename - The filename to save as
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Escape CSV field values to handle commas, quotes, and newlines
 * @param {string|number} field - The field value to escape
 * @returns {string} The escaped field value
 */
export const escapeCSVField = (field) => {
  if (field === null || field === undefined) {
    return '';
  }
  
  const fieldStr = String(field);
  
  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (fieldStr.includes(',') || fieldStr.includes('\n') || fieldStr.includes('"')) {
    return `"${fieldStr.replace(/"/g, '""')}"`;
  }
  
  return fieldStr;
};

/**
 * Format minutes to readable time format
 * @param {number} minutes - The minutes to format
 * @returns {string} Formatted time string (e.g., "2h 30m")
 */
export const formatMinutesForCSV = (minutes) => {
  if (!minutes || minutes === 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

/**
 * Generate CSV content for company summary
 * @param {object} companySummary - The company summary data
 * @returns {string} CSV content
 */
export const generateCompanySummaryCSV = (companySummary) => {
  if (!companySummary) return '';
  
  const rows = [];
  rows.push(['Company Attendance Summary']);
  rows.push([`Generated: ${new Date().toLocaleString()}`]);
  rows.push([]);
  
  rows.push(['Metric', 'Value']);
  rows.push(['Entity Name', escapeCSVField(companySummary.entityName)]);
  rows.push(['Total Worked Time', formatMinutesForCSV(companySummary.totalWorkedMinutes)]);
  rows.push(['Normal Time', formatMinutesForCSV(companySummary.totalNormalMinutes)]);
  rows.push(['Short Time', formatMinutesForCSV(companySummary.totalShortMinutes)]);
  rows.push(['Extra Time', formatMinutesForCSV(companySummary.totalExtraMinutes)]);
  rows.push(['Total Incidents', companySummary.totalIncidents || 0]);
  
  if (companySummary.incidentTypeCounts && Object.keys(companySummary.incidentTypeCounts).length > 0) {
    rows.push([]);
    rows.push(['Incident Type', 'Count']);
    Object.entries(companySummary.incidentTypeCounts).forEach(([type, count]) => {
      rows.push([escapeCSVField(type.replace(/_/g, ' ')), count]);
    });
  }
  
  return rows.map(row => row.map(escapeCSVField).join(',')).join('\n');
};

/**
 * Generate CSV content for department summaries
 * @param {array} departments - Array of department summary data
 * @returns {string} CSV content
 */
export const generateDepartmentSummariesCSV = (departments) => {
  if (!departments || departments.length === 0) return '';
  
  const rows = [];
  rows.push(['Department Attendance Summaries']);
  rows.push([`Generated: ${new Date().toLocaleString()}`]);
  rows.push([]);
  
  rows.push([
    'Department',
    'Total Worked',
    'Normal Time',
    'Short Time',
    'Extra Time',
    'Total Incidents',
  ]);
  
  departments.forEach((dept) => {
    rows.push([
      escapeCSVField(dept.entityName),
      formatMinutesForCSV(dept.totalWorkedMinutes),
      formatMinutesForCSV(dept.totalNormalMinutes),
      formatMinutesForCSV(dept.totalShortMinutes),
      formatMinutesForCSV(dept.totalExtraMinutes),
      dept.totalIncidents || 0,
    ]);
  });
  
  return rows.map(row => row.map(escapeCSVField).join(',')).join('\n');
};

/**
 * Generate CSV content for employee summary with incident details
 * @param {object} employeeSummary - The employee summary data
 * @param {array} incidents - Array of incident details with dates
 * @returns {string} CSV content
 */
export const generateEmployeeDetailedCSV = (employeeSummary, incidents = []) => {
  if (!employeeSummary) return '';
  
  const rows = [];
  rows.push(['Employee Attendance Report']);
  rows.push([`Generated: ${new Date().toLocaleString()}`]);
  rows.push([]);
  
  // Summary section
  rows.push(['Employee Information']);
  rows.push(['Field', 'Value']);
  rows.push(['Employee ID', escapeCSVField(employeeSummary.employeeId || '')]);
  rows.push(['Name', escapeCSVField(employeeSummary.entityName)]);
  rows.push(['Total Worked Time', formatMinutesForCSV(employeeSummary.totalWorkedMinutes)]);
  rows.push(['Normal Time', formatMinutesForCSV(employeeSummary.totalNormalMinutes)]);
  rows.push(['Short Time', formatMinutesForCSV(employeeSummary.totalShortMinutes)]);
  rows.push(['Extra Time', formatMinutesForCSV(employeeSummary.totalExtraMinutes)]);
  rows.push(['Total Incidents', employeeSummary.totalIncidents || 0]);
  
  // Incident breakdown
  if (employeeSummary.incidentTypeCounts && Object.keys(employeeSummary.incidentTypeCounts).length > 0) {
    rows.push([]);
    rows.push(['Incident Breakdown']);
    rows.push(['Incident Type', 'Count']);
    Object.entries(employeeSummary.incidentTypeCounts).forEach(([type, count]) => {
      rows.push([escapeCSVField(type.replace(/_/g, ' ')), count]);
    });
  }
  
  // Detailed incidents section
  if (incidents && incidents.length > 0) {
    rows.push([]);
    rows.push(['Detailed Incidents']);
    rows.push(['Date', 'Day of Week', 'Incident Type', 'Time', 'Details']);
    
    incidents.forEach((incident) => {
      const date = new Date(incident.date);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const formattedDate = date.toLocaleDateString('en-US');
      
      rows.push([
        formattedDate,
        escapeCSVField(dayOfWeek),
        escapeCSVField(incident.type.replace(/_/g, ' ')),
        escapeCSVField(incident.time || ''),
        escapeCSVField(incident.details || ''),
      ]);
    });
  }
  
  return rows.map(row => row.map(escapeCSVField).join(',')).join('\n');
};

/**
 * Generate comprehensive CSV with all data (company + departments is optional)
 * @param {object} companySummary - The company summary
 * @param {array} departments - Department summaries
 * @returns {string} CSV content
 */
export const generateComprehensiveCSV = (companySummary, departments = []) => {
  const rows = [];
  rows.push(['COMPREHENSIVE ATTENDANCE REPORT']);
  rows.push([`Generated: ${new Date().toLocaleString()}`]);
  rows.push([]);
  
  // Company Summary Section
  rows.push(['=== COMPANY SUMMARY ===']);
  rows.push(['Metric', 'Value']);
  rows.push(['Entity Name', escapeCSVField(companySummary.entityName)]);
  rows.push(['Total Worked Time', formatMinutesForCSV(companySummary.totalWorkedMinutes)]);
  rows.push(['Normal Time', formatMinutesForCSV(companySummary.totalNormalMinutes)]);
  rows.push(['Short Time', formatMinutesForCSV(companySummary.totalShortMinutes)]);
  rows.push(['Extra Time', formatMinutesForCSV(companySummary.totalExtraMinutes)]);
  rows.push(['Total Incidents', companySummary.totalIncidents || 0]);
  
  // Company Incident Breakdown
  if (companySummary.incidentTypeCounts && Object.keys(companySummary.incidentTypeCounts).length > 0) {
    rows.push([]);
    rows.push(['Company Incident Types']);
    rows.push(['Type', 'Count']);
    Object.entries(companySummary.incidentTypeCounts).forEach(([type, count]) => {
      rows.push([escapeCSVField(type.replace(/_/g, ' ')), count]);
    });
  }
  
  // Departments Section
  if (departments && departments.length > 0) {
    rows.push([]);
    rows.push(['=== DEPARTMENT SUMMARIES ===']);
    rows.push([]);
    rows.push([
      'Department',
      'Total Worked',
      'Normal Time',
      'Short Time',
      'Extra Time',
      'Incidents',
    ]);
    
    departments.forEach((dept) => {
      rows.push([
        escapeCSVField(dept.entityName),
        formatMinutesForCSV(dept.totalWorkedMinutes),
        formatMinutesForCSV(dept.totalNormalMinutes),
        formatMinutesForCSV(dept.totalShortMinutes),
        formatMinutesForCSV(dept.totalExtraMinutes),
        dept.totalIncidents || 0,
      ]);
    });
  }
  
  return rows.map(row => row.map(escapeCSVField).join(',')).join('\n');
};

/**
 * Generate incident timeline CSV for a specific employee
 * @param {string} employeeId - The employee ID
 * @param {string} employeeName - The employee name
 * @param {array} incidents - Array of incidents with dates
 * @returns {string} CSV content
 */
export const generateIncidentTimelineCSV = (employeeId, employeeName, incidents = []) => {
  const rows = [];
  rows.push(['Employee Incident Timeline']);
  rows.push([`Employee ID: ${employeeId}`]);
  rows.push([`Employee Name: ${escapeCSVField(employeeName)}`]);
  rows.push([`Generated: ${new Date().toLocaleString()}`]);
  rows.push([]);
  
  if (!incidents || incidents.length === 0) {
    rows.push(['No incidents recorded']);
    return rows.map(row => row.map(escapeCSVField).join(',')).join('\n');
  }
  
  rows.push(['Date', 'Day of Week', 'Incident Type', 'Time', 'Details']);
  
  incidents.forEach((incident) => {
    const date = new Date(incident.date);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('en-US');
    
    rows.push([
      formattedDate,
      escapeCSVField(dayOfWeek),
      escapeCSVField(incident.type.replace(/_/g, ' ')),
      escapeCSVField(incident.time || ''),
      escapeCSVField(incident.details || ''),
    ]);
  });
  
  return rows.map(row => row.map(escapeCSVField).join(',')).join('\n');
};

/**
 * Generate comprehensive company incident report with all employees
 * @param {array} employees - Array of employee data with incidents
 * @returns {string} CSV content
 */
export const generateCompanyIncidentReportCSV = (employees = []) => {
  const rows = [];
  rows.push(['Company Incident Report - Detailed']);
  rows.push([`Generated: ${new Date().toLocaleString()}`]);
  rows.push([]);
  
  if (!employees || employees.length === 0) {
    rows.push(['No employee data available']);
    return rows.map(row => row.map(escapeCSVField).join(',')).join('\n');
  }
  
  // Summary section
  rows.push(['=== EMPLOYEE INCIDENT SUMMARY ===']);
  rows.push([]);
  rows.push(['Employee ID', 'Employee Name', 'Total Incidents', 'Late Arrivals', 'Early Departures', 'Missing Clock In', 'Missing Clock Out']);
  
  employees.forEach((emp) => {
    const incidentCounts = emp.incidentTypeCounts || {};
    rows.push([
      escapeCSVField(emp.employeeId || ''),
      escapeCSVField(emp.entityName),
      emp.totalIncidents || 0,
      incidentCounts['LATE_ARRIVAL'] || 0,
      incidentCounts['EARLY_DEPARTURE'] || 0,
      incidentCounts['MISSING_CLOCK_IN'] || 0,
      incidentCounts['MISSING_CLOCK_OUT'] || 0,
    ]);
  });
  
  // Detailed incidents section
  rows.push([]);
  rows.push(['=== DETAILED INCIDENTS ===']);
  rows.push([]);
  rows.push(['Employee ID', 'Employee Name', 'Date', 'Day of Week', 'Incident Type', 'Time', 'Details']);
  
  employees.forEach((emp) => {
    if (emp.incidents && emp.incidents.length > 0) {
      emp.incidents.forEach((incident) => {
        const date = new Date(incident.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US');
        
        rows.push([
          escapeCSVField(emp.employeeId || ''),
          escapeCSVField(emp.entityName),
          formattedDate,
          escapeCSVField(dayOfWeek),
          escapeCSVField(incident.type.replace(/_/g, ' ')),
          escapeCSVField(incident.time || ''),
          escapeCSVField(incident.details || ''),
        ]);
      });
    }
  });
  
  return rows.map(row => row.map(escapeCSVField).join(',')).join('\n');
};
