from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import ThreadPoolExecutor
from scanner import analyze_pair 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# The "Standard 28" Forex Pairs + GOLD
FOREX_PAIRS = [
    # Commodities
    "XAUUSD=X",
    # Majors
    "EURUSD=X", "GBPUSD=X", "USDJPY=X", "AUDUSD=X", 
    "USDCAD=X", "USDCHF=X", "NZDUSD=X",
    # Euro Crosses
    "EURGBP=X", "EURJPY=X", "EURAUD=X", "EURCAD=X", "EURCHF=X", "EURNZD=X",
    # GBP Crosses
    "GBPJPY=X", "GBPAUD=X", "GBPCAD=X", "GBPCHF=X", "GBPNZD=X",
    # Others
    "AUDJPY=X", "AUDCAD=X", "AUDCHF=X", "AUDNZD=X",
    "CADJPY=X", "CADCHF=X", "CHFJPY=X", "NZDJPY=X"
]

@app.get("/scan")
def scan_market():
    active_setups = []
    
    def scan_single_pair(ticker):
        try:
            # We call the new function here
            data = analyze_pair(ticker)
            return data
        except Exception as e:
            print(f"Error scanning {ticker}: {e}")
            return None

    # ThreadPoolExecutor runs these tasks in parallel
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(scan_single_pair, FOREX_PAIRS)
    
    # Filter out None results
    for res in results:
        if res:
            active_setups.append(res)
            
    return {"active_setups": active_setups}