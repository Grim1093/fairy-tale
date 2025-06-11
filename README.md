# 🛡️ Decentralized IP Scanner

A decentralized application (dApp) to register intellectual property (IP) on-chain, detect potential infringement, and verify ownership using **Story Protocol** and **Yakoa's API**.
---

## 🚀 Features

- **📝 IP Registration**
  - Register your IP assets on the Story Protocol blockchain.
  - Upload metadata and media.
  - Get transaction hash, IP ID, Token ID, and view on IPFS.

- **🔍 Infringement Scanner (Discover)**
  - Enter an IP ID and Token ID to check its authenticity.
  - View IP metadata, creator info, and status from Yakoa API.
  - Uses fallback mock data until an asset is searched.
  - Handles invalid asset gracefully.

- **🔗 On-Chain Integration**
  - Wallet connection using TomoEVMKit with MetaMask, WalletConnect, and Rainbow.
  - Uses Story Testnet (Aeneid) for IP registration.

- **🧠 Content Verification**
  - Leverages Yakoa’s API for content authenticity and infringement checks.
  - Provides access to registered content media via IPFS.



## 📦 Project Structure (High-Level)

story/
├── backend/                  # Node.js / Express.js backend for API interactions
│   └── src/                  # Backend source code (e.g., server.ts/js, API routes, story)
├── frontend/ip-scanner/      # React frontend application
│   ├── public/               # Static assets (e.g., index.html, shield-icon.svg)
│   ├── src/
│   │   ├── components/       # Reusable React components (AssetRegistrationForm, ConnectWallet, Discover, WalletInfo)
│   │   ├── services/         # API interaction logic (e.g., fetchStatus, API for registration)
│   │   ├── utils/            # Utility functions (e.g., shortenAddress)
│   │   ├── App.tsx           # Main application component and routing
│   │   └── App.css           # Global application styles
│   └── ...                   # Other frontend files (package.json, tsconfig.json, etc.)
└── README.md                 # This file## ⚙️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js (v18.x or higher recommended)
* npm (v8.x or higher recommended) or yarn
* Git

### 1. Clone the Repository

```bash
git clone [https://github.com/Grim1093/fairy-tale.git]
cd fairy tale # Navigate to your project root (e.g., 'story')
```

### 2.  Install Frontend Dependencies

```bash
cd frontend/ip-scanner
npm install # or yarn install
```

### 3. Install Backend Dependencies

```bash
cd ../../backend # Navigate back to project root, then into backend
npm install # or yarn install
```

### 4. Configure Environment Variables
Create a .env file in your frontend/ip-scanner directory and another in your backend directory.
```
frontend/ip-scanner/.env:

REACT_APP_CLIENT_ID=<Your TomoEVMKit/RainbowKit Client ID>
REACT_APP_PROJECT_ID=<Your WalletConnect Project ID>

backend/.env:

# Add any backend specific environment variables here
# E.g., API keys, blockchain RPC URLs, Story Protocol related keys
# STORY_PROTOCOL_API_KEY=your_key
# RPC_URL=your_rpc_url
```
5. Run the Applications
Start the Frontend
```Bash

cd frontend/ip-scanner
npm start # or yarn start
```
This will usually open the application in your browser at http://localhost:3000.

Start the Backend
```Bash

cd ../../backend # Navigate back to backend directory
npm start # or yarn start (or a specific command like `node src/server.js` if not configured in package.json)
```



