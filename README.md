# IBKR Trading Bot

## Overview

IBKR Trading Bot is an automated trading application that integrates with Interactive Brokers (IBKR) to execute trading strategies. The project consists of a backend server built with Node.js/TypeScript and a React-based frontend client for monitoring and controlling trading activities.

The bot supports both Interactive Brokers and Alpaca as data providers, allowing users to implement and execute various trading strategies with real-time market data.

## Project Structure

```
ibkr-trading-bot/
├── app/                    # Backend server
│   ├── app.ts              # Main server application
│   ├── interactive-data-handler.ts  # IBKR data handling
│   ├── alpaca-data-handler.ts       # Alpaca data handling
│   └── utils/              # Utility functions
├── client/                 # Frontend application
│   └── ibkr-bot/           # React client
│       ├── src/            # Source code
│       │   ├── api/        # API integration
│       │   ├── components/ # UI components
│       │   ├── hooks/      # React hooks
│       │   ├── pages/      # Application pages
│       │   ├── utils/      # Utility functions
│       │   ├── consts/     # Constants
│       │   └── assets/     # Static assets
│       ├── public/         # Public assets
│       └── ...             # Configuration files
└── README.md               # This file
```

## Features

-   Integration with Interactive Brokers API for trading
-   Alternative integration with Alpaca Markets API
-   Real-time market data processing
-   Custom trading strategy implementation
-   Web-based dashboard for monitoring and control
-   Historical data analysis

## Prerequisites

-   Node.js (v14 or higher)
-   Interactive Brokers account or Alpaca Markets account
-   IBKR Trader Workstation (TWS) or IB Gateway (for IBKR integration)

## Installation

### Backend Setup

1. Navigate to the project root directory:

    ```
    cd ibkr-trading-bot
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Configure your environment variables (create a `.env` file in the root directory)

4. Start the backend server:
    ```
    npm start
    ```

### Frontend Setup

1. Navigate to the client directory:

    ```
    cd client/ibkr-bot
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Start the development server:

    ```
    npm run dev
    ```

4. Access the dashboard at `http://localhost:5173`

## Configuration

The application requires configuration for connecting to your brokerage account:

1. For IBKR: Ensure TWS or IB Gateway is running and configured to accept API connections
2. For Alpaca: Provide your API key and secret in the environment variables

Example `.env` configuration:

```
# For IBKR
IBKR_HOST=127.0.0.1
IBKR_PORT=7496
IBKR_CLIENT_ID=1

# For Alpaca
ALPACA_API_KEY=your_api_key
ALPACA_API_SECRET=your_api_secret
```

## Usage

1. Start the backend server
2. Launch the frontend application
3. Configure your trading strategies through the web interface
4. Monitor your active trades and performance metrics

## Trading Strategies

The system comes with several pre-configured trading strategies that can be enabled and customized through the dashboard. You can also implement custom strategies by adding new strategy files.

## Development

This project uses:

-   TypeScript for type-safe code
-   React for the frontend UI
-   Vite as the frontend build tool
-   Node.js for the backend server

To contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Disclaimer

This software is for educational and informational purposes only. Trading financial instruments carries significant risk. Use this software at your own risk.
