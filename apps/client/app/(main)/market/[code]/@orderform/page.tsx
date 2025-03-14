import OrderClient from '@/components/market/order/OrderClient';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { Token } from '@/types/token';
import { getRemainingAccessTokenTime } from '@/utils/token';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function OrderFormPage(props: Props) {
  const { code } = await props.params;
  const hasCookie = (await cookies()).has('accessToken');

  console.log(hasCookie);

  return <OrderClient code={code} hasCookie={hasCookie} />;
}
