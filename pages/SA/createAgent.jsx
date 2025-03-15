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
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center" style={{backgroundImage: "url('/images/bg.png')"}}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-center text-green-800">
            Create New Agent
          </h1>
          {error && (
            <p className="text-center text-red-600 bg-red-50 rounded-lg p-3">
              {error}
            </p>
          )}
          {success && (
            <p className="text-center text-green-600 bg-green-50 rounded-lg p-3">
              {success}
            </p>
          )}
        </div>

        <form className="space-y-6" onSubmit={createAgent}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create Agent
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAgent;
