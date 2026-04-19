# Quick Start Guide - Attendance Management System

## ⚡ Get Running in 2 Minutes

### Step 1: Start the Backend (Terminal 1)
```bash
cd backend-code
mvn spring-boot:run
```
✅ Wait for: "Started AttendanceManagementApplication in X seconds"  
✅ Backend ready at: http://localhost:8080

### Step 2: Start the Frontend (Terminal 2)
```bash
npm install --legacy-peer-deps
npm run dev
```
✅ Wait for: "Local: http://localhost:5173"  
✅ Frontend ready at: http://localhost:5173

### Step 3: Open in Browser
```
http://localhost:5173
```

---

## 📝 Test with Sample Data

### Create a file: `test_data.csv`
```csv
Monday - 04/08/2025
1001,John Smith,Work Day,Sales,07:45,17:10,,,,,,,
1002,Jane Doe,Work Day,Marketing,08:05,17:00,,,,,,,
1003,Bob Johnson,Work Day,IT,07:30,17:15,,,,,,,

Tuesday - 05/08/2025
1001,John Smith,Work Day,Sales,07:50,17:15,,,,,,,
1002,Jane Doe,Work Day,Marketing,08:00,17:30,,,,,,,
1003,Bob Johnson,Work Day,IT,07:45,16:50,,,,,,,
```

### Upload File
1. Click **Upload CSV** tab
2. Drag-and-drop `test_data.csv` or click to browse
3. Click **Upload & Process**
4. See success: "Processed 6 records with 0 incidents"

### View Reports
1. Click **Dashboard** tab - See company overview
2. Click **Employees** tab - Search ID "1001"
3. Click **Departments** tab - Compare departments

---

## 🐛 Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:8080/api/attendance/health
```
Expected response:
```json
{"status": "UP", "message": "Attendance API is running"}
```

### Check Frontend
Open browser console (F12) - Should see no errors

---

## ⚙️ Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| Port 8080 in use | `lsof -i :8080` then kill the process |
| Port 5173 in use | `lsof -i :5173` then kill the process |
| Dependencies error | `rm -rf node_modules && npm install --legacy-peer-deps` |
| CORS error | Verify backend is running on 8080 |
| No data after upload | Refresh page or check browser console |

---

## 📚 Full Documentation

- **Complete Setup**: See [FRONTEND_SETUP.md](FRONTEND_SETUP.md)
- **Project Overview**: See [README.md](README.md)
- **Phase 6 Details**: See [PHASE_6_SUMMARY.md](PHASE_6_SUMMARY.md)

---

## 🎯 Features Overview

### Dashboard
- Company-wide statistics with color-coded metrics
- Department summaries
- Time distribution and incident charts

### Upload CSV
- Drag-and-drop file upload
- Real-time CSV processing
- Success/error feedback

### Employee Reports
- Search employees by ID
- View detailed attendance summary
- See incident breakdown

### Department Reports
- Browse all departments
- Compare performance across departments
- View incident analysis

---

## 🚀 Build for Production

### Frontend
```bash
npm run build
npm run preview  # Test production build locally
```
Output: `dist/` folder (ready to deploy)

### Backend
```bash
cd backend-code
mvn clean package
java -jar target/*.jar
```
Output: `target/*.jar` (ready to deploy)

---

## 💡 Tips

✅ The system automatically processes weekdays only (skips Sat/Sun)  
✅ Leave comments prevent incident reporting  
✅ Time calculated: Normal + Short + Extra = Total  
✅ Dashboard refreshes automatically after upload  
✅ Supports thousands of attendance records  

---

## ✅ Verification Checklist

After everything loads:
- [ ] Can see Dashboard tab
- [ ] Can see Employees tab with search
- [ ] Can see Departments tab
- [ ] Can see Upload CSV tab
- [ ] Can upload a CSV file
- [ ] Success message shows record count
- [ ] Dashboard shows data after upload
- [ ] Employee search returns results
- [ ] Department summary displays

---

## 📞 Need Help?

1. **Check browser console** (F12) for errors
2. **Check terminal output** for backend logs
3. **Verify ports 8080 and 5173 are available**
4. **Ensure both backend and frontend are running**
5. **See [FRONTEND_SETUP.md](FRONTEND_SETUP.md) for detailed troubleshooting**

---

**Version**: 1.0.0  
**Phase**: 6 Complete  
**Status**: Ready to Use ✅
