import styles from '../../main.module.css';
import Header from '@/components/common/header/Header';
import InfoServer from '@/components/market/info/InfoServer';
import ChartClient from '@/components/market/chart/ChartClient';
import OrderClient from '@/components/market/order/OrderClient';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function MarketCodePage(props: Props) {
  const { code } = await props.params;

  return <></>;
}
