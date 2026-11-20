import React from 'react';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import styles from './MonitoringDashboard.module.css';

const MonitoringDashboard = () => {
  const { metrics, history, cacheHitRatio } = usePerformanceMetrics();

  // Find max requests for the chart scale
  const maxRequests = Math.max(...history.map(d => d.requests), 100);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>⚙️ System Observability</h1>
      
      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.card}>
          <h3>Total API Requests</h3>
          <div className={styles.value}>{metrics.totalRequests.toLocaleString()}</div>
          <div className={styles.subtext}>All time</div>
        </div>

        <div className={`${styles.card} ${metrics.avgResponseTime > 100 ? styles.warning : styles.success}`}>
          <h3>Avg Response Time</h3>
          <div className={styles.value}>{metrics.avgResponseTime} <span style={{fontSize: '1rem'}}>ms</span></div>
          <div className={styles.subtext}>Target: &lt; 100ms</div>
        </div>

        <div className={`${styles.card} ${metrics.errorRate > 2 ? styles.danger : ''}`}>
          <h3>Error Rate</h3>
          <div className={styles.value}>{metrics.errorRate}%</div>
          <div className={styles.subtext}>5xx / 4xx responses</div>
        </div>

        <div className={styles.card}>
          <h3>Rate Limited Requests</h3>
          <div className={styles.value}>{metrics.rateLimited}</div>
          <div className={styles.subtext}>Blocked by Express middleware</div>
        </div>

        <div className={`${styles.card} ${styles.success}`}>
          <h3>Redis Cache Hit Ratio</h3>
          <div className={styles.value}>{cacheHitRatio}%</div>
          <div className={styles.subtext}>
            Hits: {metrics.cacheHits} | Misses: {metrics.cacheMisses}
          </div>
        </div>
      </div>

      {/* Live Traffic Chart (Pure CSS) */}
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h2>Live Traffic (Requests)</h2>
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
            Live
          </span>
        </div>
        
        <div className={styles.barChart}>
          {history.map((point, index) => (
            <div 
              key={index} 
              className={styles.bar} 
              style={{ height: `${(point.requests / maxRequests) * 100}%` }}
              data-value={`${point.requests} reqs`}
              title={`${point.time} - ${point.requests} reqs`}
            ></div>
          ))}
          {/* Fill empty slots if chart just loaded */}
          {history.length === 0 && <p style={{color: '#64748b'}}>Waiting for traffic data...</p>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#64748b', fontSize: '0.8rem' }}>
          <span>Older</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;