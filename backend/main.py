from fastapi import FastAPI
from scanner import check_ict_setup
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow your Next.js app to talk to this Python app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

watchlist = ["EURUSD=X", "GBPUSD=X", "AUDUSD=X", "USDJPY=X"]

@app.get("/scan")
def scan_market():
    results = []
    for pair in watchlist:
        setup = check_ict_setup(pair)
        if setup:
            results.append(setup)
    
    return {"active_setups": results}

# To run: uvicorn main:app --reload