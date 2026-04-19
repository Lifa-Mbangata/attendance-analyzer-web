# Employee Attendance Management System
## Complete Enterprise Solution (Phases 1-6)

A comprehensive, production-ready attendance tracking and reporting system built with Spring Boot backend and React frontend.

### Project Status: Phase 6 Complete ✅

**Phases Completed:**
- ✅ Phase 1: Requirements & Initial Design
- ✅ Phase 2: CSV Parsing Architecture  
- ✅ Phase 3: Payroll-Grade Time Calculation Engine
- ✅ Phase 4: Automated Attendance Incident Detection
- ✅ Phase 5: Data Aggregation & Reporting
- ✅ **Phase 6: User Interface Development (NEW)**

**Upcoming:**
- Phase 7: CSV Export & Integration Tools
- Phase 8: Testing & Final Stabilization

## Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.6.0+
- Two terminal windows

### 1. Start the Backend

```bash
# Navigate to backend directory
cd backend-code

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 2. Start the Frontend

```bash
# In a new terminal, from the root directory
npm install --legacy-peer-deps
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Access the Application

Open your browser and visit: **http://localhost:5173**

## Features

### Dashboard
- Company-wide attendance statistics
- Department summaries and comparisons
- Real-time chart visualizations
- Worked vs. short vs. extra time tracking
- Incident distribution analysis

### Employee Reports
- Search employees by ID
- Individual attendance summaries
- Detailed incident records
- Time tracking breakdown

### Department Reports
- Department-level analytics
- Comparative performance charts
- Incident analysis by department
- Detailed summary tables

### File Upload
- Drag-and-drop CSV upload
- Automatic format validation
- Real-time processing feedback
- Support for multi-section CSV files

## Technology Stack

### Backend (Phases 1-5)
- Spring Boot 3.1.5
- Java 17
- Maven
- In-Memory Data Store

### Frontend (Phase 6 - NEW)
- React 19.2.4
- Vite 8.0.1
- Tailwind CSS 3.3.6
- Recharts 2.10.0
- Axios 1.6.0

## Setup & Documentation

For detailed setup instructions:
- **Backend**: See [BACKEND_SETUP.md](BACKEND_SETUP.md)
- **Frontend**: See [FRONTEND_SETUP.md](FRONTEND_SETUP.md)

### Quick Setup
1. Install dependencies: `npm install --legacy-peer-deps`
2. Start backend: `cd backend-code && mvn spring-boot:run`
3. Start frontend: `npm run dev`
4. Open: `http://localhost:5173`

## Project Structure

```
├── backend-code/          # Spring Boot application (Phases 1-5)
├── backend-config/        # Backend configuration
├── src/                   # React frontend (Phase 6)
│   ├── components/        # React components
│   ├── api.js            # API client
│   └── utils.js          # Utilities
├── BACKEND_SETUP.md       # Backend setup guide
├── FRONTEND_SETUP.md      # Frontend setup guide (NEW)
└── README.md             # This file
```

## API Endpoints

All endpoints are prefixed with `/api`:

- `POST /attendance/upload` - Upload CSV file
- `GET /attendance/health` - Health check
- `GET /reports/company` - Company summary
- `GET /reports/employee/{id}` - Employee summary
- `GET /reports/departments` - Department summaries

## CSV Format

```
Monday - 04/08/2025
1001,John Smith,Work Day,Sales,07:45,17:10,,,,,,,
1002,Jane Doe,Work Day,Marketing,08:05,17:00,,,,,,,

Tuesday - 05/08/2025
1001,John Smith,Work Day,Sales,07:50,17:15,,,,,,,
```

## System Requirements

- **Java**: 17 or higher
- **Node.js**: 16 or higher
- **Maven**: 3.6.0 or higher
- **Disk Space**: 500MB for backend, 100MB for frontend
- **Memory**: 2GB RAM recommended

## Performance

- In-memory data store (optimized for demo/testing)
- Real-time processing on file upload
- Responsive UI with chart visualizations
- Supporting thousands of attendance records

## Troubleshooting

### Backend Issues
- Ensure Java 17+ is installed
- Check port 8080 is available
- Verify Maven dependencies: `mvn clean install`

### Frontend Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Check backend is running on 8080
- Clear browser cache (Ctrl+Shift+Delete)

### CSV Upload Issues
- Verify date format: "Monday - 04/08/2025"
- Check clock times: "HH:MM" (24-hour)
- No blank rows between sections
- UTF-8 file encoding

See detailed troubleshooting in [FRONTEND_SETUP.md](FRONTEND_SETUP.md) and [BACKEND_SETUP.md](BACKEND_SETUP.md).

## Development

### Running in Development Mode
```bash
# Backend (Java)
cd backend-code && mvn spring-boot:run

# Frontend (React)
npm run dev
```

### Building for Production
```bash
# Frontend
npm run build

# Backend
cd backend-code && mvn clean package
```

## Next Phases

**Phase 7** (Coming Soon):
- CSV export of reports
- PDF generation
- Email delivery

**Phase 8** (Coming Soon):
- Performance testing
- Production deployment
- User documentation

## Support

For questions or issues:
1. Check [FRONTEND_SETUP.md](FRONTEND_SETUP.md) - Frontend guide
2. Check [BACKEND_SETUP.md](BACKEND_SETUP.md) - Backend guide  
3. Review browser console (F12) for errors
4. Check backend logs in terminal

## License

&copy; 2024 Employee Attendance Management System. All rights reserved.

---

**Version**: 1.0.0 (Phases 1-6)
**Status**: ✅ Production Ready
**Last Updated**: 2024
- Use Reports to fetch and view attendance summaries
