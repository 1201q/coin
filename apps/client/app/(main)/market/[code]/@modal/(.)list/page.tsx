import SearchDialog from '@/components/market/header/dialog/SearchDialog';
import { Suspense } from 'react';
import Loading from './loading';

export default function MarketListModalPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchDialog />
    </Suspense>
  );
}
