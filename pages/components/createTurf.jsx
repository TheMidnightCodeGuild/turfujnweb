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
          sports: sports.join(','),
          description,
          address,
          geolocation,
          price: Number(price),
          area: Number(area),
          rating: 0,
          amenities: selectedAmenities,
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-8 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800">
              Create New Turf
            </h2>
            {error && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
            )}
            {success && (
              <p className="mt-2 text-sm text-green-600 bg-green-50 rounded-lg p-3">{success}</p>
            )}
          </div>

          <form className="space-y-6" onSubmit={createTurf}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Turf Name"
                  className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                />
              </div>

              <div className="md:col-span-2">
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={geolocation}
                  onChange={(e) => setGeolocation(e.target.value)}
                  placeholder="Geolocation"
                  className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                />
              </div>

              <div>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price per hour"
                  className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                />
              </div>

              <div>
                <input
                  type="number"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Area in sq ft"
                  className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Sports Available</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {turfSports.map((sport) => (
                    <label key={sport} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={sports.includes(sport)}
                        onChange={() => handleSportsChange(sport)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded border-green-300"
                      />
                      <span className="ml-2 text-green-700">{sport}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenitiesChange(amenity)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded border-green-300"
                      />
                      <span className="ml-2 text-green-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-6 text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Create Turf
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTurf;
