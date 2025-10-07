"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function TestAuthPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [apiResponse, setApiResponse] = useState<any>(null);

  const testApiCall = async () => {
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-dark dark:text-white mb-8">
          Authentication Test Page
        </h1>

        <div className="bg-white dark:bg-[#1f2329] rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 mb-8">
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">
            Clerk Status
          </h2>
          
          <div className="space-y-4">
            <div>
              <span className="font-medium">Is Loaded: </span>
              <span className={isLoaded ? "text-green-600" : "text-red-600"}>
                {isLoaded ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            
            <div>
              <span className="font-medium">Is Signed In: </span>
              <span className={isSignedIn ? "text-green-600" : "text-red-600"}>
                {isSignedIn ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            
            {user && (
              <div>
                <span className="font-medium">User ID: </span>
                <span className="text-gray-600 dark:text-gray-400">{user.id}</span>
              </div>
            )}
            
            {user && (
              <div>
                <span className="font-medium">Email: </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            )}
            
            {user && (
              <div>
                <span className="font-medium">Name: </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1f2329] rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 mb-8">
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">
            API Test
          </h2>
          
          <button
            onClick={testApiCall}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition mb-4"
          >
            Test API Call
          </button>
          
          {apiResponse && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 dark:text-gray-200">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {!isSignedIn && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Not Signed In
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              You need to sign in first to test the API calls.
            </p>
            <a
              href="/sign-in"
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
            >
              Go to Sign In
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
