'use client';

import Status from '@/components/Status';
import { allMarketAtom } from '@/store/atom';
import {
  initSocketAtom,
  socketStatusAtom,
  tickerStatusAtom,
} from '@/store/websocket';

import { Provider, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { use, useEffect, useMemo } from 'react';

export default function JotaiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useAtomValue(allMarketAtom, { delay: 0 });

  const [socket, setSocket] = useAtom(initSocketAtom);
  const tickerStatus = useAtomValue(tickerStatusAtom);

  useEffect(() => {
    if (pathname.split('/')[1] === 'market') {
      setSocket({
        action: 'emit',
        event: 'join',
        room: pathname.split('/')[2],
      });
    } else {
      setSocket({
        action: 'emit',
        event: 'leave',
      });
    }
  }, [pathname, socket, setSocket]);

  useEffect(() => {
    if (pathname.split('/')[1] === 'market' && !tickerStatus) {
      setSocket({ action: 'emit', event: 'ticker' });
    } else if (pathname.split('/')[1] !== 'market') {
      setSocket({ action: 'emit', event: 'ticker:stop' });
    }
  }, [socket, pathname, tickerStatus]);

  return (
    <Provider>
      {/* <Status /> */}
      {children}
    </Provider>
  );
}
