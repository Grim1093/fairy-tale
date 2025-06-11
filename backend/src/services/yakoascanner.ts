
// yakoaScanner.ts
import axios from "axios";
import dotenv from "dotenv";
import { sanitizeBigInts } from "../utils1/sanitizeBigInts";
dotenv.config();

const YAKOA_API_KEY = process.env.YAKOA_API_KEY!;
const SUBDOMAIN = process.env.YAKOA_SUBDOMAIN!;
const NETWORK = process.env.YAKOA_NETWORK!;
const REGISTER_TOKEN_URL = `https://${SUBDOMAIN}.ip-api-sandbox.yakoa.io/${NETWORK}/token`;

export async function registerToYakoa({
  Id,
  transactionHash,
  blockNumber,
  creatorId,
  metadata,
  media
}: {
  Id: string;
  transactionHash: `0x${string}`;
  blockNumber: bigint;
  creatorId: string;
  metadata: { [key: string]: string };
  media: { media_id: string; url: string }[];
}) {
  const timestamp = new Date().toISOString();
  try {
    const payload = {
      id: Id.toLowerCase(),
       // Ensure tokenId is lowercase
      registration_tx: {
        hash: transactionHash.toLowerCase(),
        block_number: blockNumber,
        timestamp,
      },
      creator_id: creatorId,
      metadata,
      media,
    };
    console.log("🧪 Raw Payload Before Sanitization:", payload);

    let sanitizedPayload;
try {
  sanitizedPayload = sanitizeBigInts(payload);
} catch (err) {
  console.error("🔥 Error in sanitizeBigInts:", err);
  throw err;
}
    console.log("💡 Yakoa Payload:", JSON.stringify(sanitizedPayload, null, 2));

    const response = await axios.post(
      REGISTER_TOKEN_URL,
      sanitizedPayload,
      {
        headers: {
          "X-API-KEY": YAKOA_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Yakoa Registration Response:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ Error registering to Yakoa:", err.response?.data || err.message);
    throw err;
  }
}
export async function getYakoaToken(id: string) {
  try {
    const response = await axios.get(`${REGISTER_TOKEN_URL}/${id}`, {
      headers: {
        "X-API-KEY": YAKOA_API_KEY,
      },
    });

    console.log("✅ Yakoa Token Data:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ Error fetching Yakoa token:", err.response?.data || err.message);
    throw err;
  }
}
