import { Request, Response } from 'express';
import { registerIpWithStory } from '../services/storyService';
import { registerToYakoa } from '../services/yakoascanner';

const handleRegistration = async (req: Request, res: Response) => {
  console.log("🔥 Entered handleRegistration");
  try {
    const { ipMetadata, nftMetadata, attributes } = req.body;
    console.log("📦 Received body:", req.body);

    // 1. Register on Story Protocol
    const {
      txHash,
      ipId,
      tokenId,
      ipfsUrl,
      blockNumber,
      explorerUrl
    } = await registerIpWithStory(ipMetadata, nftMetadata);
    console.log("✅ Story Protocol registration successful:", {
      txHash,
      ipId,
      tokenId,
      ipfsUrl,
      blockNumber,
      explorerUrl
    });

    // 2. Submit to Yakoa
    if (!ipId) {
  throw new Error("Missing ipId from Story Protocol response");
}


const Id = `${ipId?.toLowerCase()}:${tokenId}`;;
console.log("📞 Calling registerToYakoa...");

const yakoaResponse = await registerToYakoa({
  Id: Id,
  transactionHash: txHash as `0x${string}`,
  blockNumber,
  creatorId: ipMetadata.creators[0].address,
  metadata: {
    title: ipMetadata.title,
    description: ipMetadata.description,
  },
  media: [
    {
      media_id: ipMetadata.title,
      url: ipfsUrl,
    },
  ],
});






    return res.status(200).json({
      message: 'Registration successful',
      story: {
        txHash,
        ipId,
        tokenId: tokenId ? tokenId.toString() : null,
        ipfsUrl,
        explorerUrl,
         blockNumber: blockNumber.toString(),
      },
      yakoa: yakoaResponse,
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    return res.status(500).json({
      error: 'Registration failed',
      details: err instanceof Error ? err.message : err,
    });
  }
};

export default handleRegistration;
