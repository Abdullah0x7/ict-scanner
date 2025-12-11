# LiquidScan 2.0

## Overview

LiquidScan is a real-time Forex market scanner that detects "ICT" (Inner Circle Trader) setups and liquidity sweeps. It consists of a FastAPI backend for market analysis and a Next.js frontend for visualization.

## Architecture

The project is structured into two main components:

### Backend (`backend/`)

-   **Framework**: FastAPI
-   **Data Source**: `yfinance` (Yahoo Finance API)
-   **Architecture**: Modular design with Routers, Services, and Models.
    -   `app/routers/`: API endpoints (`/scan`, `/waitlist`)
    -   `app/services/`: Core logic (e.g., market scanner algorithm)
    -   `app/models/`: Pydantic models for request/response validation
    -   `app/core/`: Configuration settings
-   **Testing**: `pytest` for unit and integration testing.

### Frontend (`frontend/`)

-   **Framework**: Next.js 15 (React 19)
-   **Styling**: Tailwind CSS
-   **State Management**: React Hooks (`useState`, `useEffect`)
-   **API Integration**: Axios

## Setup & Installation

### Prerequisites

-   Python 3.9+
-   Node.js 18+
-   npm or yarn

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Run the server:
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

5.  Run tests:
    ```bash
    pytest
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Configuration

### Environment Variables

-   **Backend**: No specific env vars required for basic local run. Use `backend/app/core/config.py` for settings.
-   **Frontend**: Create a `.env.local` file in `frontend/` if needed.
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

## Deployment

The project is ready for deployment.
-   **Backend**: Can be deployed to Render, Railway, or any Python-capable host.
-   **Frontend**: Can be deployed to Vercel, Netlify, or similar.

## License

Private / Proprietary
