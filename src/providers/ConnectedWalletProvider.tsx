import { useQuery } from '@apollo/client';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { useContext, useEffect, useMemo } from 'react';
import { UserWallet, Wallet } from '../types';
import { GetConnectedWalletQuery } from '../queries/connectedWallet.graphql';
import { viewerVar } from './../cache';

export interface ConnectedWalletData {
  wallet: Wallet;
  followers: { from: UserWallet }[];
  following: { to: UserWallet }[];
  viewer?: {
    balance?: number;
  };
}

const ConnectedWalletProfileContext = React.createContext<{
  connectedWalletProfile: ConnectedWalletData | null;
  loading: boolean;
}>({
  connectedWalletProfile: null,
  loading: false,
});

export function ConnectedWalletProfileProvider(props: { children: React.ReactNode }) {
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

  const connectedWalletQuery = useQuery<ConnectedWalletData, { address?: string }>(
    GetConnectedWalletQuery,
    {
      variables: {
        address: pubkey,
      },
      skip: !pubkey,
    }
  );

  const connectedWalletData = useMemo(() => {
    return {
      connectedWalletProfile: connectedWalletQuery.data || null,
      loading: connectedWalletQuery.loading,
    };
  }, [connectedWalletQuery.data]);

  return (
    <ConnectedWalletProfileContext.Provider value={connectedWalletData}>
      {props.children}
    </ConnectedWalletProfileContext.Provider>
  );
}

export const useConnectedWalletProfile = () => {
  const connectedWalletData = useContext(ConnectedWalletProfileContext);
  if (connectedWalletData === undefined) {
    throw new Error(
      'useConnectedWalletProfile must be used within a ConnectedWalletProfileProvider'
    );
  }
  return connectedWalletData;
};
