'use client';

import Status from '@/components/Status';
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
      <Status />
      {children}
    </Provider>
  );
}
