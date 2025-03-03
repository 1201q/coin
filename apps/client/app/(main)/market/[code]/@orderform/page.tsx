import OrderClient from '@/components/market/order/OrderClient';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function OrderFormPage(props: Props) {
  const { code } = await props.params;

  return <OrderClient code={code} />;
}
