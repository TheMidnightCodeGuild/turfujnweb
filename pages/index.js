"use client";
import { useState} from "react";
import { account, databases } from "../appwrite";
import { useRouter } from 'next/router';

import UpdateTurf from "./components/updateTurf";
import ViewBookings from "./components/viewBookings";
import CreateBooking from "./components/CreateBooking";

const LoginPage = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [turf, setTurf] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Add function to fetch turf data with validation
  const fetchTurfData = async (agentData) => {
    try {
      if (agentData.turfs && agentData.turfs.length > 0) {
        const turfId = agentData.turfs[0].$id;
        
        // Validate turf ID format
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

  const login = async (email, password) => {
    try {
      let user;
      
      try {
        // First try to get existing session
        user = await account.get();
      } catch {
        // If no session exists, create new one
        await account.createEmailPasswordSession(email, password);
        user = await account.get();
      }
      
      // Check if user has admin label
      if (!user.labels || !user.labels.includes('admin')) {
        await account.deleteSession("current");
        setError("Access denied. Admin access required.");
        return;
      }

      // Fetch agent details
      const agentData = await databases.listDocuments(
        "67b6e6480029852bb87e",
        "67bee89d000113343fe9"
      );
      
      const userAgent = agentData.documents.find(doc => doc.userId === user.$id);
      
      if (!userAgent) {
        await account.deleteSession("current");
        setError("Agent account not found.");
        return;
      }

      setLoggedInUser(user);
      setAgent(userAgent);
      // Fetch turf data after setting agent
      await fetchTurfData(userAgent);
      setError("");
      router.push('/Dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(null);
    setAgent(null);
    setTurf(null);
    setError("");
  };

  if (loggedInUser && agent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-green-800">
                  Welcome, {loggedInUser.name}!
                </h2>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-8">
                <ViewBookings turf={turf}/>
              </div>
              <div className="bg-green-50 rounded-lg p-4 mb-8">
                <UpdateTurf turf={turf}/>
              </div>
              <div className="bg-green-50 rounded-lg p-4 mb-8">
                <h2 className="text-xl font-semibold text-green-800 mb-4">Create Manual Booking</h2>
                <CreateBooking turfId={turf?.$id} />
              </div>

              <button
                type="button"
                onClick={logout}
                className="w-full py-3 px-6 text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center" style={{backgroundImage: "url('/images/bgadmin.png')"}}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center text-green-800">
            Hi Turf Owner!
          </h1>
          <h2 className="text-2xl font-semibold text-center text-green-700">
            Sign in to your account
          </h2>
          {error && (
            <p className="text-center text-red-600 bg-red-50 rounded-lg p-3">
              {error}
            </p>
          )}
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => login(email, password)}
            className="w-full py-3 px-6 text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
