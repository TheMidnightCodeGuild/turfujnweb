import { useState, useEffect } from 'react';
import { Button, Form, DatePicker, Select, Input } from 'antd';
import moment from 'moment';
import { databases } from '../../appwrite';
import { Query } from 'appwrite';
import { ID } from 'appwrite';

const TIME_SLOTS = [
  { label: '8:00 AM - 9:00 AM', value: '8am-9am' },
  { label: '9:00 AM - 10:00 AM', value: '9am-10am' },
  { label: '10:00 AM - 11:00 AM', value: '10am-11am' },
  { label: '11:00 AM - 12:00 PM', value: '11am-12pm' },
  { label: '12:00 PM - 1:00 PM', value: '12pm-1pm' },
  { label: '1:00 PM - 2:00 PM', value: '1pm-2pm' },
  { label: '2:00 PM - 3:00 PM', value: '2pm-3pm' },
  { label: '3:00 PM - 4:00 PM', value: '3pm-4pm' },
  { label: '4:00 PM - 5:00 PM', value: '4pm-5pm' },
  { label: '5:00 PM - 6:00 PM', value: '5pm-6pm' },
  { label: '6:00 PM - 7:00 PM', value: '6pm-7pm' },
  { label: '7:00 PM - 8:00 PM', value: '7pm-8pm' },
  { label: '8:00 PM - 9:00 PM', value: '8pm-9pm' },
  { label: '9:00 PM - 10:00 PM', value: '9pm-10pm' },
  { label: '10:00 PM - 11:00 PM', value: '10pm-11pm' },
  { label: '11:00 PM - 12:00 AM', value: '11pm-12am' }
];

const bookingStatus = ['Reserved', 'Confirmed', 'Cancelled'];

// Separate function to check slot availability
const checkSlotAvailability = async (turfId, date) => {
  try {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    
    const response = await databases.listDocuments(
      "67b6e6480029852bb87e",
      "67c00b040018e4517b74",
      [
        Query.equal('turfId', turfId),
        Query.equal('date', formattedDate),
        Query.notEqual('status', 'Cancelled')
      ]
    );

    // Get all unavailable slots from active bookings
    const unavailableSlots = response.documents
      .filter(booking => ['Reserved', 'Confirmed'].includes(booking.status))
      .flatMap(booking => booking.slots);

    return {
      unavailableSlots: [...new Set(unavailableSlots)] // Remove duplicates
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

const CreateBooking = ({ turfId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const checkAvailability = async () => {
    try {
      if (!selectedDate || !turfId) {
        console.log("Missing date or turfId", { selectedDate, turfId });
        return;
      }

      const formattedDate = selectedDate.format('YYYY-MM-DD');
      console.log("Checking availability for:", { turfId, date: formattedDate });

      // Fetch all bookings for this turf on selected date
      const response = await databases.listDocuments(
        "67b6e6480029852bb87e",
        "67c00b040018e4517b74",
        [
          Query.equal('turfId', turfId),
          Query.equal('date', formattedDate),
          Query.notEqual('status', 'Cancelled')
        ]
      );

      console.log("Found bookings:", response.documents);

      // Get all booked slots from active bookings
      const bookedSlots = [];
      response.documents.forEach(booking => {
        if (['Reserved', 'Confirmed'].includes(booking.status)) {
          console.log(`Booking ${booking.$id}:`, booking.slots);
          booking.slots.forEach(slot => bookedSlots.push(slot));
        }
      });

      console.log("Booked slots:", bookedSlots);
      setUnavailableSlots(bookedSlots);
      
      // Reset any selected slots that might now be unavailable
      setSelectedSlots(prev => prev.filter(slot => !bookedSlots.includes(slot)));
      form.setFieldsValue({ 
        slots: selectedSlots.filter(slot => !bookedSlots.includes(slot))
      });

    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking slot availability');
    }
  };

  // Update useEffect to ensure it runs when needed
  useEffect(() => {
    if (selectedDate && turfId) {
      console.log("Date changed, checking availability");
      checkAvailability();
    }
  }, [selectedDate, turfId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlots([]);
    form.setFieldsValue({ slots: [] });
  };

  const toggleSlot = (slotValue) => {
    if (unavailableSlots.includes(slotValue)) {
      return; // Don't allow selecting unavailable slots
    }

    setSelectedSlots(prev => {
      const newSlots = prev.includes(slotValue)
        ? prev.filter(slot => slot !== slotValue)
        : [...prev, slotValue].sort();

      form.setFieldsValue({ slots: newSlots });
      return newSlots;
    });
  };

  // Update isSlotDisabled to properly check unavailable slots
  const isSlotDisabled = (slot) => {
    // First check if the slot is booked
    if (unavailableSlots.includes(slot.value)) {
      console.log(`Slot ${slot.value} is booked`);
      return true;
    }

    // Then check if it's a past slot on the current day
    if (selectedDate && selectedDate.isSame(moment(), 'day')) {
      const currentHour = moment().hour();
      const slotHour = parseInt(slot.value.split('am')[0].split('pm')[0]);
      const isPastSlot = slotHour <= currentHour;
      if (isPastSlot) {
        console.log(`Slot ${slot.value} is in the past`);
      }
      return isPastSlot;
    }

    return false;
  };

  const handleSubmit = async (values) => {
    try {
      if (!selectedDate || selectedSlots.length === 0) {
        alert('Please select date and time slots');
        return;
      }

      setLoading(true);

      // Verify consecutive slots
      const sortedSlots = [...selectedSlots].sort();
      for (let i = 0; i < sortedSlots.length - 1; i++) {
        const current = TIME_SLOTS.findIndex(slot => slot.value === sortedSlots[i]);
        const next = TIME_SLOTS.findIndex(slot => slot.value === sortedSlots[i + 1]);
        if (next - current !== 1) {
          alert('Please select consecutive time slots only');
          return;
        }
      }

      const bookingData = {
        turfId,
        date: selectedDate.format('YYYY-MM-DD'),
        slots: sortedSlots,
        status: values.status,
        name: values.name,
      };

      await databases.createDocument(
        "67b6e6480029852bb87e",
        "67c00b040018e4517b74",
        ID.unique(),
        bookingData
      );

      alert('Booking created successfully!');
      form.resetFields();
      setSelectedDate(null);
      setSelectedSlots([]);
      setUnavailableSlots([]);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker 
          disabledDate={(current) => current && current < moment().startOf('day')}
          onChange={handleDateChange}
        />
      </Form.Item>

      <Form.Item
        label="Time Slots"
        name="slots"
        rules={[{ required: true, message: 'Please select time slots' }]}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '8px',
          marginBottom: '16px' 
        }}>
          {TIME_SLOTS.map(slot => {
            const isSelected = selectedSlots.includes(slot.value);
            const isDisabled = isSlotDisabled(slot);

            return (
              <Button
                key={slot.value}
                type={isSelected ? 'primary' : 'default'}
                onClick={() => toggleSlot(slot.value)}
                disabled={isDisabled}
                style={{
                  width: '100%',
                  backgroundColor: isDisabled ? '#f5f5f5' : isSelected ? '#1890ff' : 'white',
                  color: isDisabled ? '#999' : isSelected ? 'white' : 'rgba(0, 0, 0, 0.85)',
                  border: isSelected ? 'none' : '1px solid #d9d9d9',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {slot.label}
              </Button>
            );
          })}
        </div>
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Please select booking status' }]}
      >
        <Select
          placeholder="Select booking status"
          options={bookingStatus.map(status => ({ label: status, value: status }))}
        />
      </Form.Item>

      <Form.Item
        label="Customer Name"
        name="name"
        rules={[{ required: true, message: 'Please select customer name' }]}
      >
        <Input placeholder="Enter customer name" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Booking
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateBooking;
