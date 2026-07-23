import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, CheckCircle, Loader2, Copy, ExternalLink, Shield, Smartphone } from 'lucide-react';

export default function TransactionModal() {
  const {
    isTxModalOpen,
    setIsTxModalOpen,
    txState,
    txHash,
    walletAddress,
    paymentMethod,
    momoNumber,
    momoTxState,
    showToast
  } = useWeb3();

  if (!isTxModalOpen) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  // --- CRYPTO STEPS & MATH ---
  const cryptoSteps = [
    {
      key: 'signing',
      title: '1. Sign Ledger Request',
      desc: 'Approve the cryptographic gas checkout in your connected wallet extension.'
    },
    {
      key: 'broadcasting',
      title: '2. Broadcasting Transaction',
      desc: 'Transmitting signed payload to Kigali RPC Node on the Rwanda Devnet.'
    },
    {
      key: 'mining',
      title: '3. Mining Blockchain Block',
      desc: 'Awaiting network validators to package transaction into a new block.'
    },
    {
      key: 'confirmed',
      title: '4. Block Confirmation',
      desc: 'Success! Order receipt minted and ledger finalized.'
    }
  ];

  const getCryptoStepStatus = (stepKey) => {
    const order = ['signing', 'broadcasting', 'mining', 'confirmed'];
    const currentIdx = order.indexOf(txState);
    const stepIdx = order.indexOf(stepKey);

    if (txState === 'error') return 'error';
    if (currentIdx > stepIdx) return 'done';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  // --- MOMO STEPS & MATH ---
  const momoSteps = [
    {
      key: 'push_sent',
      title: '1. USSD Push Request Sent',
      desc: `Initiated MTN MoMo Pay prompt to subscriber number: ${momoNumber}...`
    },
    {
      key: 'awaiting_pin',
      title: '2. Awaiting Handset PIN',
      desc: 'Please check your phone. Enter your Mobile Money PIN to authorize payment.'
    },
    {
      key: 'verifying',
      title: '3. Verifying MTN Network Settlement',
      desc: 'Waiting for MTN MoMo gateway callback to finalize order registration.'
    },
    {
      key: 'confirmed',
      title: '4. MTN MoMo Confirmed',
      desc: 'Success! Mobile Money transaction settled and order ledger updated.'
    }
  ];

  const getMomoStepStatus = (stepKey) => {
    const order = ['push_sent', 'awaiting_pin', 'verifying', 'confirmed'];
    const currentIdx = order.indexOf(momoTxState);
    const stepIdx = order.indexOf(stepKey);

    if (momoTxState === 'error') return 'error';
    if (currentIdx > stepIdx) return 'done';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  const isMomo = paymentMethod === 'momo';
  const isConfirmed = isMomo ? momoTxState === 'confirmed' : txState === 'confirmed';
  const currentStepState = isMomo ? momoTxState : txState;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '480px', borderTop: isMomo ? '5px solid #fcca03' : '1px solid var(--border-color)' }}>
        
        {/* Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isMomo ? (
              <Smartphone size={20} style={{ color: '#e0b200' }} />
            ) : (
              <Shield size={20} className="logo-accent" />
            )}
            <span>{isMomo ? 'MTN MoMo Checkout' : 'Smart Contract Checkout'}</span>
          </h2>
          {isConfirmed && (
            <button className="btn-icon" onClick={() => setIsTxModalOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">
          {!isConfirmed ? (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                {isMomo 
                  ? 'Please do not close this overlay. Monitor your phone handset to authorize the MTN Mobile Money push notification.' 
                  : 'Please monitor your wallet. Do not refresh this page or close the browser until the smart contract confirms.'}
              </p>

              <div className="tx-steps">
                {(isMomo ? momoSteps : cryptoSteps).map((step) => {
                  const status = isMomo ? getMomoStepStatus(step.key) : getCryptoStepStatus(step.key);
                  return (
                    <div key={step.key} className={`tx-step ${status}`}>
                      <div className="tx-step-number" style={status === 'active' && isMomo ? { backgroundColor: '#fef08a', color: '#854d0e', borderColor: '#fde047' } : {}}>
                        {status === 'done' ? (
                          <span style={{ color: 'var(--success)' }}>✓</span>
                        ) : status === 'active' ? (
                          <span style={{ animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>
                            <Loader2 size={16} />
                          </span>
                        ) : (
                          <span>{step.title.charAt(0)}</span>
                        )}
                      </div>

                      <div style={{ flexGrow: 1 }}>
                        <div style={{
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          color: status === 'active' 
                            ? (isMomo ? '#a16207' : 'var(--accent)') 
                            : 'var(--text-primary)'
                        }}>
                          {step.title}
                        </div>
                        {status === 'active' && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {step.desc}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Success Receipt Display */
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                color: isMomo ? '#e0b200' : 'var(--success)',
                fontSize: '3.5rem',
                marginBottom: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={56} strokeWidth={2.5} style={isMomo ? { color: '#e0b200' } : {}} />
              </div>
              
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
                {isMomo ? 'MTN MoMo settled successfully!' : 'Payment Minted Successfully!'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
                {isMomo 
                  ? 'Fulfillment record registered. MTN Mobile Money network response processed successfully.'
                  : 'Your order is secured under decentralized cryptographic receipt. Fulfillments can be tracked on-chain.'}
              </p>

              {/* Receipt Card */}
              <div className="web3-card" style={{ textAlign: 'left', margin: '0 auto 20px auto' }}>
                <div className="web3-card-title">{isMomo ? 'MoMo Payment Receipt' : 'Receipt Metadata'}</div>
                
                <div className="web3-data-row">
                  <span>Channel</span>
                  <span style={{ fontWeight: '700', color: isMomo ? '#a16207' : '#111827' }}>
                    {isMomo ? 'MTN MoMo Rwanda' : 'Rwanda Devnet'}
                  </span>
                </div>
                
                <div className="web3-data-row">
                  <span>{isMomo ? 'Transaction ID' : 'Block Hash'}</span>
                  <span
                    className="hash-text"
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => copyToClipboard(txHash, isMomo ? 'Transaction ID' : 'Transaction Hash')}
                  >
                    {txHash ? `${txHash.substring(0, 12)}...` : ''}
                    <Copy size={12} />
                  </span>
                </div>

                <div className="web3-data-row">
                  <span>From (Customer)</span>
                  <span style={{ fontWeight: '600' }}>
                    {isMomo ? momoNumber : `${walletAddress.substring(0, 10)}...`}
                  </span>
                </div>

                <div className="web3-data-row">
                  <span>To (Merchant)</span>
                  <span style={{ fontWeight: '600' }}>
                    {isMomo ? 'Epa (+250782148861)' : 'KigaliMart Store'}
                  </span>
                </div>

                <div className="web3-data-row">
                  <span>Status</span>
                  <span style={{ color: 'var(--success)', fontWeight: '700' }}>SETTLED</span>
                </div>
              </div>

              {!isMomo && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.82rem' }}>
                  <a
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '600'
                    }}
                  >
                    <span>Verify on Etherscan</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {isConfirmed ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsTxModalOpen(false)}
              style={isMomo ? { backgroundColor: '#fcca03', borderColor: '#fcca03', color: '#111' } : {}}
              onMouseEnter={(e) => { if (isMomo) e.currentTarget.style.backgroundColor = '#e0b200'; }}
              onMouseLeave={(e) => { if (isMomo) e.currentTarget.style.backgroundColor = '#fcca03'; }}
            >
              Close Receipt
            </button>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={isMomo ? { backgroundColor: '#e0b200' } : {}}></span>
              <span>{isMomo ? 'Verifying handset settlement...' : 'Mining block...'}</span>
            </div>
          )}
        </div>

      </div>

      <style>{`
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent);
          animation: pulse 1.2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
