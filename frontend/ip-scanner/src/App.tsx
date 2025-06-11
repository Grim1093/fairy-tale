// frontend/ip-scanner/src/App.tsx

import React, { useCallback } from 'react';
import Particles from 'react-tsparticles'; // Import Particles
import type { Container, Engine } from 'tsparticles-engine'; // Import types for Particles
import { loadSlim } from 'tsparticles-slim'; // or 'tsparticles' if you need all features

import { darkTheme } from '@tomo-inc/tomo-evm-kit';
import { getDefaultConfig, TomoEVMKitProvider } from '@tomo-inc/tomo-evm-kit';
import { WagmiProvider, useAccount } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMaskWallet, walletConnectWallet, rainbowWallet } from '@tomo-inc/tomo-evm-kit/wallets';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import ConnectWallet from './components/ConnectWallet';
import AssetRegistrationForm from './components/AssetRegistrationForm';
import WalletInfo from './components/WalletInfo';
import Discover from './components/Discover';

import './App.css'; // Your main app CSS

const clientId = 'M2D8X5PfFWZOuBAInf6Pb7WzzAMfLJCtDxmJNz8dKyBhqt7aMDIChccKlwirA1q84qp9wnQ7PamudH0Lge1i4agW';
const projectId = '7f5d32e16e78242dfa5ee4ab4cb1f3d8';

const config = getDefaultConfig({
  clientId,
  appName: 'IP Scanner',
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
  wallets: [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, walletConnectWallet, rainbowWallet],
    },
  ],
});

const queryClient = new QueryClient();

function AppContent() {
  const { isConnected } = useAccount();

  // Initialize tsparticles engine
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    await loadSlim(engine); // 'tsparticles-slim' loads a smaller bundle
  }, []);

  // Callback for when particles are loaded
  const particlesLoaded = useCallback(async (container?: Container) => {
    console.log(container);
  }, []);

  // Define particle options for a calming, subtle effect
  const particlesOptions = {
    background: {
      color: {
        value: "transparent", // Background handled by App.css body and full-screen-center
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: false, // No click interaction
          mode: "push",
        },
        onHover: {
          enable: true, // Enable hover interaction
          mode: "grab", // Lines connect to mouse
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        grab: {
          distance: 150, // How far lines will reach
          links: {
            opacity: 0.2
          }
        },
      },
    },
    particles: {
      color: {
        value: "#7ab8ff", // Subtle blue for particles
      },
      links: {
        color: "#a0d9ff", // Lighter blue for lines
        distance: 150,
        enable: true,
        opacity: 0.1, // Very faint lines
        width: 1,
      },
      collisions: {
        enable: false,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 0.5, // Slow movement
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50, // Number of particles
      },
      opacity: {
        value: 0.3, // Faint particles
      },
      shape: {
        type: "circle", // Simple circles
      },
      size: {
        value: { min: 1, max: 3 }, // Small particle sizes
      },
    },
    detectRetina: true,
  };


  return (
    <Router>
      {!isConnected ? (
        // --- Show only ConnectWallet if not connected ---
        <div className="full-screen-center">
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particlesOptions as any} // Cast as any if TypeScript complains
            className="particles-background" // Add a class for styling
          />
          <img src="/shield-icon.svg" alt="Decentralized IP Scanner Logo" className="main-logo" />
          <h1 className="text-2xl text-center mt-10">Decentralized IP Scanner</h1>
          <p className="tagline">Protect, register, and discover digital intellectual property on the blockchain.</p>
          <ConnectWallet />
        </div>
      ) : (
        // --- Show navigation and content if connected ---
        <>
          {/* Updated navigation bar structure */}
          <nav className="main-nav">
            {/* Far Top Left: Register IP Link + Wallet Info */}
            <div className="nav-left">
              <Link to="/" className="nav-link nav-link-register">Register IP</Link>
              {isConnected && <WalletInfo />}
            </div>

            {/* Top Center: App Icon + Title */}
            <div className="nav-center">
              <img src="/shield-icon.svg" alt="IP Scanner Logo" className="nav-logo-small" />
              <span className="nav-app-title">IP Scanner</span>
            </div>

            {/* Far Top Right: Discover Link */}
            <div className="nav-right">
              <Link to="/discover" className="nav-link nav-link-discover">Discover</Link>
            </div>
          </nav>

          <Routes>
            {/* Home Route (Register IP page) */}
            <Route path="/" element={
              // Wrap content in a div to push it below the sticky nav
              <div className="page-content-wrapper">
                <AssetRegistrationForm />
              </div>
            } />

            {/* Discover Route -> Shows Infringement Scanner UI */}
            <Route path="/discover" element={<Discover />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider
          theme={darkTheme({ accentColor: "blue", accentColorForeground: "white" })}
          socialsFirst={false}
        >
          <AppContent />
        </TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;