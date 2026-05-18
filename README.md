# ShareSwap — ARC Testnet DeFi dApp

> **Built by [RazzShares](https://x.com/Razzshares)** · Powered by [ARC App Kit](https://docs.arc.io)

A production-ready Web3 dApp for the **ARC Testnet** featuring same-chain token swaps, NFT minting, a portfolio dashboard, activity feed, and community pages — all in a futuristic dark glassmorphic UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔄 **Token Swap** | Swap USDC, EURC, USDT, USDe, DAI, PYUSD using ARC App Kit |
| 🖼️ **NFT Mint** | Upload images, add metadata, mint ERC-721 NFTs |
| 📊 **Portfolio** | Wallet balances, NFT holdings, asset overview |
| ⚡ **Activity Feed** | Full transaction history with explorer links |
| 👥 **Community** | Creator profile, share activity, ecosystem links |
| 🌐 **Multi-Wallet** | MetaMask, Rabby, Zerion, WalletConnect, Rainbow |

---

## 🛠 Tech Stack

- **Next.js 14** — App Router, SSR
- **TypeScript** — strict type safety
- **TailwindCSS** — utility-first styling with custom theme
- **Wagmi v2** — EVM wallet hooks
- **RainbowKit** — wallet connection UI
- **Viem** — TypeScript Ethereum client
- **@circle-fin/app-kit** — ARC swap/bridge SDK
- **Framer Motion** — smooth animations
- **react-hot-toast** — notifications
- **react-dropzone** — image uploads

---

## 🌐 ARC Testnet

| Property | Value |
|---|---|
| Network Name | ARC Testnet |
| Chain ID | `5042002` |
| RPC URL | `https://rpc.testnet.arc.network` |
| Gas Token | USDC |
| Explorer | [testnet.arcscan.net](https://testnet.arcscan.net) |
| Faucet | [faucet.circle.com](https://faucet.circle.com) |

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/Razzshare102/arctestnet
cd arctestnet
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id   # https://cloud.walletconnect.com
NEXT_PUBLIC_ARC_KIT_KEY=your_key               # https://console.circle.com

# Optional (already has defaults)
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_EXPLORER_URL=https://testnet.arcscan.net
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...         # After deploying the contract
```

### 3. Run development server

```bash
npm run dev
# → http://localhost:3000
```

---

## 📦 Folder Structure

```
arctestnet/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (providers, navbar, sidebar)
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles + TailwindCSS
│   ├── providers.tsx         # Wagmi + RainbowKit + ReactQuery
│   ├── swap/page.tsx         # Token swap page
│   ├── nft/page.tsx          # NFT mint page
│   ├── portfolio/page.tsx    # Portfolio dashboard
│   ├── activity/page.tsx     # Transaction activity feed
│   └── community/page.tsx    # Community & social page
├── components/
│   ├── layout/               # Navbar, Sidebar, Footer
│   └── ui/                   # Reusable UI components
│       ├── GlassCard.tsx
│       ├── Modal.tsx
│       ├── TxModal.tsx       # Transaction progress modal
│       ├── TokenSelect.tsx   # Searchable token dropdown
│       ├── StatCard.tsx      # Dashboard metric card
│       ├── Skeleton.tsx      # Loading skeletons
│       └── ConnectPrompt.tsx # Wallet connect CTA
├── lib/
│   ├── wagmi.ts              # Wagmi config + ARC chain definition
│   ├── arcKit.ts             # ARC App Kit integration
│   ├── nftContract.ts        # NFT ABI + helpers
│   └── utils.ts              # Utility functions
├── contracts/
│   ├── ShareSwapNFT.sol      # ERC-721 smart contract
│   └── deploy.js             # Hardhat deploy script
├── .env.example              # Environment variable template
├── tailwind.config.ts        # TailwindCSS with custom theme
├── next.config.js            # Next.js configuration
└── package.json
```

---

## 🔄 ARC App Kit — Swap Integration

The swap uses the official `@circle-fin/app-kit` SDK:

```typescript
import { AppKit } from '@circle-fin/app-kit'

const kit = new AppKit({ apiKey: process.env.NEXT_PUBLIC_ARC_KIT_KEY })

// Estimate
const estimate = await kit.estimateSwap({
  sourceToken: USDC_ADDRESS,
  destinationToken: EURC_ADDRESS,
  amount: '100',
  walletAddress: userAddress,
  chainId: 5042002,
  slippageTolerance: 50,  // 50 bps = 0.5%
})

// Execute
const result = await kit.swap({ ...params })
```

> **Get your API key:** [console.circle.com](https://console.circle.com)

---

## 🖼️ NFT Contract Deployment

### Prerequisites

```bash
npm install --save-dev hardhat @openzeppelin/contracts
```

### hardhat.config.js

```javascript
module.exports = {
  networks: {
    arcTestnet: {
      url: 'https://rpc.testnet.arc.network',
      chainId: 5042002,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
  solidity: '0.8.20',
}
```

### Deploy

```bash
DEPLOYER_PRIVATE_KEY=0x... npx hardhat run contracts/deploy.js --network arcTestnet
```

Copy the deployed address into `.env.local` as `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`.

---

## 🌍 Vercel Deployment

### Option A — One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Razzshare102/arctestnet)

### Option B — Manual

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted, set these environment variables in the Vercel dashboard:

| Key | Where to get |
|---|---|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [cloud.walletconnect.com](https://cloud.walletconnect.com) |
| `NEXT_PUBLIC_ARC_KIT_KEY` | [console.circle.com](https://console.circle.com) |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | After deploying ShareSwapNFT.sol |
| `NEXT_PUBLIC_PINATA_API_KEY` | [pinata.cloud](https://pinata.cloud) (for NFT uploads) |
| `PINATA_SECRET_API_KEY` | [pinata.cloud](https://pinata.cloud) |

---

## 🔑 Getting API Keys

| Service | URL | Purpose |
|---|---|---|
| WalletConnect | [cloud.walletconnect.com](https://cloud.walletconnect.com) | Wallet connection |
| Circle Console | [console.circle.com](https://console.circle.com) | ARC App Kit / Swap |
| Pinata | [pinata.cloud](https://pinata.cloud) | IPFS NFT uploads |
| ARC Faucet | [faucet.circle.com](https://faucet.circle.com) | Testnet USDC |

---

## 🧩 Wallet Support

- ✅ MetaMask
- ✅ Rabby Wallet
- ✅ Zerion Wallet
- ✅ WalletConnect (all compatible wallets)
- ✅ Rainbow Wallet
- ✅ Coinbase Wallet
- ✅ Any injected wallet

---

## 📣 Social

- Twitter/X: [@Razzshares](https://x.com/Razzshares)
- ARC Explorer: [testnet.arcscan.net](https://testnet.arcscan.net)
- ARC Docs: [docs.arc.io](https://docs.arc.io)

---

## ⚠️ Disclaimer

ShareSwap is a demo application deployed on ARC Testnet. It is not intended for production use with real funds. All tokens used are testnet tokens with no real monetary value.

---

*Built with ❤️ by [RazzShares](https://x.com/Razzshares) on [ARC Testnet](https://arc.network)*
