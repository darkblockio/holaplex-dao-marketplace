import { useQuery } from '@apollo/client';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { useContext, useEffect, useMemo } from 'react';
import { UserWallet } from '../types';
import { GetConnectedWalletQuery } from '../queries/connectedWallet.graphql';
import { viewerVar } from './../cache';

export interface ConnectedWalletData {
  wallet: {
    // pubkey should maybe be renamed to address
    address: string | null;
    previewImage?: string;
    profile?: {
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
    } | null;
    nftCounts: {
      owned: number;
      created: number;
      offered: number;
      listed: number;
    };
    connectionCounts: {
      fromCount: number;
      toCount: number;
    };
  };
  followers: { from: UserWallet }[];
  following: { to: UserWallet }[];
  walletConnectionPair: {
    wallet: AnchorWallet;
    connection: Connection;
  };
  viewer?: {
    balance?: number;
  };
}

const ConnectedWalletProfileContext = React.createContext<ConnectedWalletData | null>(null);

export function ConnectedWalletProfileProvider(props: { children: React.ReactNode }) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const pubkey = wallet?.publicKey.toBase58();

  useEffect(() => {
    (async () => {
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
    })();
  }, [wallet?.publicKey, connection]);

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
  // should maybe be put in a useMemo
  const connectedWalletData = useMemo(() => {
    return connectedWalletQuery.data || null;
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
