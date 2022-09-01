import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useWallet } from '@solana/wallet-adapter-react'

const config = {
  customCssClass: 'darkblock-css', // pass here a class name you plan to use
  debug: true, // debug flag to console.log some variables
  imgViewer: {
    // image viewer control parameters
    showRotationControl: true,
    autoHideControls: true,
    controlsFadeDelay: true,
  },
};

const SolanaDarkblockWidget = dynamic(
  () =>
    import('@darkblock.io/sol-widget').then((mod) => {
      return mod.SolanaDarkblockWidget
    }),
  { ssr: false }
)

const SolUpgradeWidget = dynamic(
  () =>
    import('@darkblock.io/sol-widget').then((mod) => {
      return mod.SolUpgradeWidget
    }),
  { ssr: false }
)

const cb = (param1) => {
  console.log('solWidget viewer cb:', param1)
}

const cbUpgrade = (param1) => {
  console.log('solWidget upgrade cb', param1)
  if (param1 === 'upload_complete') {
    console.log('Darkblock upload complete')
  }
}

const apiKey = '2jqkys7jg94gk0hwpwjg9e1psnft'

const SolWidget = ({ id, upgrade = false }) => {
  const walletAdapter = useWallet()
  const [wallectConnected, setWalletConnected] = useState(false)

  useEffect(() => {
    if (walletAdapter.connected) {
      setWalletConnected(true)
    }
  }, [walletAdapter.connected])

  if (walletAdapter && wallectConnected && typeof window !== 'undefined') {
    if (upgrade) {
      return (
          <SolUpgradeWidget apiKey={apiKey} tokenId={id} walletAdapter={walletAdapter} cb={cbUpgrade} config={config} />
      )
    } else {
      return (
        <SolanaDarkblockWidget cb={cb} tokenId={id} walletAdapter={walletAdapter} config={config} />
      )
    }
  } else {
    return <></>
  }
}

export default SolWidget
