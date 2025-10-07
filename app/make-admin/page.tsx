"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function MakeAdminPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const makeAdmin = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`✅ ${result.message}`);
        // Refresh the page after a short delay to update the navbar
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to make admin');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Not Signed In</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign in to make yourself an admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24]">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="bg-white dark:bg-[#1f2329] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-6 text-center">
            Make Yourself Admin
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click the button below to make yourself an admin. This will give you access to:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Admin panel for managing items</li>
              <li>Ability to approve/reject listings</li>
              <li>Add mock items to the database</li>
              <li>View all user accounts</li>
            </ul>
          </div>

          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Current User:</strong> {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={makeAdmin}
            disabled={loading}
            className="w-full rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-white shadow-sm transition-all duration-300 hover:bg-primary-dark hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Making Admin...
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Make Me Admin
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              After becoming admin, you can access the{' '}
              <a href="/admin" className="text-primary hover:text-primary-dark font-medium">
                Admin Panel
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
