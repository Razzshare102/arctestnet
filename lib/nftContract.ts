/**
 * NFT contract ABI and interaction helpers for ShareSwapNFT (ERC-721)
 */

// Minimal ABI for ShareSwapNFT
export const SHARESWAP_NFT_ABI = [
  // Read
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'tokensOfOwner',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    name: 'mintPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  // Write
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'tokenURI', type: 'string' }],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  // Events
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
  {
    name: 'Minted',
    type: 'event',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'tokenURI', type: 'string', indexed: false },
    ],
  },
] as const

export const NFT_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x0000000000000000000000000000000000000000'

// ── NFT Metadata builder ──────────────────────────────────────────────────────
export interface NFTMetadata {
  name: string
  description: string
  image: string            // IPFS URI or HTTPS URL
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
  background_color?: string
}

export function buildNFTMetadata(
  name: string,
  description: string,
  imageUri: string,
  creator: string,
): NFTMetadata {
  return {
    name,
    description,
    image: imageUri,
    external_url: `https://x.com/Razzshares`,
    attributes: [
      { trait_type: 'Creator', value: 'RazzShares' },
      { trait_type: 'Platform', value: 'ShareSwap' },
      { trait_type: 'Network', value: 'ARC Testnet' },
      { trait_type: 'Wallet', value: creator },
    ],
  }
}
