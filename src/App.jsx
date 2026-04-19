import React, { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import FileUpload from './components/FileUpload'
import EmployeeReports from './components/EmployeeReports'
import DepartmentReports from './components/DepartmentReports'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard refreshTrigger={refreshTrigger} />
      case 'employees':
        return <EmployeeReports refreshTrigger={refreshTrigger} />
      case 'departments':
        return <DepartmentReports refreshTrigger={refreshTrigger} />
      case 'upload':
        return <FileUpload onUploadSuccess={handleUploadSuccess} />
      default:
        return <Dashboard refreshTrigger={refreshTrigger} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container-main">
        {renderContent()}
      </div>
      <footer className="border-t border-gray-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2024 Attendance Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
