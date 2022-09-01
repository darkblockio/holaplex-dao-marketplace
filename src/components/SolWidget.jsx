import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useWallet } from '@solana/wallet-adapter-react'

const config = {
  customCssClass: '', // pass here a class name you plan to use
  debug: true, // debug flag to console.log some variables
  imgViewer: {
    // image viewer control parameters
    showRotationControl: true,
    autoHideControls: true,
    controlsFadeDelay: true,
  },
};

// const SolanaDarkblockWidget = dynamic(
//   () =>
//     import('@darkblock.io/sol-widget').then((mod) => {
//       return mod.SolanaDarkblockWidget
//     }),
//   { ssr: false }
// )

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

  console.log('SolWidget: id, upgrade', id, upgrade)

  const walletAdapter = useWallet()
  const [wallectConnected, setWalletConnected] = useState(false)

  useEffect(() => {
    if (walletAdapter.connected) {
      console.log(' --- wallet connected')
      setWalletConnected(true)
    }
  }, [walletAdapter.connected])

  if (walletAdapter && wallectConnected && typeof window !== 'undefined') {
    console.log('========================')
    console.log('yes walletAdapter')
    if (upgrade) {
      console.log('render the upgrade widget')
      console.log('apiKey', apiKey)
      console.log('id', id)
      console.log('config', config)
      return (
        <div>
          <p>++++++++++++++++++</p>
          <br />
          <SolUpgradeWidget apiKey={apiKey} tokenId={id} walletAdapter={walletAdapter} cb={cbUpgrade} config={config} />
          <br />
          <p>******************</p>
        </div>

      )
    } else {
      return (
        <></>
        // <SolanaDarkblockWidget cb={cb} tokenId={id} walletAdapter={walletAdapter} config={config} />
      )
    }
  } else {
    return <>No wallet connected, unable to load unlockables</>
  }
}

export default SolWidget
