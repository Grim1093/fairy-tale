// frontend/ip-scanner/src/components/Discover.tsx

import React, { useState, useCallback } from 'react'; // Added useCallback
import Particles from 'react-tsparticles'; // Import Particles
import type { Container, Engine } from 'tsparticles-engine'; // Import types for Particles
import { loadSlim } from 'tsparticles-slim'; // or 'tsparticles' if you need all features
import { fetchStatus } from '../services/api';
import './Discover.css'; // Import the new CSS file


const mockStatus = {
  id: '0x1234567890abcdef:1001',
  metadata: {
    title: "Mock IP Asset",
    description: "This is a sample mock IP asset for display before search.",
  },
  media: [
    {
      url: 'https://ipfs.io/ipfs/bafkreian7kpw4zurhq2u4bvwrw6lvzb3p42zmdh7mozwkiqtlakkjsvmdq',
    },
  ],
  infringements: {
    result: 'not_checked',
  },
  creator_id: '0xabc123...', // Added mock creator_id
  registration_tx: { // Added mock registration_tx
    block_number: 1234567,
    hash: '0xdef456...',
  }
}


const Discover = () => {
  const [assetId, setAssetId] = useState('');
  const [status, setStatus] = useState<any>(mockStatus);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const checkStatus = async () => {
    if (!assetId) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchStatus(assetId);

      if (!data || !data.id) {
        setError('❌ No such asset available.');
        setStatus(null);
      } else {
        setStatus(data);
        setHasSearched(true);
      }
    } catch (err) {
      console.error('Error fetching status:', err);
      setError('❌ Error fetching asset status.');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize tsparticles engine
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  // Define particle options for a calming, subtle effect
  const particlesOptions = {
    background: {
      color: {
        value: "transparent", // Container's own background will show
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
    <div className="discover-wrapper"> {/* New wrapper div for particles and content */}
      <Particles
        id="discover-particles"
        init={particlesInit}
        options={particlesOptions as any}
        className="discover-particles-background"
      />
      <div className="discover-content"> {/* Inner div for content styling */}
        <h2 className="text-3xl font-bold mb-6 text-center">🔍 Discover Authentic Content</h2>
        <div className="search-section"> {/* Wrapper for input and button */}
          <input
            type="text"
            placeholder="Enter Asset ID (contract:tokenId)"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value.trim().toLowerCase())}
            className="search-input" 
          />
          <button
            onClick={checkStatus}
            className="search-button" 
            disabled={loading || !assetId}
          >
            {loading ? 'Checking...' : 'Discover'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>} {/* Use common error message class */}

        {status && (
          <div className="asset-details-card"> {/* Custom class for styling */}
            <p><strong>✔️ Authenticity Check:</strong> {status.infringements?.result === 'checked' ? '✅ Checked' : '❌ Not Yet Checked'}</p>
            <p><strong>🪪 Token ID:</strong> {status.id?.split(':')[1]}</p>
            <p><strong>📘 IP ID:</strong> {status.id?.split(':')[0]}</p>
            <p><strong>🎨 Title:</strong> {status.metadata?.title}</p>
            <p><strong>📝 Description:</strong> {status.metadata?.description}</p>
            <p><strong>👤 Registered By:</strong> {status.creator_id || 'N/A'}</p>
            <p><strong>⛓️ Registered On:</strong> {status.registration_tx?.block_number ? `Block #${status.registration_tx.block_number}` : 'N/A'}</p>

            <p><a
              href={`https://ipfs.io/ipfs/${status.media?.[0]?.url?.split('/').pop()}`}
              target="_blank"
              rel="noreferrer"
              className="details-link"
            >
              📦 View IPFS Media
            </a></p>
            <p><a
              href={`https://aeneid.storyscan.io/tx/${status.registration_tx?.hash}`}
              target="_blank"
              rel="noreferrer"
              className="details-link"
            >
              🔗 View Registration Tx
            </a></p>
            <p><a
              href={`https://aeneid.explorer.story.foundation/ipa/${status.id?.split(':')[0]}`}
              target="_blank"
              rel="noreferrer"
              className="details-link"
            >
              🌐 View on Story Explorer
            </a></p>
          </div>
        )}
      </div> 
    </div> 
  );
};

export default Discover;