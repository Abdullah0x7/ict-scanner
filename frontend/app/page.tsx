"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the shape of our data for TypeScript
interface Setup {
  symbol: string;
  status: string;
  price: number;
  is_hot: boolean;
  time: string;
}

export default function Home() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchSetups = async () => {
    setLoading(true);
    try {
      // Use the environment variable for production, fallback to localhost for dev
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.get(`${apiUrl}/scan`);
      
      // Sort the results: 'is_hot' (ICT Setups) go to the top
      const sortedData = res.data.active_setups.sort((a: Setup, b: Setup) => {
        // If a is hot and b is not, a comes first (-1)
        // If b is hot and a is not, b comes first (1)
        return (a.is_hot === b.is_hot) ? 0 : a.is_hot ? -1 : 1;
      });

      setSetups(sortedData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  // Run scanner immediately on load, then every 60 seconds
  useEffect(() => {
    fetchSetups();
    const interval = setInterval(fetchSetups, 60000); 
    return () => clearInterval(interval);
  }, []);

  // Helper function to get color based on status text
  const getStatusColor = (status: string) => {
    if (status.includes("ICT")) return "text-yellow-400 font-extrabold";
    if (status.includes("UPTREND")) return "text-green-400";
    if (status.includes("DOWNTREND")) return "text-red-400";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          ICT Market Scanner <span className="text-blue-500">2.0</span> 
        </h1>
        <p className="text-gray-400 mb-6">
          Real-time Liquidity Sweep & Trend Detection (15m Timeframe)
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={fetchSetups}
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg shadow-blue-500/30 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Scanning Markets..." : "Refresh Scan"}
          </button>
          
          <span className="text-xs text-slate-500 font-mono">
            Last Updated: {lastUpdated || "Never"}
          </span>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {setups.map((setup, index) => (
          <div 
            key={index} 
            className={`relative p-6 rounded-xl border transition duration-300 ${
                setup.is_hot 
                ? "bg-slate-800 border-yellow-500/50 shadow-xl shadow-yellow-500/10 scale-105 z-10"  // ICT Style (Hot)
                : "bg-slate-800/40 border-slate-700 hover:border-slate-600" // Standard Style
            }`}
          >
            {/* Hot Badge */}
            {setup.is_hot && (
              <div className="absolute -top-3 -right-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
                High Probability
              </div>
            )}

            {/* Symbol Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl font-bold tracking-wider ${setup.is_hot ? "text-white" : "text-gray-300"}`}>
                    {setup.symbol}
                </h2>
                {setup.is_hot && <span className="text-2xl">⚡</span>}
            </div>

            {/* Data Box */}
            <div className="bg-black/20 p-4 rounded-lg mb-3 border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-gray-400 text-sm uppercase">Status</span>
                 <span className={`text-sm ${getStatusColor(setup.status)}`}>
                    {setup.status}
                 </span>
              </div>
              
              <div className="flex justify-between items-center">
                 <span className="text-gray-400 text-sm uppercase">Price</span>
                 <span className="text-gray-200 font-mono">
                    {setup.price}
                 </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                    15m Chart
                </span>
                <p className="text-xs text-slate-500 font-mono">
                    {setup.time}
                </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (Just in case API fails) */}
      {setups.length === 0 && !loading && (
         <div className="text-center text-gray-500 mt-20">
            <p>No data received. Is the backend running?</p>
         </div>
      )}
    </div>
  );
}