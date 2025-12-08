import yfinance as yf
import pandas as pd
import numpy as np

def get_data(ticker):
    # Get 5 days of 15-minute data
    data = yf.download(ticker, period="5d", interval="15m", progress=False)
    # yfinance often returns MultiIndex columns, flatten them
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.droplevel(1)
    return data

def check_ict_setup(ticker):
    df = get_data(ticker)
    
    # 1. IDENTIFY SWING HIGHS/LOWS (Fractals)
    # A swing high is a high surrounded by 2 lower highs on each side
    df['Swing_High'] = df['High'][
        (df['High'] > df['High'].shift(1)) & 
        (df['High'] > df['High'].shift(2)) & 
        (df['High'] > df['High'].shift(-1)) & 
        (df['High'] > df['High'].shift(-2))
    ]
    
    # 2. DETECT LIQUIDITY SWEEP (Bearish Setup Example)
    # We look for a candle that went ABOVE a recent Swing High but closed LOWER (or just swept it)
    last_swing_high = df['Swing_High'].last_valid_index()
    if not last_swing_high:
        return None
        
    swing_high_price = df.loc[last_swing_high, 'High']
    
    # Get recent candles (last 5)
    recent_candles = df.tail(5)
    
    sweep_detected = False
    displacement_candle = None
    
    for i, row in recent_candles.iterrows():
        # Did this candle sweep the high?
        if row['High'] > swing_high_price:
            sweep_detected = True
            
        # 3. DETECT DISPLACEMENT (MSS)
        # If we swept, look for a big RED candle afterwards
        if sweep_detected and row['Close'] < row['Open']:
            body_size = abs(row['Close'] - row['Open'])
            avg_body = df['High'].iloc[-20:].mean() - df['Low'].iloc[-20:].mean()
            
            # Is this a "Big" candle? (1.5x average size)
            if body_size > (avg_body * 1.5):
                displacement_candle = row
                break # Found our entry signal
    
    if displacement_candle is not None:
        return {
            "symbol": ticker,
            "status": "BEARISH SETUP",
            "swing_point": swing_high_price,
            "time": str(displacement_candle.name),
            "price": displacement_candle['Close']
        }
    
    return None