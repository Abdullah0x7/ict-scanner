from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import ThreadPoolExecutor
from pydantic import BaseModel # New Import
from scanner import analyze_pair 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NEW: Define the shape of the data we expect ---
class WaitlistEntry(BaseModel):
    email: str

# Existing Pairs List
FOREX_PAIRS = [
    "XAUUSD=X", "EURUSD=X", "GBPUSD=X", "USDJPY=X", "AUDUSD=X", 
    "USDCAD=X", "NZDUSD=X",
    "EURGBP=X", "EURJPY=X",
    "GBPJPY=X",
]

@app.get("/scan")
def scan_market():
    # ... (Keep your existing scan logic exactly as it is) ...
    active_setups = []
    
    def scan_single_pair(ticker):
        try:
            data = analyze_pair(ticker)
            return data
        except Exception as e:
            print(f"Error scanning {ticker}: {e}")
            return None

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(scan_single_pair, FOREX_PAIRS)
    
    for res in results:
        if res:
            active_setups.append(res)
            
    return {"active_setups": active_setups}

# --- NEW: The Waitlist Endpoint ---
@app.post("/waitlist")
def join_waitlist(entry: WaitlistEntry):
    # For now, we print to the Console (Render Logs)
    # Since Render wipes files on restart, we can't save to a .txt file safely.
    # In the future, we will save this to a Postgres Database.
    print(f"🔥 NEW LEAD: {entry.email}")
    
    return {"message": "Success", "email": entry.email}