import Header from '@/components/common/header/Header';
import InfoServer from '@/components/market/info/InfoServer';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function HeaderPage(props: Props) {
  const { code } = await props.params;

  return <Header market={code} />;
}
