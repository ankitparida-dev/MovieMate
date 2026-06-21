import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_reports';

export const useReport = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setReports(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading reports:', error);
        setReports([]);
      }
    }
  }, []);

  const saveReports = (newReports) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
    setReports(newReports);
  };

  const addReport = (targetUser, reason, targetType = 'comment') => {
    const newReport = {
      id: Date.now(),
      reporter: JSON.parse(localStorage.getItem('user') || '{"name":"User"}').name || 'Anonymous',
      targetUser,
      reason,
      targetType,
      createdAt: new Date().toISOString()
    };
    saveReports([...reports, newReport]);
    return newReport;
  };

  const resolveReport = (id) => {
    const newReports = reports.filter(r => r.id !== id);
    saveReports(newReports);
  };

  return {
    reports,
    addReport,
    resolveReport
  };
};