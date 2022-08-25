declare module 'profile.graphql' {
  import { WalletProfileQuery,
  WalletProfileClientQuery,
  CollectedNFTsQuery
  } from '../src/queries/profile.graphql';

  export const WalletProfileQuery: WalletProfileQuery;
  export const WalletProfileClientQuery: WalletProfileClientQuery;
  export const CollectedNFTsQuery: CollectedNFTsQuery;
  export const CreatedNFTsQuery: CreatedNFTsQuery;
};

declare module 'collection.graphql' {
  import { CollectionQuery,
    CollectionActivitiesQuery,
    CollectionNFTsQuery } from '../src/queries/collection.graphql';
  export const CollectionQuery: CollectionQuery;
  export const CollectionActivitiesQuery: CollectionActivitiesQuery;
  export const CollectionNFTsQuery: CollectionNFTsQuery;
}

declare module 'nft.graphql' {
  import { NftQuery } from '../src/queries/nft.graphql'
  export const NftQuery: NftQuery;
}
