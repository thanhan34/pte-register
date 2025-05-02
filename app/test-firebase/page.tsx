'use client';

import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function TestFirebase() {
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string>('');
  const [testResults, setTestResults] = useState<Array<{test: string, result: string, success: boolean}>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const runReadTest = async () => {
    try {
      setStatus('Testing Firestore read operation...');
      const querySnapshot = await getDocs(collection(db, 'students'));
      const count = querySnapshot.size;
      
      addTestResult('Read Test', `Successfully read ${count} documents from 'students' collection`, true);
      setStatus('Read test completed successfully');
      setError(null);
    } catch (err) {
      const error = err as { message?: string };
      console.error('Read test error:', err);
      addTestResult('Read Test', `Failed: ${error.message || 'Unknown error'}`, false);
      setStatus('Read test failed');
      setError(JSON.stringify(err, Object.getOwnPropertyNames(err as object), 2));
    }
  };

  const runWriteTest = async () => {
    try {
      setStatus('Testing Firestore write operation...');
      
      // Create a test document
      const testDoc = {
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
        isTest: true
      };
      
      const docRef = await addDoc(collection(db, 'test_collection'), testDoc);
      
      addTestResult('Write Test', `Successfully wrote document with ID: ${docRef.id}`, true);
      setStatus('Write test completed successfully');
      setError(null);
    } catch (err) {
      const error = err as { message?: string };
      console.error('Write test error:', err);
      addTestResult('Write Test', `Failed: ${error.message || 'Unknown error'}`, false);
      setStatus('Write test failed');
      setError(JSON.stringify(err, Object.getOwnPropertyNames(err as object), 2));
    }
  };

  const addTestResult = (test: string, result: string, success: boolean) => {
    setTestResults(prev => [...prev, { test, result, success }]);
  };

  return (
    <div className="min-h-screen bg-[#fff5ef] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-[#fc5d01] mb-6">Firebase Connection Test</h1>
        
        <div className="mb-6">
          <p className="text-lg mb-2"><strong>Current Origin:</strong> {origin}</p>
          <p className="text-lg mb-4"><strong>Status:</strong> {status}</p>
          
          <div className="flex space-x-4">
            <button
              onClick={runReadTest}
              className="py-2 px-4 bg-[#fc5d01] text-white rounded hover:bg-[#fd7f33] focus:outline-none focus:ring-2 focus:ring-[#fc5d01]"
            >
              Test Read Operation
            </button>
            
            <button
              onClick={runWriteTest}
              className="py-2 px-4 bg-[#fc5d01] text-white rounded hover:bg-[#fd7f33] focus:outline-none focus:ring-2 focus:ring-[#fc5d01]"
            >
              Test Write Operation
            </button>
          </div>
        </div>
        
        {testResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#fc5d01] mb-3">Test Results</h2>
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded ${test.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                >
                  <p className="font-bold">{test.test}</p>
                  <p>{test.result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-[#fc5d01] mb-3">Error Details</h2>
            <div className="bg-red-50 p-4 rounded overflow-auto max-h-96">
              <pre className="text-red-800 whitespace-pre-wrap">{error}</pre>
            </div>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-[#fedac2] bg-opacity-30 rounded border border-[#fdbc94]">
          <h2 className="text-xl font-bold text-[#fc5d01] mb-3">Troubleshooting Tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensure Firebase security rules allow read/write operations from your domain</li>
            <li>Check that all Firebase environment variables are correctly set</li>
            <li>Verify that your Firebase project is properly configured for web use</li>
            <li>Make sure your Firebase project has Firestore enabled</li>
            <li>Check for CORS issues if operations fail from production but work locally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
