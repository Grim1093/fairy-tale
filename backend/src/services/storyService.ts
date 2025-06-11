import { mintNFT } from '../utils/functions/mintNFT';
import { createCommercialRemixTerms, NFTContractAddress } from '../utils/utils';
import { client, account, networkInfo } from '../utils/config';
import { uploadJSONToIPFS } from '../utils/functions/uploadToIpfs';
import { createHash } from 'crypto';
import { IpMetadata } from '@story-protocol/core-sdk';
import { publicClient } from '../utils/config';

export const registerIpWithStory = async (
  ipMetadata: IpMetadata,
  nftMetadata: any
) => {
  // 1. Upload Metadata to IPFS
  console.log('ipMetadata going to IPFS:', ipMetadata);
  const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
  const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');
  
  console.log('nftMetadata going to IPFS:', nftMetadata);
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
  const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

  // 2. Mint NFT with metadata
  const tokenId = await mintNFT(account.address, `https://ipfs.io/ipfs/${nftIpfsHash}`);
  console.log(`NFT minted with tokenId ${tokenId}`);

  // 3. Register IP on Story Protocol
  const response = await client.ipAsset.registerIpAndAttachPilTerms({
    nftContract: NFTContractAddress,
    tokenId: tokenId!,
    licenseTermsData: [
      {
        terms: createCommercialRemixTerms({
          defaultMintingFee: 1,
          commercialRevShare: 5,
        }),
      },
    ],
    ipMetadata: {
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}`,
    },
    txOptions: { waitForTransaction: true },
  });
  const receipt = await publicClient.getTransactionReceipt({ hash: response.txHash as `0x${string}` });

  return {
    txHash: response.txHash,
    ipId: response.ipId,
    blockNumber: receipt.blockNumber,
    tokenId: response.tokenId,
    ipfsUrl: `https://ipfs.io/ipfs/${ipIpfsHash}`,
    explorerUrl: `${networkInfo.protocolExplorer}/ipa/${response.ipId}`,
  };
};

