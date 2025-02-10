'use client';

import { allMarketAtom } from '@/store/atom';

// import { socketService } from '@/utils/websocket';
import { createStore, Provider, useAtom, useAtomValue } from 'jotai';

export default function JotaiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = useAtomValue(allMarketAtom, { delay: 0 });
  // const ws = useAtomValue(initAtom);

  return <Provider>{children}</Provider>;
}
