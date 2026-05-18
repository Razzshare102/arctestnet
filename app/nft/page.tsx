'use client'

/**
 * NFT Mint page — upload, preview, and mint ERC-721 NFTs on ARC Testnet
 */

import { useState, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Sparkles,
  Eye,
  ExternalLink,
  RefreshCw,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard } from '@/components/ui/GlassCard'
import { ConnectPrompt } from '@/components/ui/ConnectPrompt'
import { TxModal, type TxStatus } from '@/components/ui/TxModal'
import { Skeleton, SkeletonNFTCard } from '@/components/ui/Skeleton'
import { SHARESWAP_NFT_ABI, NFT_CONTRACT_ADDRESS, buildNFTMetadata } from '@/lib/nftContract'
import { txUrl } from '@/lib/arcKit'
import { shortenAddress } from '@/lib/utils'

// ── Mock user NFTs for gallery (replace with contract reads in production) ────
const MOCK_USER_NFTS = [
  { id: 1, name: 'ARC Genesis #001', image: null, txHash: '0xabc123' },
  { id: 2, name: 'ShareSwap OG', image: null, txHash: '0xdef456' },
]

export default function NFTMintPage() {
  const { address, isConnected } = useAccount()

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedUri, setUploadedUri] = useState<string | null>(null)

  // Mint state
  const [minting, setMinting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txModalOpen, setTxModalOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Contract write
  const { writeContractAsync } = useWriteContract()

  // ── Drag & drop ────────────────────────────────────────────────────────────
  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
    setUploadedUri(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
  })

  // ── Upload to IPFS via Pinata ──────────────────────────────────────────────
  const uploadToPinata = async (): Promise<string> => {
    if (!imageFile) throw new Error('No image selected')

    // In production: POST to /api/pinata with the file
    // For demo we return a mock URI
    await new Promise((r) => setTimeout(r, 1500)) // simulate upload
    return `ipfs://bafybeig${Math.random().toString(36).slice(2)}/${imageFile.name}`
  }

  const uploadMetadata = async (imageUri: string): Promise<string> => {
    if (!address) throw new Error('No wallet')
    const metadata = buildNFTMetadata(name, description, imageUri, address)

    // In production: POST to /api/pinata/json with metadata
    await new Promise((r) => setTimeout(r, 800))
    return `ipfs://bafybeij${Math.random().toString(36).slice(2)}/metadata.json`
  }

  // ── Mint NFT ───────────────────────────────────────────────────────────────
  const handleMint = async () => {
    if (!isConnected || !address) return
    if (!name.trim()) { toast.error('Please enter an NFT name'); return }
    if (!imageFile) { toast.error('Please upload an image'); return }

    setMinting(true)
    setUploading(true)
    toast.loading('Uploading to IPFS...', { id: 'upload' })

    try {
      // Step 1: Upload image
      const imageUri = await uploadToPinata()
      // Step 2: Upload metadata
      const metadataUri = await uploadMetadata(imageUri)
      setUploadedUri(metadataUri)
      toast.success('Uploaded to IPFS!', { id: 'upload' })
      setUploading(false)

      // Step 3: Mint on-chain
      setTxStatus('pending')
      setTxModalOpen(true)

      const hash = await writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: SHARESWAP_NFT_ABI,
        functionName: 'mint',
        args: [metadataUri],
      })

      setTxHash(hash)
      setTxStatus('success')
      toast.success(`NFT minted! "${name}"`)

      // Reset form
      setName('')
      setDescription('')
      setImageFile(null)
      setImagePreview(null)
      setUploadedUri(null)
    } catch (err: any) {
      setTxStatus('error')
      toast.dismiss('upload')
      const msg = err?.shortMessage || err?.message || 'Mint failed'
      toast.error(msg.slice(0, 80))
    } finally {
      setMinting(false)
      setUploading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <ConnectPrompt
          title="Connect to Mint NFTs"
          description="Connect your wallet to upload artwork and mint ERC-721 NFTs on ARC Testnet."
        />
      </div>
    )
  }

  const canMint = name.trim() && imageFile && !minting

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">NFT Mint</h1>
        <p className="text-arc-muted text-sm mt-1">
          Create and mint ERC-721 NFTs directly to your wallet on ARC Testnet
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">

        {/* ── Left: form ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Image upload */}
          <GlassCard animate={false} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Upload Artwork</h3>
            <div
              {...getRootProps()}
              className={`
                relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200
                ${isDragActive
                  ? 'border-arc-blue bg-arc-blue/5 shadow-neon-blue'
                  : 'border-arc-border hover:border-arc-blue/40 hover:bg-white/2'
                }
                ${imagePreview ? 'border-arc-purple/40' : ''}
              `}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="NFT preview"
                    className="max-h-48 mx-auto rounded-xl object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>
                  <p className="text-xs text-arc-muted mt-2">{imageFile?.name}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-14 w-14 rounded-xl bg-arc-blue/10 border border-arc-blue/20 flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6 text-arc-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-arc-muted mt-1">PNG, JPG, GIF, WebP — max 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Metadata */}
          <GlassCard animate={false} className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">NFT Details</h3>

            <div>
              <label className="text-xs text-arc-muted mb-1.5 block">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome NFT"
                maxLength={100}
                className="input-field"
              />
              <div className="text-xs text-arc-muted text-right mt-1">{name.length}/100</div>
            </div>

            <div>
              <label className="text-xs text-arc-muted mb-1.5 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your NFT..."
                rows={3}
                maxLength={500}
                className="input-field resize-none"
              />
              <div className="text-xs text-arc-muted text-right mt-1">{description.length}/500</div>
            </div>

            {/* Wallet info */}
            <div className="rounded-xl bg-arc-dark border border-arc-border p-3">
              <div className="text-xs text-arc-muted mb-1">Mint to</div>
              <div className="font-mono text-sm text-white">{shortenAddress(address!, 6)}</div>
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(true)}
              disabled={!name || !imagePreview}
              className="btn-secondary flex items-center gap-2 flex-1 justify-center"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={handleMint}
              disabled={!canMint}
              className="btn-primary flex items-center gap-2 flex-1 justify-center"
            >
              {minting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploading ? 'Uploading...' : 'Minting...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Mint NFT
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Right: preview + gallery ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* Live preview card */}
          <GlassCard animate={false} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Live Preview</h3>
            <div className="rounded-xl overflow-hidden border border-arc-border bg-arc-dark">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="NFT preview"
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square flex flex-col items-center justify-center text-arc-muted/40">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <span className="text-sm">Upload an image</span>
                </div>
              )}
              <div className="p-3">
                <div className="font-semibold text-white">{name || 'NFT Name'}</div>
                <div className="text-xs text-arc-muted mt-0.5">{description || 'Description...'}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge-blue text-xs">ARC Testnet</span>
                  <span className="badge-purple text-xs">ERC-721</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* User gallery */}
          <GlassCard animate={false} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-arc-purple" />
              Your NFTs
            </h3>
            {MOCK_USER_NFTS.length === 0 ? (
              <div className="py-8 text-center text-arc-muted text-sm">
                No NFTs minted yet
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {MOCK_USER_NFTS.map((nft) => (
                  <div
                    key={nft.id}
                    className="rounded-xl border border-arc-border bg-arc-dark overflow-hidden hover:border-arc-purple/30 transition-colors"
                  >
                    <div className="aspect-square bg-gradient-to-br from-arc-blue/10 to-arc-purple/10 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-arc-purple/40" />
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-medium text-white truncate">{nft.name}</div>
                      <a
                        href={txUrl(nft.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-arc-blue hover:underline flex items-center gap-0.5 mt-0.5"
                      >
                        View <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* TX Modal */}
      <TxModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        status={txStatus}
        txHash={txHash}
        title="NFT Mint"
        description={txStatus === 'pending' ? `Minting "${name}"...` : `"${name}" has been minted to your wallet!`}
      />

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-sm w-full overflow-hidden"
            >
              {imagePreview && (
                <img src={imagePreview} alt="Full preview" className="w-full aspect-square object-cover" />
              )}
              <div className="p-4">
                <div className="font-bold text-white text-lg">{name}</div>
                {description && <div className="text-arc-muted text-sm mt-1">{description}</div>}
                <div className="flex gap-2 mt-3">
                  <span className="badge-blue">ARC Testnet</span>
                  <span className="badge-purple">ERC-721</span>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="btn-secondary w-full mt-4"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
