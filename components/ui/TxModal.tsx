'use client'

/**
 * TxModal — transaction progress modal
 * Shows pending → success/failed states with tx hash and explorer link
 */

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, ExternalLink, Copy } from 'lucide-react'
import { Modal } from './Modal'
import { txUrl } from '@/lib/arcKit'
import { shortenAddress, copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

export type TxStatus = 'idle' | 'pending' | 'success' | 'error'

interface TxModalProps {
  isOpen: boolean
  onClose: () => void
  status: TxStatus
  txHash?: string
  title?: string
  description?: string
  errorMessage?: string
}

export function TxModal({
  isOpen,
  onClose,
  status,
  txHash,
  title = 'Transaction',
  description,
  errorMessage,
}: TxModalProps) {
  const handleCopy = async () => {
    if (!txHash) return
    const ok = await copyToClipboard(txHash)
    if (ok) toast.success('Copied to clipboard!')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      closable={status !== 'pending'}
    >
      <div className="flex flex-col items-center text-center py-4 space-y-4">
        {/* Status icon */}
        <motion.div
          key={status}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          {status === 'pending' && (
            <div className="h-16 w-16 rounded-full bg-arc-blue/10 border border-arc-blue/20 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-arc-blue animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          )}
          {status === 'error' && (
            <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          )}
        </motion.div>

        {/* Status text */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-1">
            {status === 'pending' && 'Waiting for confirmation...'}
            {status === 'success' && 'Transaction Confirmed!'}
            {status === 'error' && 'Transaction Failed'}
          </h4>
          {description && (
            <p className="text-sm text-arc-muted">{description}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-400 mt-1">{errorMessage}</p>
          )}
        </div>

        {/* TX Hash */}
        {txHash && (
          <div className="w-full rounded-xl border border-arc-border bg-arc-dark p-3 space-y-2">
            <div className="text-xs text-arc-muted">Transaction Hash</div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm text-arc-blue truncate">
                {shortenAddress(txHash, 8)}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="text-arc-muted hover:text-white transition-colors"
                  title="Copy hash"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <a
                  href={txUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-arc-muted hover:text-arc-blue transition-colors"
                  title="View on ArcScan"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        {status !== 'pending' && (
          <button onClick={onClose} className="btn-primary w-full mt-2">
            {status === 'success' ? 'Done' : 'Close'}
          </button>
        )}
      </div>
    </Modal>
  )
}
