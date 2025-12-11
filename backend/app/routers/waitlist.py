from fastapi import APIRouter
from app.models.schemas import WaitlistEntry
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/waitlist")
def join_waitlist(entry: WaitlistEntry):
    # In a real enterprise app, we'd use a DB session here.
    # For now, adhering to the structure but keeping it simple as per original
    # or potentially adding SQLite later.
    logger.info(f"NEW LEAD: {entry.email}")
    return {"message": "Success", "email": entry.email}
