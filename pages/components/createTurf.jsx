"use client";
import { useState } from "react";
import { databases, ID } from "../../appwrite";

const turfSports = [
  "Football",
  "Basketball", 
  "Tennis",
  "Cricket",
  "Hockey",
];

const amenities = [
  "Bathroom",
  "Washroom", 
  "UPI-Accepted",
  "Card-Accepted",
  "Changing-Room",
  "Free-Parking",
  "Showers",
  "Cricket-Kit",
  "Stumps-Provided",
];

const CreateTurf = ({ agent }) => {
  const [name, setName] = useState("");
  const [sports, setSports] = useState([]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [geolocation, setGeolocation] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSportsChange = (sport) => {
    if (sports.includes(sport)) {
      setSports(sports.filter(s => s !== sport));
    } else {
      setSports([...sports, sport]);
    }
  };

  const handleAmenitiesChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const createTurf = async (e) => {
    e.preventDefault();
    try {
      // Create turf document
      const turf = await databases.createDocument(
        "67b6e6480029852bb87e",
        "67bee7d1002f3d4812fd",
        ID.unique(),
        {
          name,
          sports: sports.join(','), // Convert array to comma-separated string
          description,
          address,
          geolocation,
          price: Number(price),
          area: Number(area),
          rating: 0,
          amenities: selectedAmenities, // Keep as array instead of converting to string
          image,
          agent: agent.$id,
          reviews: [],
          gallery: []
        }
      );

      // Update agent with turf reference
      if (agent && agent.$id) {
        await databases.updateDocument(
          "67b6e6480029852bb87e", 
          "67bee89d000113343fe9",
          agent.$id,
          {
            turfs: [...(agent.turfs || []), turf.$id]
          }
        );
      }

      setSuccess("Turf created successfully!");
      // Reset form
      setName("");
      setSports([]);
      setDescription("");
      setAddress("");
      setGeolocation("");
      setPrice("");
      setArea("");
      setSelectedAmenities([]);
      setImage("");
      setError("");
    } catch (error) {
      console.error("Error creating turf:", error);
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create New Turf
        </h2>
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-2 text-center text-sm text-green-600">{success}</p>
        )}
      </div>

      <form className="mt-8 space-y-6" onSubmit={createTurf}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Turf Name"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <input
              type="text"
              required
              value={geolocation}
              onChange={(e) => setGeolocation(e.target.value)}
              placeholder="Geolocation"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per hour"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <input
              type="number"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Area in sq ft"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Sports Available</p>
            <div className="flex flex-wrap gap-2">
              {turfSports.map((sport) => (
                <label key={sport} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={sports.includes(sport)}
                    onChange={() => handleSportsChange(sport)}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{sport}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <label key={amenity} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenitiesChange(amenity)}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Turf
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTurf;
