"use client";
import { useState, useEffect } from 'react';
import { databases } from "../../appwrite";
import { Query } from 'appwrite';

// Define time slots constant
const TIME_SLOTS = [
  { id: "8am-9am", label: "8:00 AM - 9:00 AM" },
  { id: "9am-10am", label: "9:00 AM - 10:00 AM" },
  { id: "10am-11am", label: "10:00 AM - 11:00 AM" },
  { id: "11am-12pm", label: "11:00 AM - 12:00 PM" },
  { id: "12pm-1pm", label: "12:00 PM - 1:00 PM" },
  { id: "1pm-2pm", label: "1:00 PM - 2:00 PM" },
  { id: "2pm-3pm", label: "2:00 PM - 3:00 PM" },
  { id: "3pm-4pm", label: "3:00 PM - 4:00 PM" },
  { id: "4pm-5pm", label: "4:00 PM - 5:00 PM" },
  { id: "5pm-6pm", label: "5:00 PM - 6:00 PM" },
  { id: "6pm-7pm", label: "6:00 PM - 7:00 PM" },
  { id: "7pm-8pm", label: "7:00 PM - 8:00 PM" },
  { id: "8pm-9pm", label: "8:00 PM - 9:00 PM" },
  { id: "9pm-10pm", label: "9:00 PM - 10:00 PM" },
  { id: "10pm-11pm", label: "10:00 PM - 11:00 PM" },
  { id: "11pm-12am", label: "11:00 PM - 12:00 AM" }
];

// Define status colors mapping
const STATUS_COLORS = {
  Reserved: {
    bg: "bg-yellow-100",
    text: "text-yellow-800"
  },
  Confirmed: {
    bg: "bg-green-100",
    text: "text-green-800"
  },
  Cancelled: {
    bg: "bg-red-100",
    text: "text-red-800"
  }
};

const ViewBookings = ({ turf }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

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

  // Helper function to format slots
  const formatSlots = (slots) => {
    return slots
      .sort()
      .map(slotId => TIME_SLOTS.find(slot => slot.id === slotId)?.label)
      .join(', ');
  };

  // Add new function to handle status updates
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await databases.updateDocument(
        "67b6e6480029852bb87e",  // database ID
        "67c00b040018e4517b74",  // collection ID
        bookingId,
        {
          status: newStatus
        }
      );

      // Update local state to reflect the change
      setBookings(bookings.map(booking => 
        booking.$id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  // Add function to filter bookings
  const filterBookings = (bookings) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      
      return activeTab === 'upcoming' 
        ? bookingDate >= now 
        : bookingDate < now;
    });
  };

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

      {/* Add Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 focus:outline-none ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-green-500 text-green-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming Bookings
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 focus:outline-none ${
            activeTab === 'past'
              ? 'border-b-2 border-green-500 text-green-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past Bookings
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">
            No {activeTab} bookings found for this turf
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filterBookings(bookings).map((booking) => (
              <div key={booking.$id} className="p-6 hover:bg-gray-50 transition duration-150">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="mt-1 text-gray-900 font-medium">{booking.name || 'Unknown User'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-gray-900">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Time Slots</p>
                    <p className="mt-1 text-gray-900">
                      {formatSlots(booking.slots)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${STATUS_COLORS[booking.status]?.bg || 'bg-gray-100'} 
                        ${STATUS_COLORS[booking.status]?.text || 'text-gray-800'}`}>
                        {booking.status || 'Reserved'}
                      </span>
                      <select
                        className="ml-2 text-sm border border-gray-300 rounded-md p-1"
                        value={booking.status || 'Reserved'}
                        onChange={(e) => handleStatusChange(booking.$id, e.target.value)}
                      >
                        <option value="Reserved">Reserved</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
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
