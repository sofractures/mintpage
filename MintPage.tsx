'use client'

import { useState } from 'react'
import { createPublicClient, http, createWalletClient, custom, parseEther } from 'viem'
import { mainnet } from 'viem/chains'
import { CollectionCreator__factory } from '@zoralabs/protocol-sdk'

const MintPage = () => {
  const [minting, setMinting] = useState(false)

  const handleMint = async () => {
    setMinting(true)
    try {
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http()
      })

      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum)
      })

      const [address] = await walletClient.requestAddresses()

      const collectionContract = CollectionCreator__factory.connect(
        '0x0d41f57ca76892275531e7f02ed72c1c9208c28d',
        publicClient
      )

      const mintPrice = await collectionContract.read.mintPrice()

      const { request } = await publicClient.simulateContract({
        address: '0x0d41f57ca76892275531e7f02ed72c1c9208c28d',
        abi: CollectionCreator__factory.abi,
        functionName: 'mint',
        args: [address, 57n],
        value: mintPrice
      })

      const hash = await walletClient.writeContract(request)

      console.log('Minting transaction:', hash)
      // You can add logic here to wait for the transaction to be confirmed
    } catch (error) {
      console.error('Minting failed:', error)
    } finally {
      setMinting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <img
        src="/nft-image.jpg" // Replace with your NFT image URL
        alt="NFT"
        className="w-64 h-64 object-cover mb-8"
      />
      <button
        onClick={handleMint}
        disabled={minting}
        className="bg-white text-black px-6 py-2 rounded-lg font-bold"
      >
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
    </div>
  )
}

export default MintPage