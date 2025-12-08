from fastapi import APIRouter
from concurrent.futures import ThreadPoolExecutor
from app.services.scanner import analyze_pair
from app.models.schemas import ScanResult
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Existing Pairs List
FOREX_PAIRS = [
    "XAUUSD=X", "EURUSD=X", "GBPUSD=X", "USDJPY=X", "AUDUSD=X",
    "USDCAD=X", "NZDUSD=X",
    "EURGBP=X", "EURJPY=X",
    "GBPJPY=X",
]

@router.get("/scan")
def scan_market():
    active_setups = []

    def scan_single_pair(ticker):
        try:
            data = analyze_pair(ticker)
            return data
        except Exception as e:
            logger.error(f"Error scanning {ticker}: {e}")
            return None

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(scan_single_pair, FOREX_PAIRS)

    for res in results:
        if res:
            active_setups.append(res)

    return {"active_setups": active_setups}
