"use client";
import { useState, useEffect } from "react";
import { account, databases } from "../appwrite";
import CreateTurf from "./components/createTurf";
import UpdateTurf from "./components/updateTurf";

const LoginPage = () => {
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
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome, {loggedInUser.name}!</h2>
            {/* {turf ? (
              <UpdateTurf turf={turf} />
            ) : (
              <CreateTurf agent={agent} />
            )} */}
                          <UpdateTurf turf={turf} />

          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hi Admin!
          </h2>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => login(email, password)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
