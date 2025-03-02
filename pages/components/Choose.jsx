"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { account } from "../../appwrite";
import ViewBookings from "./viewBookings";
import UpdateTurf from "./updateTurf";

const Choose = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await account.get();
      if (!user || !user.labels?.includes('admin')) {
        router.push('/');
        return;
      }
      setLoading(false);
    } catch (error) {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Admin Dashboard
        </h1>

        {!selectedComponent ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* View Bookings Card */}
            <div 
              onClick={() => setSelectedComponent('viewBookings')}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 border border-green-100"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                View Bookings
              </h2>
              <p className="text-gray-600 text-center">
                Check and manage all current turf bookings
              </p>
            </div>

            {/* Update Turf Card */}
            <div 
              onClick={() => setSelectedComponent('updateTurf')}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 border border-green-100"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                Update Turf
              </h2>
              <p className="text-gray-600 text-center">
                Modify turf details and settings
              </p>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedComponent(null)}
              className="mb-8 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Dashboard
            </button>
            
            {selectedComponent === 'viewBookings' && <ViewBookings />}
            {selectedComponent === 'updateTurf' && <UpdateTurf />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Choose;
