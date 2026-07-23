// frontend/src/components/ReportButton.jsx

import React, { useState } from 'react';
import styles from './ReportButton.module.css';
import { postData } from '../api/api';
import toast from 'react-hot-toast';

const ReportButton = ({ targetType, targetId, targetTitle, onReportSubmitted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { value: 'spam', label: 'Spam or Promotional' },
    { value: 'harassment', label: 'Harassment or Bullying' },
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'fake_account', label: 'Fake Account' },
    { value: 'hate_speech', label: 'Hate Speech' },
    { value: 'copyright_violation', label: 'Copyright Violation' },
    { value: 'impersonation', label: 'Impersonation' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error('Please select a reason');
      return;
    }

    setSubmitting(true);
    try {
      await postData('reports/create', {
        targetType,
        targetId,
        targetTitle,
        reason,
        description
      });
      
      toast.success('Report submitted successfully! Thank you for helping keep our community safe.');
      setIsOpen(false);
      setReason('');
      setDescription('');
      
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button 
        className={styles.reportBtn}
        onClick={() => setIsOpen(true)}
        title="Report this content"
      >
        <i className="fas fa-flag"></i>
        <span>Report</span>
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                <i className="fas fa-flag"></i> Report Content
              </h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.reportingInfo}>
                Reporting: <strong>{targetTitle || targetType}</strong>
              </p>

              <div className={styles.formGroup}>
                <label>Reason for reporting <span className={styles.required}>*</span></label>
                <select 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className={styles.select}
                >
                  <option value="">Select a reason...</option>
                  {reasons.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Additional details <span className={styles.optional}>(optional)</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more context about this report..."
                  maxLength="500"
                  rows="4"
                  className={styles.textarea}
                />
                <span className={styles.charCount}>{description.length}/500</span>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className={styles.spinner}></span> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton;