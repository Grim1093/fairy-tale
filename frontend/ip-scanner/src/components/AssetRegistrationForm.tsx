// frontend/ip-scanner/src/components/AssetRegistrationForm.tsx

import React, { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import Particles from 'react-tsparticles'; // Import Particles
import type { Container, Engine } from 'tsparticles-engine'; // Import types for Particles
import { loadSlim } from 'tsparticles-slim'; // or 'tsparticles' if you need all features
import './AssetRegistrationForm.css'; // Import the CSS file


type Creator = {
  name: string;
  address: string;
};

type Attribute = {
  key: string;
  value: string;
};

export default function AssetRegistrationForm() {
  // IP Metadata state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [image, setImage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const { address: connectedAddress } = useAccount();
  const [confirmation, setConfirmation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  // Creators array state (no contribution)
  const [creators, setCreators] = useState<Creator[]>([
    { name: '', address: connectedAddress?.toLowerCase() || '' }
  ]);

  // NFT attributes as key-value pairs
  const [attributes, setAttributes] = useState<Attribute[]>([
    { key: '', value: '' }
  ]);

  // Handle creators change
  const handleCreatorChange = (index: number, field: keyof Creator, value: string) => {
    const newCreators = [...creators];
    newCreators[index][field] = field === 'address' ? value.toLowerCase() : value;
    setCreators(newCreators);
  };
  useEffect(() => {
    if (connectedAddress) {
      setCreators(prev => {
        const updated = [...prev];
        if (!updated[0]?.address || updated[0].address === '') {
          updated[0] = {
            ...updated[0],
            address: connectedAddress.toLowerCase(),
          };
        }
        return updated;
      });
    }
  }, [connectedAddress]);


  // Add new creator input row
  const addCreator = () => {
    setCreators([...creators, { name: '', address: '' }]);
  };

  const removeCreator = (index: number) => {
    setCreators(prev => prev.filter((_, i) => i !== index));
  };

  // Handle attributes change
  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };
  const removeNftAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== index));
  };

  // Add new attribute input row
  const addAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setConfirmation(null);

    const ipMetadata = {
      title,
      description,
      createdAt,
      creators,
      image,
      mediaUrl,
      mediaType,
    };

    const nftMetadata = {
      name: ipMetadata.title,
      description: ipMetadata.description,
      image: ipMetadata.image || ipMetadata.mediaUrl,
      attributes: attributes.filter(attr => attr.key && attr.value),
    };

    const payload = { ipMetadata, nftMetadata };

    console.log('Submitting data:', payload);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (response.ok) {
        const { story } = result;
        alert('Registration successful!');

        const explorerUrl = `https://aeneid.explorer.story.foundation/ipa/${story.ipId}`;

        setConfirmation({
          ipId: story.ipId,
          tokenId: story.tokenId,
          ipfsUrl: story.ipfsUrl,
          txHash: story.txHash,
          explorerUrl: explorerUrl,
        });

        // Reset form
        setTitle('');
        setDescription('');
        setCreatedAt('');
        setImage('');
        setMediaUrl('');
        setMediaType('');
        setCreators([{ name: '', address: connectedAddress?.toLowerCase() || '' }]);
        setAttributes([{ key: '', value: '' }]);
      } else {
        console.error('Backend registration failed:', result);
        alert('Registration failed!');
        setError(result.message || 'Something went wrong during registration.');
      }

    } catch (err: any) {
      console.error('Error submitting data:', err);
      alert('Registration failed!');
      setError(err.message || 'Something went wrong during submission.');
    } finally {
      setLoading(false); // ✅ Always stop loading
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
        value: "transparent", // Form's own background will show
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
    <div className="asset-form-wrapper"> {/* New wrapper div for positioning particles */}
      <Particles
        id="asset-form-particles"
        init={particlesInit}
        options={particlesOptions as any}
        className="form-particles-background"
      />
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto' }}>
        {/* NEW Logo/Icon */}
        <img src="/shield-icon.svg" alt="IP Asset Logo" className="form-logo" />
        <h2>IP Metadata</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Created At (timestamp)"
          value={createdAt}
          onChange={e => setCreatedAt(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Media URL"
          value={mediaUrl}
          onChange={e => setMediaUrl(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Media Type"
          value={mediaType}
          onChange={e => setMediaType(e.target.value)}
        />
        <br />

        <h3>Creators</h3>
        {creators.map((creator, i) => (
          // Changed style={{ marginBottom: 8 }} to className="form-row"
          <div key={i} className="form-row">
            <input
              type="text"
              placeholder="Creator Name"
              value={creator.name}
              onChange={e => handleCreatorChange(i, 'name', e.target.value)}
              required
            />
            <input
              type="text"
              value={creator.address}
              onChange={e => handleCreatorChange(i, 'address', e.target.value)}
              disabled={i === 0}
              required
            />
            {creators.length > 1 && (
              <button
                type="button"
                onClick={() => removeCreator(i)}
                className="text-red-500 form-remove-button" /* Added form-remove-button */
                disabled={i === 0} // Disable remove button for the first creator
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {/* Changed style for button */}
        <button type="button" onClick={addCreator} className="form-add-button">
          + Add Creator
        </button>

        <h3>NFT Attributes (key-value pairs)</h3>
        {attributes.map((attr, i) => (
          // Changed style={{ marginBottom: 8 }} to className="form-row"
          <div key={i} className="form-row">
            <input
              type="text"
              placeholder="Attribute Key"
              value={attr.key}
              onChange={e => handleAttributeChange(i, 'key', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Attribute Value"
              value={attr.value}
              onChange={e => handleAttributeChange(i, 'value', e.target.value)}
              required
            />
            { attributes.length > 1 &&(
              <button
              type="button"
              onClick={() => removeNftAttribute(i)}
              className="text-red-500 form-remove-button" /* Added form-remove-button */
              disabled={i === 0} // Disable remove button for the first attribute
            >
              Remove
            </button>)}
          </div>
        ))}
        {/* Changed style for button */}
        <button type="button" onClick={addAttribute} className="form-add-button">
          + Add Attribute
        </button>

        <br />
        {/* Changed style for button */}
        <button type="submit" disabled={loading} className="form-submit-button">
          {loading ? 'Registering...' : 'Register IP Asset'}
        </button>
        {/* Changed style for p tag */}
        {loading && <p className="form-loading-message">⏳ Registering your IP...</p>}
        {confirmation && (
          <div className="confirmation-message">
            <h3 style={{ color: '#2ecc71' }}>✅ Registration Successful!</h3>
            <p><strong>IP ID:</strong> {confirmation.ipId}</p>
            <p><strong>Token ID:</strong> {confirmation.tokenId}</p>
            <p><a href={confirmation.ipfsUrl} target="_blank" style={{ color: '#2ecc71' }} rel="noopener noreferrer">📦 View on IPFS</a></p>
            <p><a href={confirmation.explorerUrl} target="_blank" style={{ color: '#2ecc71' }} rel="noopener noreferrer">🔗  Story Explorer</a></p>
            <p><strong>Transaction Hash:</strong> {confirmation.txHash}</p>
            <p>Check the <a href="https://aeneid.storyscan.io/" target="_blank" style={{ color: '#2ecc71' }} rel="noopener noreferrer">Transaction</a> for more details.</p>
          </div>
        )}
        {error && (
          <div className="error-message">
            <h3 style={{ color: '#e74c3c' }}>❌ Registration Failed</h3>
            <p>{error}</p>
          </div>
        )}
      </form>
    </div> /* Close asset-form-wrapper */
  );
}