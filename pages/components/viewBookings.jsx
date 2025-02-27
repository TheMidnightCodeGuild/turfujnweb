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

  if (loading) return <div className="text-center py-4">Loading bookings...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings found for this turf.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.$id} className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-700">Booking ID:</p>
                  <p className="text-gray-600">{booking.$id}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">User Name:</p>
                  <p className="text-gray-600">{booking.userId.name || 'Unknown User'}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Start Time:</p>
                  <p className="text-gray-600">{new Date(booking.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">End Time:</p>
                  <p className="text-gray-600">{new Date(booking.endTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Status:</p>
                  <p className={`font-medium ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {booking.status || 'pending'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBookings;
