import { useQuery } from '@apollo/client';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { useContext, useEffect, useMemo } from 'react';
import { UserWallet, Wallet } from '../types';
import { GetConnectedWalletDataQuery } from '../queries/connectedWalletData.graphql';
import { viewerVar } from './../cache';

export interface ConnectedWalletProfile {
  wallet: Wallet;
  followers: { from: UserWallet }[];
  following: { to: UserWallet }[];
  viewer?: {
    balance?: number;
  };
}

const ConnectedWalletContext = React.createContext<{
  profile: ConnectedWalletProfile | null;
  loading: boolean;
}>({
  profile: null,
  loading: false,
});

export function ConnectedWalletProvider(props: { children: React.ReactNode }) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const pubkey = wallet?.publicKey.toBase58();

  useEffect(() => {
    async function updateConnectedWalletSolBalance() {
      if (!wallet?.publicKey) {
        return;
      }

      try {
        const balance = await connection.getBalance(wallet?.publicKey);

        viewerVar({
          balance,
          id: wallet?.publicKey?.toBase58() as string,
          __typename: 'Viewer',
        });
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    updateConnectedWalletSolBalance();
  }, [wallet?.publicKey, connection]);

  // a relic of the past, might be refactored out later when we start re-implementing following
  const walletConnectionPair = useMemo(() => {
    if (!wallet) return null;
    return { wallet, connection };
  }, [wallet, connection]);

  const connectedWalletQuery = useQuery<ConnectedWalletProfile, { address?: string }>(
    GetConnectedWalletDataQuery,
    {
      variables: {
        address: pubkey,
      },
      skip: !pubkey,
    }
  );

  return (
    <ConnectedWalletContext.Provider
      value={{
        profile: connectedWalletQuery.data || null,
        loading: connectedWalletQuery.loading,
      }}
    >
      {props.children}
    </ConnectedWalletContext.Provider>
  );
}

export const useConnectedWalletData = () => {
  const connectedWalletData = useContext(ConnectedWalletContext);
  if (connectedWalletData === undefined) {
    throw new Error('useConnectedWalletData must be used within a ConnectedWalletProvider');
  }
  return connectedWalletData;
};
