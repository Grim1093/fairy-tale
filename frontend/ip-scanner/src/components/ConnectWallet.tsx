// frontend/ip-scanner/src/components/ConnectWallet.tsx

import { useConnectModal } from '@tomo-inc/tomo-evm-kit';

const ConnectWallet = () => {
  const { openConnectModal } = useConnectModal();

  return (
    
      <button onClick={openConnectModal} className="p-3 bg-blue-600 text-white rounded">
        Connect Wallet
      </button>
  );
};

export default ConnectWallet;