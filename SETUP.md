# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 3: Start the Backend Server

In the `backend` directory:
```bash
npm start
```

The backend will run on `http://localhost:5000`

## Step 4: Start the Frontend Development Server

In a new terminal, navigate to the `frontend` directory:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Testing the Setup

1. Open `http://localhost:3000` in your browser
2. You should see the Pulse Platform interface
3. Navigate through the pages (Dashboard, Assets, News, Alerts, Portfolio)
4. The pages will be mostly empty - this is expected! The assessment task is to implement these pages.

## API Testing

You can test the backend API directly:
- `http://localhost:5000/api/health` - Health check
- `http://localhost:5000/api/stocks` - Get all stocks
- `http://localhost:5000/api/crypto` - Get all cryptocurrencies
- `http://localhost:5000/api/dashboard` - Get dashboard data

## Troubleshooting

- **Port already in use**: Change the port in `backend/server.js` or `frontend/vite.config.js`
- **CORS errors**: Make sure backend is running before frontend
- **Module not found**: Run `npm install` in both directories
- **Tailwind not working**: Make sure PostCSS config files are present

## Next Steps

Read `ASSESSMENT.md` for detailed task requirements.
