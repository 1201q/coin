import OrderClient from '@/components/market/order/OrderClient';
import { cookies } from 'next/headers';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function OrderFormPage(props: Props) {
  const { code } = await props.params;
  const hasCookie = (await cookies()).has('accessToken');

  return <OrderClient code={code} hasCookie={hasCookie} />;
}
