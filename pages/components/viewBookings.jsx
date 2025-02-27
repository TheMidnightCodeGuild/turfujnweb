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
        // Check if turf prop exists and has required data
        if (!turf) {
          setError('No turf data provided');
          setLoading(false);
          window.location.reload();
          return;
        }

        // Validate turf object has required properties
        if (!turf.$id || typeof turf.$id !== 'string') {
          setError('Invalid turf data - missing or invalid ID');
          setLoading(false);
          return;
        }

        // Fetch bookings for this turf
        const response = await databases.listDocuments(
          "67b6e6480029852bb87e",
          "67c00b040018e4517b74",
          [
            Query.equal('turfId', turf.$id),
            Query.orderDesc('$createdAt') // Show newest bookings first
          ]
        );

        if (!response || !response.documents) {
          setError('Failed to fetch booking data');
          setLoading(false);
          return;
        }

        // Get unique user IDs from bookings
        const userIds = [...new Set(response.documents.map(booking => booking.userId))];
        
        // Validate user IDs
        const validUserIds = userIds.filter(userId => 
          typeof userId === 'string' && 
          userId.length <= 36 && 
          !userId.startsWith('_') &&
          /^[a-zA-Z0-9_]+$/.test(userId)
        );

        // Fetch user details in parallel
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

        // Build user map, filtering out failed requests
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

  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center my-4">
      Error: {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-green-100">
          <h2 className="text-2xl font-bold text-green-800">Bookings Overview</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">No bookings found for this turf.</p>
          </div>
        ) : (
          <div className="divide-y divide-green-100">
            {bookings.map((booking) => (
              <div key={booking.$id} className="p-6 hover:bg-green-50 transition-colors duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-600">Booking Reference</p>
                    <p className="text-gray-900 font-mono">{booking.$id}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-600">Customer</p>
                    <p className="text-gray-900">{booking.userId.name || 'Unknown User'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-600">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status || 'pending'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-600">Start Time</p>
                    <p className="text-gray-900">
                      {new Date(booking.startTime).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-600">End Time</p>
                    <p className="text-gray-900">
                      {new Date(booking.endTime).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookings;
