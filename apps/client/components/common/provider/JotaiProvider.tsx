'use client';

import { allMarketAtom } from '@/store/atom';
import { socketService } from '@/utils/websocket';
import { createStore, Provider, useAtomValue } from 'jotai';
import { Suspense, useEffect } from 'react';

export default function JotaiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = useAtomValue(allMarketAtom, { delay: 0 });
  // const ws = useAtomValue(initAtom);

  useEffect(() => {
    console.log('provider');

    socketService.subscirbeTicker();
  }, []);

  return <Provider>{children}</Provider>;
}
