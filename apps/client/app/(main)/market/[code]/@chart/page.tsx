import ChartClient from '@/components/market/chart/ChartClient';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function ChartPage(props: Props) {
  const { code } = await props.params;

  return <ChartClient code={code} />;
}
