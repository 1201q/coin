'use client';

import Websocket from '@/components/common/provider/Websocket';
import { allMarketAtom } from '@/store/atom';
import { Provider, useAtomValue } from 'jotai';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useHydrateAtoms } from 'jotai/utils';
import { queryClientAtom } from 'jotai-tanstack-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }: { children: React.ReactNode }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

export default function JotaiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAtomValue(allMarketAtom, { delay: 0 });

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms>
          <Websocket />
          {children}
        </HydrateAtoms>
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
