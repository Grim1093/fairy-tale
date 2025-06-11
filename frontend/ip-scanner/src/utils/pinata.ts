export async function uploadFileToPinata(file: File): Promise<string> {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
      'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_API_KEY,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Pinata upload failed: ${res.statusText}`);
  }

  const data = await res.json();

  // The returned IPFS hash (CID)
  return data.IpfsHash;
}