'use client';

import Websocket from '@/components/common/provider/Websocket';
import { allMarketAtom } from '@/store/atom';
import { Provider, useAtomValue } from 'jotai';

export default function JotaiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAtomValue(allMarketAtom, { delay: 0 });

  return (
    <Provider>
      <Websocket />
      {children}
    </Provider>
  );
}
