/**
 * Hardhat deploy script for ShareSwapNFT
 * 
 * Usage:
 *   npx hardhat run contracts/deploy.js --network arcTestnet
 * 
 * Make sure hardhat.config.js has arcTestnet network configured.
 */

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying ShareSwapNFT with account:', deployer.address)

  const balance = await deployer.provider.getBalance(deployer.address)
  console.log('Account balance:', ethers.formatEther(balance), 'USDC')

  const ShareSwapNFT = await ethers.getContractFactory('ShareSwapNFT')

  const contract = await ShareSwapNFT.deploy(
    'ShareSwap NFT',   // name
    'SSNFT',           // symbol
    0,                 // mintPrice (0 = free)
    0,                 // maxSupply (0 = unlimited)
  )

  await contract.waitForDeployment()
  const address = await contract.getAddress()

  console.log('✅ ShareSwapNFT deployed to:', address)
  console.log('')
  console.log('Add this to your .env.local:')
  console.log(`NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${address}`)
  console.log('')
  console.log('Verify on ArcScan:')
  console.log(`https://testnet.arcscan.net/address/${address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
