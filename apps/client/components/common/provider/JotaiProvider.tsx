'use client';

import { allMarketAtom } from '@/store/atom';
import { socketService } from '@/utils/websocket';
import { Provider, useAtomValue } from 'jotai';
import { useEffect } from 'react';

export default function JotaiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = useAtomValue(allMarketAtom);

  useEffect(() => {
    console.log('provider');
  }, []);

  return <Provider>{children}</Provider>;
}
