import yfinance as yf
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def get_data(ticker):
    # Get more data (5 days) to calculate moving averages properly
    try:
        data = yf.download(ticker, period="5d", interval="15m", progress=False)
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.droplevel(1)
        return data
    except Exception as e:
        logger.error(f"Failed to fetch data for {ticker}: {e}")
        return pd.DataFrame()

def analyze_pair(ticker):
    try:
        df = get_data(ticker)
        if df.empty: return None

        # --- 1. GENERAL TREND ANALYSIS (The "Always On" Data) ---
        # Calculate 50 SMA (Simple Moving Average)
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        
        current_price = df['Close'].iloc[-1]
        sma_50 = df['SMA_50'].iloc[-1]
        
        # Default Status
        bias = "SIDEWAYS 💤"
        if current_price > sma_50:
            bias = "UPTREND 📈"
        elif current_price < sma_50:
            bias = "DOWNTREND 📉"

        # --- 2. STRICT ICT SETUP HUNTING ---
        df['Swing_High'] = df['High'][
            (df['High'] > df['High'].shift(1)) & 
            (df['High'] > df['High'].shift(2)) & 
            (df['High'] > df['High'].shift(-1)) & 
            (df['High'] > df['High'].shift(-2))
        ]
        
        ict_signal = None
        last_swing_high = df['Swing_High'].last_valid_index()
        
        if last_swing_high:
            swing_high_price = df.loc[last_swing_high, 'High']
            recent_candles = df.tail(5)
            
            sweep_detected = False
            for i, row in recent_candles.iterrows():
                if row['High'] > swing_high_price:
                    sweep_detected = True
                
                # Check for Bearish Displacement
                if sweep_detected and row['Close'] < row['Open']:
                    body_size = abs(row['Close'] - row['Open'])
                    avg_body = df['High'].iloc[-20:].mean() - df['Low'].iloc[-20:].mean()
                    
                    if body_size > (avg_body * 1.5):
                        ict_signal = "BEARISH ICT ENTRY ⚡"
                        break

        # --- 3. BUILD THE RESULT ---
        # If we found an ICT setup, that overrides the basic trend
        final_status = ict_signal if ict_signal else bias
        
        # Is this a "High Priority" notification?
        is_hot = True if ict_signal else False

        return {
            "symbol": ticker.replace("=X", ""), # Clean name here
            "status": final_status,
            "price": round(float(current_price), 4),
            "is_hot": is_hot, # Helper for frontend styling
            "time": str(df.index[-1].strftime('%H:%M'))
        }

    except Exception as e:
        logger.error(f"Error analyzing {ticker}: {e}")
        return None
