import OrderClient from '@/components/market/order/OrderClient';
import { getWallet } from '@/utils/fetch';
import { cookies } from 'next/headers';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function OrderFormPage(props: Props) {
  const { code } = await props.params;
  const accessToken = (await cookies()).get('accessToken');
  const hasCookie = accessToken ? true : false;

  if (accessToken?.value) {
    const data = await getWallet(accessToken.value);

    return <OrderClient code={code} hasCookie={hasCookie} walletData={data} />;
  }

  return <OrderClient code={code} hasCookie={hasCookie} />;
}
