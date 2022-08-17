import { ReactElement, useState } from 'react';
import CollectionLayout from '../../../layouts/CollectionLayout';
import { Collection, NftCreator } from '../../../types';
import { CollectionQuery } from './../../../queries/collection.graphql';
import { useTranslation } from 'next-i18next';
import { addressAvatar, shortenAddress } from '../../../modules/address';
import Button, { ButtonSize } from '../../../components/Button';
import { PlusIcon } from '@heroicons/react/outline';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import client from '../../../client';
import { useConnectedWalletData } from '../../../providers/ConnectedWalletProvider';

export async function getServerSideProps({ locale, params }: GetServerSidePropsContext) {
  const i18n = await serverSideTranslations(locale as string, ['common', 'collection']);

  const { data } = await client.query({
    query: CollectionQuery,
    variables: {
      address: params?.address,
    },
  });
  const collection: Collection = data.collection;

  if (collection === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
      ...i18n,
    },
  };
}

export default function CollectionAboutPage(props: { collection: Collection }) {
  const { t } = useTranslation(['collection', 'common']);
  const connectedWalletProfile = useConnectedWalletData();

  console.log('connected wallet', connectedWalletProfile);

  const [creatorsFilter, setCreatorsFilter] = useState<'ALL' | 'FOLLOWING'>('ALL');

  return (
    <div className="  py-6 px-4 text-white md:px-8">
      <section className="space-y-4">
        <h2 className="font-semibold">{t('descriptionTitle')}</h2>
        <p className="text-gray-300">{props.collection.nft.description}</p>
      </section>
      <div className="my-6 border border-gray-800" />
      <section className="space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">{t('creatorsTitle')}</h2>
          {/* <ButtonGroup value={creatorsFilter} onChange={setCreatorsFilter}>
            <ButtonGroup.Option value={'ALL'}>{t('all')}</ButtonGroup.Option>
            <ButtonGroup.Option value={'FOLLOWING'}>{t('following')}</ButtonGroup.Option>
          </ButtonGroup> */}
        </div>
        <div>
          {props.collection.nft.creators.map((c) => (
            <CreatorRow key={c.address} creator={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CreatorRow(props: { creator: NftCreator }) {
  const { t } = useTranslation(['collection', 'common']);

  return (
    <div className="flex w-full items-center">
      <img
        className="h-8 w-8 rounded-full"
        src={props.creator.previewImage}
        alt="creator profile picture"
      />
      <div className="ml-4 text-base font-medium">{props.creator.displayName}</div>
      <Button
        className="ml-auto"
        icon={<PlusIcon width={14} height={14} />}
        size={ButtonSize.Small}
      >
        {t('follow', { ns: 'common' })}
      </Button>
    </div>
  );
}

interface CollectionAboutPageLayout {
  children: ReactElement;
  collection: Collection;
}

CollectionAboutPage.getLayout = function CollectionNftsLayout({
  children,
  collection,
}: CollectionAboutPageLayout): JSX.Element {
  return <CollectionLayout collection={collection}>{children}</CollectionLayout>;
};
