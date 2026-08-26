import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import JobApplicationForm from './components/JobApplicationForm';
import StatusFilter from './components/StatusFilter';
import JobApplicationList from './components/JobApplicationList';
import EmptyState from './components/EmptyState';
import './App.css';

const LOCAL_STORAGE_KEY = 'jobApplications';

const initialSampleData = [
  {
    id: 1,
    companyName: "Google",
    jobRole: "Frontend Developer",
    applicationDate: "2026-08-20",
    status: "Applied"
  },
  {
    id: 2,
    companyName: "Microsoft",
    jobRole: "React Developer",
    applicationDate: "2026-08-18",
    status: "Interview"
  },
  {
    id: 3,
    companyName: "Amazon",
    jobRole: "Software Engineer",
    applicationDate: "2026-08-15",
    status: "Rejected"
  },
  {
    id: 4,
    companyName: "Infosys",
    jobRole: "Web Developer",
    applicationDate: "2026-08-12",
    status: "Offer"
  }
];

function App() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedApplications = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedApplications) {
      try {
        const parsed = JSON.parse(savedApplications);
        setApplications(parsed);
      } catch (error) {
        console.error("Failed to load applications", error);
        setApplications(initialSampleData);
      }
    } else {
      setApplications(initialSampleData);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever applications change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
    }
  }, [applications, isLoaded]);

  const addApplication = useCallback((newApp) => {
    setApplications(prev => [newApp, ...prev]);
    setShowForm(false);
  }, []);

  const deleteApplication = useCallback((id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  }, []);

  const updateApplicationStatus = useCallback((id, newStatus) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
  }, []);

  // Derived stats
  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'Applied').length,
    interview: applications.filter(app => app.status === 'Interview').length,
    offer: applications.filter(app => app.status === 'Offer').length,
    rejected: applications.filter(app => app.status === 'Rejected').length,
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobRole.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-container">
      <Header onAddClick={() => setShowForm(true)} />
      
      <StatsCards {...stats} />
      
      <div className="actions-bar">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <StatusFilter 
          statusFilter={statusFilter} 
          onStatusFilterChange={setStatusFilter} 
        />
      </div>

      {filteredApplications.length > 0 ? (
        <JobApplicationList 
          applications={filteredApplications}
          onDelete={deleteApplication}
          onStatusChange={updateApplicationStatus}
        />
      ) : (
        <EmptyState 
          onAddClick={() => setShowForm(true)} 
          hasSearchOrFilter={applications.length > 0 && (searchTerm !== '' || statusFilter !== 'All')}
        />
      )}

      {showForm && (
        <JobApplicationForm 
          onAdd={addApplication}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;
