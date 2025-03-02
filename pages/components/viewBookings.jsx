"use client";
import { useState, useEffect } from 'react';
import { databases } from "../../appwrite";
import { Query } from 'appwrite';

const ViewBookings = ({ turf }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    if (!turf) return;
    const fetchBookings = async () => {
      try {
        if (!turf) {
          setError('No turf data provided');
          setLoading(false);
          window.location.reload();
          return;
        }

        if (!turf.$id || typeof turf.$id !== 'string') {
          setError('Invalid turf data - missing or invalid ID');
          setLoading(false);
          return;
        }

        const response = await databases.listDocuments(
          "67b6e6480029852bb87e",
          "67c00b040018e4517b74",
          [
            Query.equal('turfId', turf.$id),
            Query.orderDesc('$createdAt')
          ]
        );

        if (!response || !response.documents) {
          setError('Failed to fetch booking data');
          setLoading(false);
          return;
        }

        const userIds = [...new Set(response.documents.map(booking => booking.userId))];
        
        const validUserIds = userIds.filter(userId => 
          typeof userId === 'string' && 
          userId.length <= 36 && 
          !userId.startsWith('_') &&
          /^[a-zA-Z0-9_]+$/.test(userId)
        );

        const userPromises = validUserIds.map(userId =>
          databases.getDocument(
            "67b6e6480029852bb87e",
            "67b6e68d002b1a248bad",
            userId
          )
        );

        const userResponses = await Promise.all(
          userPromises.map(p => p.catch(err => {
            console.error('Error fetching user:', err);
            return null;
          }))
        );

        const userMap = {};
        userResponses.forEach(user => {
          if (user && user.$id) {
            userMap[user.$id] = user.name;
          }
        });

        setUsers(userMap);
        setBookings(response.documents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [turf]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bookings Overview</h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {bookings.length} Total
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">No bookings found for this turf</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking.$id} className="p-6 hover:bg-gray-50 transition duration-150">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="mt-1 text-gray-900 font-medium">{users[booking.userId] || 'Unknown User'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p className="mt-1 text-gray-900">
                      {new Date(booking.startTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="mt-1 text-gray-900">
                      {Math.round((new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60))} minutes
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookings;
