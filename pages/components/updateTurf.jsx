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
      const galleryDoc = await databases.createDocument(
        "67b6e6480029852bb87e",
        "67bee9e700390b0419eb",
        ID.unique(),
        {
          image: galleryUrl
        }
      );

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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-8 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800">
              Update Turf Details
            </h2>
            {error && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
            )}
            {success && (
              <p className="mt-2 text-sm text-green-600 bg-green-50 rounded-lg p-3">{success}</p>
            )}
          </div>

          <form className="space-y-6" onSubmit={updateTurf}>
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

              <div className="md:col-span-2">
                <p className="text-lg font-semibold text-green-800 mb-3">Sports Available</p>
                <div className="flex flex-wrap gap-3">
                  {turfSports.map((sport) => (
                    <label key={sport} className="inline-flex items-center bg-green-50 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-100 transition duration-200">
                      <input
                        type="checkbox"
                        checked={sports.includes(sport)}
                        onChange={() => handleSportsChange(sport)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded border-green-300"
                      />
                      <span className="ml-2 text-green-800">{sport}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-lg font-semibold text-green-800 mb-3">Amenities</p>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="inline-flex items-center bg-green-50 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-100 transition duration-200">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenitiesChange(amenity)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded border-green-300"
                      />
                      <span className="ml-2 text-green-800">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-6 text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Update Turf
              </button>
            </div>
          </form>

          <div className="mt-12 border-t border-green-100 pt-8">
            <h3 className="text-2xl font-bold text-green-800 mb-6">Add Gallery Image</h3>
            <form onSubmit={addGalleryImage} className="space-y-4">
              <input
                type="text"
                value={galleryUrl}
                onChange={(e) => setGalleryUrl(e.target.value)}
                placeholder="Gallery Image URL"
                className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
              />
              <button
                type="submit"
                className="w-full py-3 px-6 text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Gallery Image
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTurf;
