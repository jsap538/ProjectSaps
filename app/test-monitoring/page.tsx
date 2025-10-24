"use client";

import { useState } from 'react';
import { trackError, trackBusinessEvent, trackConversionEvent } from '@/lib/monitoring';

export default function TestMonitoringPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testErrorTracking = () => {
    try {
      throw new Error('Test error for monitoring verification');
    } catch (error) {
      trackError(error as Error, { test: true });
      addResult('✅ Error tracking test sent to Sentry');
    }
  };

  const testBusinessMetrics = () => {
    trackBusinessEvent('test_event', { 
      timestamp: Date.now(),
      user: 'test-user' 
    });
    addResult('✅ Business metrics test sent to Sentry');
  };

  const testConversionTracking = () => {
    trackConversionEvent('test_conversion', { 
      step: 'test',
      value: 100 
    });
    addResult('✅ Conversion tracking test sent to Sentry');
  };

  const testApiCall = async () => {
    try {
      const response = await fetch('/api/items?limit=1');
      const data = await response.json();
      addResult(`✅ API call successful: ${data.success ? 'Success' : 'Failed'}`);
    } catch (error) {
      addResult(`❌ API call failed: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-ink p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-porcelain mb-8">
          Monitoring Test Dashboard
        </h1>
        
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-porcelain mb-4">
            Test Monitoring Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testErrorTracking}
              className="rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 font-medium transition-colors duration-sap hover:bg-red-500/30"
            >
              Test Error Tracking
            </button>
            
            <button
              onClick={testBusinessMetrics}
              className="rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-3 font-medium transition-colors duration-sap hover:bg-blue-500/30"
            >
              Test Business Metrics
            </button>
            
            <button
              onClick={testConversionTracking}
              className="rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 font-medium transition-colors duration-sap hover:bg-green-500/30"
            >
              Test Conversion Tracking
            </button>
            
            <button
              onClick={testApiCall}
              className="rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-3 font-medium transition-colors duration-sap hover:bg-purple-500/30"
            >
              Test API Performance
            </button>
          </div>
        </div>

        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-porcelain">
              Test Results
            </h2>
            <button
              onClick={clearResults}
              className="rounded-xl bg-nickel/20 border border-nickel/30 text-nickel px-3 py-2 text-sm font-medium transition-colors duration-sap hover:bg-nickel/30"
            >
              Clear Results
            </button>
          </div>
          
          <div className="bg-ink/50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-nickel">No tests run yet. Click a button above to test monitoring.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono text-porcelain">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-titanium/10 border border-titanium/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-porcelain mb-4">
            Next Steps
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-nickel">
            <li>Set up your Sentry account and get your DSN</li>
            <li>Add environment variables to your .env.local file</li>
            <li>Deploy to Vercel with the environment variables</li>
            <li>Check your Sentry dashboard for the test events</li>
            <li>Set up alerts for critical issues</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

