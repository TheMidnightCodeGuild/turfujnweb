"use client";
import { useState } from "react";
import { account, databases } from "../../appwrite";
import { ID } from "appwrite";

const CreateAgent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const createAgent = async (e) => {
    e.preventDefault();
    try {
      // Create user account
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );


      // Create agent document in database
      await databases.createDocument(
        "67b6e6480029852bb87e",
        "67bee89d000113343fe9",
        ID.unique(),
        {
          userId: userAccount.$id,
          name: name,
          email: email,
          
        }
      );

      setSuccess("Agent created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      console.error("Error creating agent:", error);
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create New Agent
          </h2>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
          {success && (
            <p className="mt-2 text-center text-sm text-green-600">{success}</p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={createAgent}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgent;
