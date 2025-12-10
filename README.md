# Pulse Platform - MERN Stack Developer Assessment

## Company Mission

**Pulse** is a market monitoring engine and smart alerts platform designed to keep you ahead in the Stock and Crypto markets. Our platform monitors, filters, and analyzes impactful events to give you what actually matters, with AI Core accuracy benchmarked at 94% based on independent audit.

## Project Overview

This is a full-stack assessment project for hiring MERN stack developers. The project consists of:

- **Backend**: Node.js/Express API server with comprehensive mock data
- **Frontend**: React application with routing and modern UI framework
- **Mock Data**: Complex, realistic market data including stocks, cryptocurrencies, news, alerts, and AI insights

## Project Structure

```
React-assessment/
├── backend/
│   ├── server.js          # Express API server
│   ├── mockData.js        # Complex mock data for market monitoring
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── ...
│   └── package.json       # Frontend dependencies
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
# Server will run on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Application will run on http://localhost:3000
```

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:symbol` - Get specific stock
- `GET /api/crypto` - Get all cryptocurrencies
- `GET /api/crypto/:symbol` - Get specific cryptocurrency
- `GET /api/news` - Get all news (supports query params: category, impact, limit)
- `GET /api/news/asset/:assetSymbol` - Get news for specific asset
- `GET /api/alerts` - Get all alerts (supports query params: severity, asset)
- `GET /api/events` - Get all market events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/influencers` - Get influencer data
- `GET /api/portfolio` - Get portfolio data
- `GET /api/insights` - Get AI Core insights
- `GET /api/dashboard` - Get dashboard summary data

## Mock Data Structure

The mock data includes:

- **Stocks**: AAPL, TSLA, NVDA, MSFT, GOOGL with price history, alerts, sentiment, and metrics
- **Cryptocurrencies**: BTC, ETH, SOL with comprehensive market data
- **News**: Market news with categories, impact levels, and affected assets
- **Alerts**: Real-time alerts with severity levels and AI Core accuracy
- **Influencers**: Social media influencer predictions and sentiment
- **Market Events**: Scheduled events with AI Core predictions
- **Portfolio**: User portfolio with assets and performance
- **AI Insights**: Pattern recognition and anomaly detection insights

## Assessment Instructions

**Please refer to `ASSESSMENT.md` for detailed task requirements.**

## Notes

- MetaMask integration is included in the project but is **NOT part of the assessment task**
- The frontend structure is set up with routing and basic components
- All API services are configured and ready to use
- Tailwind CSS is configured for styling

## Technologies

- **Backend**: Node.js, Express, CORS
- **Frontend**: React, React Router, Axios, Recharts, Tailwind CSS
- **MetaMask**: Uses browser's native `window.ethereum` API (provided but not required for assessment)
