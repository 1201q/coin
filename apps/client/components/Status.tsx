'use client';

import { selectedCoinAtom } from '@/store/atom';
import {
  joinedRoomAtom,
  initSocketAtom,
  tickerStatusAtom,
  tickersAtom,
  orderbookAtom,
} from '@/store/websocket';

import { useAtom, useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Status = () => {
  const pathname = usePathname();
  const ticker = useAtomValue(tickerStatusAtom);
  const room = useAtomValue(joinedRoomAtom);
  const [value, setValue] = useState('');

  const [coin, setCoin] = useAtom(selectedCoinAtom);

  const tickerData = useAtomValue(tickersAtom);
  const orderbookData = useAtomValue(orderbookAtom);

  const [client, setClient] = useAtom(initSocketAtom);

  useEffect(() => {
    setCoin(pathname.split('/')[2]);
  }, []);

  useEffect(() => {
    if (tickerData) {
      console.log(tickerData[0].timestamp);
    }
  }, [tickerData]);

  useEffect(() => {
    orderbookData && console.log(orderbookData);
  }, [orderbookData]);

  return (
    <div
      style={{
        width: '150px',
        backgroundColor: '#f2f4f6',
        height: 'min-content',
        position: 'fixed',
        top: 0,
        right: 0,
      }}
    >
      <div>
        <span>ticker: </span>
        <span>{ticker ? 'O' : 'X'}</span>
      </div>
      <div>
        <span>room: </span>
        <span>{room === '' ? '없음' : room}</span>
      </div>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={() => {
            setClient({ action: 'emit', event: 'ticker' });
          }}
        >
          ticker 클릭
        </button>

        <button
          onClick={() => {
            setClient({ action: 'emit', event: 'ticker:stop' });
          }}
        >
          ticker 중단
        </button>
        <button
          onClick={() => {
            setClient({ action: 'emit', event: 'join', room: value });
          }}
        >
          join
        </button>

        <button
          onClick={() => {
            setClient({ action: 'emit', event: 'leave' });
          }}
        >
          leave
        </button>
      </div>
      <div>
        <p></p>
      </div>
    </div>
  );
};

export default Status;
