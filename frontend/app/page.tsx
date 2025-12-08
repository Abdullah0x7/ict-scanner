"use client"
import { useState, useEffect } from 'react';
import { Setup, fetchSetups as fetchSetupsApi, joinWaitlist } from './services/api';

export default function Home() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchSetups = async () => {
    setLoading(true);
    try {
      const data = await fetchSetupsApi();
      setSetups(data);
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
      <div className="mt-20 border-t border-slate-800 pt-10">
        
        {/* WAITLIST FORM */}
        <div className="max-w-xl mx-auto text-center mb-16">
          <h3 className="text-2xl font-bold text-white mb-2">
            Want alerts sent to your phone? 
          </h3>
          <p className="text-gray-400 mb-6">
            We are building a <b>Pro Mobile App</b> with push notifications for XAUUSD & GBPUSD. Join the waitlist to get early access.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('email') as HTMLInputElement;
            const email = input.value;
            const button = form.querySelector('button') as HTMLButtonElement;

            // 1. Set Loading State
            const originalText = button.innerText;
            button.innerText = "Joining...";
            button.disabled = true;

            try {
               // 2. Send to Backend
               await joinWaitlist(email);
               
               // 3. Success State
               alert(`Welcome to the Inner Circle! 🥂\nWe received: ${email}`);
               input.value = ""; // Clear input
            } catch (error) {
               console.error(error);
               alert("Something went wrong. Please try again.");
            } finally {
               // 4. Reset Button
               button.innerText = originalText;
               button.disabled = false;
            }
          }}>
            <input 
              name="email" // Added name attribute for easy access
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
              required 
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Waitlist
            </button>
          </form>         
          <p className="text-xs text-slate-500 mt-4">
            🔒 No spam. Unsubscribe at any time.
          </p>
        </div>

        {/* FOOTER & DISCLAIMER */}
        <footer className="text-center text-slate-600 text-xs md:text-sm py-10">
          <div className="max-w-2xl mx-auto border border-red-900/30 bg-red-900/10 p-4 rounded-lg">
            <p className="font-bold text-red-400 mb-1">⚠️ RISK DISCLAIMER</p>
            <p>
              Trading Forex, Commodities, and CFDs involves a high level of risk and may not be suitable for all investors. 
              <b>LiquidScan is an analysis tool, not financial advice.</b> The signals generated are based on historical data and algorithmic patterns. 
              You should never trade money you cannot afford to lose. Past performance is not indicative of future results.
            </p>
          </div>
          <p className="mb-2">
            &copy; {new Date().getFullYear()} LiquidScan Algorithms. All rights reserved.
          </p>
          
        </footer>

      </div>
    </div>
  );
}