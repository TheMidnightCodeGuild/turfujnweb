"use client";
import { useState, useEffect } from "react";
import { account, databases } from "../appwrite";
import ViewBookings from "./components/viewBookings";
import UpdateTurf from "./components/updateTurf";
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [turf, setTurf] = useState(null);
  const [error, setError] = useState("");

  const fetchTurfData = async (agentData) => {
    try {
      if (agentData.turfs && agentData.turfs.length > 0) {
        const turfId = agentData.turfs[0].$id;
        
        if (typeof turfId !== 'string' || turfId.length > 36 || /^_/.test(turfId)) {
          console.error("Invalid turf ID format:", turfId);
          setError("Invalid turf ID format in agent data");
          return;
        }

        const turfData = await databases.getDocument(
          "67b6e6480029852bb87e",
          "67bee7d1002f3d4812fd",
          turfId
        );
        setTurf(turfData);
      } else {
        console.log("No turfs found for agent");
        setTurf(null);
      }
    } catch (error) {
      console.error("Error fetching turf:", error);
      setError(`Error fetching turf data: ${error.message}`);
      setTurf(null);
    }
  };

  const checkAuth = async () => {
    try {
      const user = await account.get();
      if (!user || !user.labels?.includes('admin')) {
        router.push('/');
        return;
      }
      setLoggedInUser(user);

      const agentData = await databases.listDocuments(
        "67b6e6480029852bb87e",
        "67bee89d000113343fe9"
      );
      
      const userAgent = agentData.documents.find(doc => doc.userId === user.$id);
      
      if (!userAgent) {
        router.push('/');
        return;
      }

      setAgent(userAgent);
      await fetchTurfData(userAgent);
      
    } catch (error) {
      router.push('/');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    await account.deleteSession("current");
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="lg:max-w-[1300px] mx-auto px-4 py-12">
        <div className="max-w-[1300px] mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-black">
            <div className="p-8 flex justify-between items-center bg-gradient-to-r from-green-600 to-green-700">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  Welcome back, {loggedInUser?.name}
                </h2>
                <p className="text-green-100 font-medium">Manage your turf bookings and settings</p>
              </div>
              <button
                onClick={logout}
                className="px-6 py-2.5 bg-white text-green-700 rounded-lg  font-semibold shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bookings Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100 ">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Current Bookings
                </h3>
                <div className="bg-green-50 rounded-xl p-4 ">
                  <ViewBookings turf={turf}/>
                </div>
              </div>
            </div>

            {/* Update Turf Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100 ">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Turf Settings
                </h3>
                <div className="bg-green-50 rounded-xl p-4 ">
                  <UpdateTurf turf={turf}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;