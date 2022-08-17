import { useQuery } from '@apollo/client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
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
  const { connecting, publicKey } = useWallet();
  const { connection } = useConnection();
  const pubkey = publicKey?.toBase58();

  useEffect(() => {
    async function updateConnectedWalletSolBalance() {
      if (!publicKey) {
        return;
      }

      try {
        const balance = await connection.getBalance(publicKey);

        viewerVar({
          balance,
          id: publicKey.toBase58() as string,
          __typename: 'Viewer',
        });
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    updateConnectedWalletSolBalance();
  }, [publicKey, connection]);

  const connectedWalletQuery = useQuery<ConnectedWalletProfile, { address?: string }>(
    GetConnectedWalletDataQuery,
    {
      variables: {
        address: pubkey,
      },
      skip: !pubkey,
    }
  );

  const connectedWalletData = useMemo(
    () => ({
      profile: connectedWalletQuery.data || null,
      loading: connecting || connectedWalletQuery.loading,
    }),
    [connectedWalletQuery, connecting]
  );

  return (
    <ConnectedWalletContext.Provider value={connectedWalletData}>
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
