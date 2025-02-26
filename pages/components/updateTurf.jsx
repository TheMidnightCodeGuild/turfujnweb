"use client";
import { useState, useEffect } from "react";
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

const UpdateTurf = ({ turf }) => {
  const [name, setName] = useState(turf?.name || '');
  const [sports, setSports] = useState(turf?.sports ? turf.sports.split(',') : []);
  const [description, setDescription] = useState(turf?.description || '');
  const [address, setAddress] = useState(turf?.address || '');
  const [geolocation, setGeolocation] = useState(turf?.geolocation || '');
  const [price, setPrice] = useState(turf?.price || 0);
  const [area, setArea] = useState(turf?.area || 0);
  const [selectedAmenities, setSelectedAmenities] = useState(turf?.amenities || []);
  const [image, setImage] = useState(turf?.image || '');
  const [galleryUrl, setGalleryUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (turf) {
      setName(turf.name || '');
      setSports(turf.sports ? turf.sports.split(',') : []);
      setDescription(turf.description || '');
      setAddress(turf.address || '');
      setGeolocation(turf.geolocation || '');
      setPrice(turf.price || 0);
      setArea(turf.area || 0);
      setSelectedAmenities(turf.amenities || []);
      setImage(turf.image || '');
    }
  }, [turf]);

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

  const addGalleryImage = async (e) => {
    e.preventDefault();
    try {
      // First create gallery document
      const galleryDoc = await databases.createDocument(
        "67b6e6480029852bb87e",
        "67bee9e700390b0419eb",
        ID.unique(),
        {
          image: galleryUrl
        }
      );

      // Update turf with new gallery reference
      const updatedGallery = [...(turf.gallery || []), galleryDoc.$id];
      
      await databases.updateDocument(
        "67b6e6480029852bb87e",
        "67bee7d1002f3d4812fd",
        turf.$id,
        {
          gallery: updatedGallery
        }
      );

      setSuccess("Gallery image added successfully!");
      setGalleryUrl("");
    } catch (error) {
      console.error("Error adding gallery image:", error);
      setError(error.message);
    }
  };

  const updateTurf = async (e) => {
    e.preventDefault();
    if (!turf?.$id) {
      setError("No turf ID found");
      return;
    }

    try {
      const updatedTurf = await databases.updateDocument(
        "67b6e6480029852bb87e",
        "67bee7d1002f3d4812fd", 
        turf.$id,
        {
          name,
          sports: sports.join(','),
          description,
          address,
          geolocation,
          price: Number(price),
          area: Number(area),
          amenities: selectedAmenities,
          image
        }
      );

      setSuccess("Turf updated successfully!");
      setError("");
    } catch (error) {
      console.error("Error updating turf:", error);
      setError(error.message);
      setSuccess("");
    }
  };

  if (!turf) {
    return <div>No turf data available</div>;
  }

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Update Turf
        </h2>
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-2 text-center text-sm text-green-600">{success}</p>
        )}
      </div>

      <form className="mt-8 space-y-6" onSubmit={updateTurf}>
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
            Update Turf
          </button>
        </div>
      </form>

      <form onSubmit={addGalleryImage} className="mt-8">
        <div className="space-y-4">
          <input
            type="text"
            value={galleryUrl}
            onChange={(e) => setGalleryUrl(e.target.value)}
            placeholder="Gallery Image URL"
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Gallery Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTurf;
