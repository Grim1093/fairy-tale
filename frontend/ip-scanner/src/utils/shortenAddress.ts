// frontend/ip-scanner/src/utils/shortenAddress.ts

export const shortenAddress = (address?: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};