"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchSetups = async () => {
    setLoading(true);
    try {
      // Connect to your Python Backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.get(`${apiUrl}/scan`);
      setSetups(res.data.active_setups);
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

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-4 text-center">ICT Market Scanner </h1>
      <p className="text-center text-gray-400 mb-8">Scanning for Liquidity Sweeps + MSS (15m Timeframe)</p>
      
      <div className="flex justify-center mb-8">
        <button 
          onClick={fetchSetups}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition"
        >
          {loading ? "Scanning..." : "Refresh Scan"}
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Last Updated: {lastUpdated}
      </div>

      {setups.length === 0 && !loading && (
         <div className="text-center text-xl text-gray-500">No active setups found. Market is messy. 😴</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setups.map((setup: any, index) => (
          <div key={index} className="bg-slate-800 border border-green-500 p-6 rounded-xl shadow-lg hover:shadow-green-500/20 transition">
            <h2 className="text-2xl font-bold text-green-400 mb-2">{setup.symbol}</h2>
            <div className="bg-black/30 p-3 rounded mb-4">
              <p className="text-gray-300">Signal: <span className="font-bold text-white">{setup.status}</span></p>
              <p className="text-gray-300">Swing Level: <span className="font-mono text-yellow-400">{setup.swing_point.toFixed(5)}</span></p>
            </div>
            <p className="text-xs text-gray-500">Detected at: {setup.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}