"use client";
import { useState } from "react";
import { account } from "../appwrite";
import CreateAgent from "./SA/createAgent";

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      
      // Check if user has admin label
      if (!user.labels || !user.labels.includes('mvp')) {
        await account.deleteSession("current"); // Log them out if not admin
        setError("Access denied. Admin access required.");
        return;
      }

      setLoggedInUser(user);
      setError("");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(null);
    setError("");
  };

  if (loggedInUser) {
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
                <CreateAgent />
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
            Hi Super Admin!
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
