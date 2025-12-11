from pydantic import BaseModel

class WaitlistEntry(BaseModel):
    email: str

class ScanResult(BaseModel):
    symbol: str
    status: str
    price: float
    is_hot: bool
    time: str
