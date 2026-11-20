import { useState, useEffect } from 'react';

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    avgResponseTime: 0,
    errorRate: 0,
    cacheHits: 0,
    cacheMisses: 0,
    rateLimited: 0,
  });

  const [history, setHistory] = useState([]); // For the live chart

  useEffect(() => {
    // Simulate live data coming from Prometheus/Express middleware
    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Randomly simulate traffic spikes
        const newRequests = Math.floor(Math.random() * 50) + 10; 
        const newErrors = Math.random() > 0.9 ? Math.floor(Math.random() * 5) : 0; // 10% chance of error
        const newHits = Math.floor(Math.random() * 30) + 10;
        const newMisses = Math.floor(Math.random() * 20) + 5;
        const newRateLimited = Math.random() > 0.95 ? 2 : 0; // 5% chance of rate limiting

        const totalReqs = prev.totalRequests + newRequests;
        const totalErrors = (prev.errorRate / 100) * prev.totalRequests + newErrors;
        const currentAvgResponse = (prev.avgResponseTime + (Math.random() * 50 + 20)) / 2; // Simulated latency

        // Update chart history (keep last 20 data points)
        const newHistoryPoint = {
          time: new Date().toLocaleTimeString().split(' ')[0],
          requests: totalReqs,
          latency: Math.round(currentAvgResponse),
        };

        setHistory((h) => [...h.slice(-19), newHistoryPoint]);

        return {
          totalRequests: totalReqs,
          avgResponseTime: Math.round(currentAvgResponse),
          errorRate: parseFloat(((totalErrors / totalReqs) * 100).toFixed(2)),
          cacheHits: prev.cacheHits + newHits,
          cacheMisses: prev.cacheMisses + newMisses,
          rateLimited: prev.rateLimited + newRateLimited,
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate cache hit ratio
  const totalCacheRequests = metrics.cacheHits + metrics.cacheMisses;
  const cacheHitRatio = totalCacheRequests === 0 ? 0 : ((metrics.cacheHits / totalCacheRequests) * 100).toFixed(1);

  return { metrics, history, cacheHitRatio };
};