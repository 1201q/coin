import InfoServer from '@/components/market/info/InfoServer';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function InfoServerPage(props: Props) {
  const { code } = await props.params;

  return <InfoServer code={code} />;
}
