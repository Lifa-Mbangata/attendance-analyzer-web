# Attendance Management System - Frontend Setup Guide

## Overview
This is the Phase 6 Frontend UI for the Attendance Management System. It provides a professional, enterprise-grade interface for uploading attendance data, viewing reports, and managing employee attendance records.

## Prerequisites
- Node.js 16+ and npm 8+
- Backend API running on `http://localhost:8080` (Spring Boot backend from Phases 1-5)

## Tech Stack
- **React 19.2.4** - UI Framework
- **Vite 8.0.1** - Build tool and dev server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Recharts 2.10.0** - Data visualization library
- **Axios 1.6.0** - HTTP client
- **Lucide React 0.292.0** - Icon library

## Installation

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

This will install:
- React and React DOM
- Vite and build tools
- Tailwind CSS with PostCSS
- Recharts for charts
- Axios for API calls
- Lucide React icons

### 2. Configure Backend URL
The frontend is configured to connect to the backend at: `http://localhost:8080/api`

If your backend runs on a different URL, update [src/api.js](src/api.js):
```javascript
const API_BASE_URL = 'http://localhost:8080/api'; // Change if needed
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Navigation header with tabs
│   ├── Dashboard.jsx           # Main dashboard with company overview
│   ├── EmployeeReports.jsx     # Employee-specific report viewer
│   ├── DepartmentReports.jsx   # Department summaries and comparison
│   ├── FileUpload.jsx          # CSV file upload component
│   └── SummaryCard.jsx         # Reusable summary display component
├── api.js                       # API client configuration
├── utils.js                     # Utility functions for formatting
├── App.jsx                      # Main app component
├── App.css                      # Custom styles
├── index.css                    # Tailwind CSS directives
└── main.jsx                     # React entry point
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will:
- Start the Vite dev server on `http://localhost:5173`
- Enable hot module replacement (HMR) for instant updates
- Show any build errors in the browser

### Production Build
```bash
npm run build
```
This generates an optimized production build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
This previews the production build locally before deployment.

## Features

### 1. Dashboard
- **Company Overview**: View company-wide attendance statistics
  - Total worked hours
  - Normal, short, and extra time tracking
  - Incident distribution pie chart
- **Department Summaries**: Quick view of department performance
- **Visualizations**: Charts showing department time distribution

### 2. Employee Reports
- **Employee Search**: Look up any employee by ID
- **Detailed Summary**: View individual attendance statistics
- **Incident Breakdown**: See all incident types for the employee
- **Quick Stats**: Key metrics displayed in cards

### 3. Department Reports
- **Department Selection**: Browse all departments
- **Comparison Charts**: Compare time tracking across departments
- **Incident Summary**: Department-wide incident analysis
- **Detailed Table**: Complete department summary table

### 4. File Upload
- **Drag & Drop**: Upload CSV files with drag-and-drop support
- **Format Validation**: Automatic CSV format validation
- **Success Feedback**: Detailed upload results with record and incident counts
- **Format Guide**: In-app help showing expected CSV structure

## Usage Guide

### Uploading Attendance Data

1. Navigate to **Upload CSV** tab
2. Drag and drop a CSV file or click to browse
3. The system validates the format
4. Click **Upload & Process**
5. View results showing:
   - Number of records processed
   - Number of incidents detected

### Expected CSV Format

```
Monday - 04/08/2025
1001,John Smith,Work Day,Department 1,07:45,17:10,,,,,,,
1002,Jane Doe,Work Day,Department 2,08:05,17:00,,,,,,,

Tuesday - 05/08/2025
1001,John Smith,Work Day,Department 1,07:50,17:15,,,,,,,
```

**CSV Columns:**
1. Employee ID
2. Employee Name
3. Day Type (Work Day, Rest Day)
4. Department
5. Clock In Time (HH:MM)
6. Clock Out Time (HH:MM)
7-11. Reserved for additional data
12. Leave Comment (optional)

### Viewing Reports

#### Dashboard Tab
- Automatically loads when the app starts
- Refreshes after each file upload
- Shows company-wide metrics and visualizations
- Displays up to 6 department summaries with an expansion indicator

#### Employees Tab
- Enter an employee ID in the search box
- Press Enter or click Search
- View detailed attendance summary including:
  - Total time worked
  - Normal, short, and extra hours
  - All incidents for the employee

#### Departments Tab
- View all department summaries
- Click department buttons to select and view details
- See comparison charts across all departments
- Browse the complete department table

## API Integration

### Backend Endpoints Used

#### File Upload
```javascript
POST /api/attendance/upload
Body: multipart/form-data with "file" parameter
Response: { message, recordCount, incidentCount }
```

#### Get Company Summary
```javascript
GET /api/reports/company
Response: AttendanceSummary object
```

#### Get Employee Summary
```javascript
GET /api/reports/employee/{employeeId}
Response: AttendanceSummary object
```

#### Get Department Summaries
```javascript
GET /api/reports/departments
Response: Array of AttendanceSummary objects
```

## Styling & Customization

### Tailwind Configuration
The app uses Tailwind CSS with custom theme extensions. Configuration is in [tailwind.config.js](tailwind.config.js).

### Custom Colors
The theme includes custom color palettes:
- **Primary**: Blue shades for main UI
- **Success**: Green for positive metrics
- **Warning**: Yellow for cautionary metrics
- **Danger**: Red for incidents and errors

### Customizing Colors
To change colors, edit [tailwind.config.js](tailwind.config.js):
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9', // Change this
      }
    }
  }
}
```

## Troubleshooting

### Backend Connection Issues
**Problem**: "Failed to load dashboard data" error
**Solution**: 
1. Ensure the Spring Boot backend is running on port 8080
2. Check that all services in [src/api.js](src/api.js) have correct endpoints
3. Check browser console for CORS errors

### CSV Upload Fails
**Problem**: Upload fails or file is rejected
**Solution**:
1. Ensure CSV file format matches the expected structure
2. Verify date headers are in "Monday - 04/08/2025" format
3. Check that clock times are in HH:MM format
4. Ensure no blank columns in the middle of data

### No Data Showing After Upload
**Problem**: Upload succeeds but no data appears in reports
**Solution**:
1. Check that you're uploading data for weekdays (not weekends)
2. Verify employees in CSV have complete data
3. Check browser console for API errors
4. Restart the dev server if HMR isn't picking up changes

### Slow Performance
**Problem**: UI is sluggish with large datasets
**Solution**:
1. Limit dashboard view to recently uploaded data
2. Use employee/department search instead of loading all data
3. Build and test in production mode: `npm run build && npm run preview`

## Development

### Add a New Component
1. Create file in `src/components/`
2. Import in `App.jsx`
3. Add route in renderContent() switch statement
4. Add tab button in Header component

### Modify API Calls
All API configuration is in [src/api.js](src/api.js). Update endpoints or headers there.

### Add New Visualizations
The app uses Recharts. Visit [recharts.org](https://recharts.org/) for component examples.

Example adding a line chart:
```javascript
import { LineChart, Line } from 'recharts';

<LineChart data={data}>
  <Line type="monotone" dataKey="value" stroke="#3b82f6" />
</LineChart>
```

## Performance Optimization

### Built-in Optimizations
- Lazy loading of department reports
- Memoized chart components
- Efficient state management
- Tailwind CSS tree-shaking

### Production Build Size
Run `npm run build` to generate optimized assets:
- Tailwind CSS is purged to only used classes
- React is in production mode
- All JavaScript is minified

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps for Phase 7 & 8
- **Phase 7**: Add CSV export functionality
- **Phase 8**: Performance testing, error boundaries, and production deployment

## Support & Documentation

For issues or questions:
1. Check the Troubleshooting section above
2. Review the backend logs on port 8080
3. Check browser console (F12) for errors
4. Ensure backend and frontend are both running

## License
&copy; 2024 Attendance Management System. All rights reserved.
