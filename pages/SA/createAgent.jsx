"use client";
import { useState } from "react";
import { account, databases } from "../../appwrite";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";

const CreateAgent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const createAgent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create user account
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // Create agent document in database
      const agentDoc = await databases.createDocument(
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
      
      // Redirect to createTurf page with the agent's document ID
      router.push(`/SA/createTurf?agentId=${agentDoc.$id}`);
    } catch (error) {
      console.error("Error creating agent:", error);
      setError(error.message);
      setSuccess("");
    } finally {
      setLoading(false);
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
            <div className="text-center bg-green-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-center text-green-600">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p>{success}</p>
              </div>
            </div>
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
            disabled={loading}
            className="w-full py-3 px-6 text-white bg-green-600 hover:bg-green-700 rounded-lg transition duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Agent...
              </>
            ) : (
              'Create Agent'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAgent;
