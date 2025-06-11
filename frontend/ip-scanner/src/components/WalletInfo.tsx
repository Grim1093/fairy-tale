// frontend/ip-scanner/src/components/WalletInfo.tsx

import { useAccount, useDisconnect } from 'wagmi';
import { shortenAddress } from '../utils/shortenAddress'; // Import the utility

const WalletInfo = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return null; // Don't render anything if not connected, as per conditional rendering in App.tsx
  }

  return (
    <div className="wallet-info-container"> {/* Container for styling */}
      <span className="wallet-address">{shortenAddress(address)}</span>
      <button onClick={() => disconnect()} className="disconnect-button">
        Disconnect
      </button>
    </div>
  );
};

export default WalletInfo;