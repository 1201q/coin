'use client';

import {
  joinedRoomAtom,
  initSocketAtom,
  tickerStatusAtom,
} from '@/store/websocket';

import { useAtom, useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const Websocket: React.FC = () => {
  const pathname = usePathname();

  const [socket, setSocket] = useAtom(initSocketAtom);
  const tickerStatus = useAtomValue(tickerStatusAtom);
  const room = useAtomValue(joinedRoomAtom);

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
    <div
      style={{
        width: '150px',
        backgroundColor: '#f2f4f6',
        height: 'min-content',
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 20000,
      }}
    >
      <div>
        <span>ticker: </span>
        <span>{tickerStatus ? 'O' : 'X'}</span>
      </div>
      <div>
        <span>room: </span>
        <span>{room === '' ? '없음' : room}</span>
      </div>
      <div>
        <button
          onClick={() => {
            setSocket({ action: 'emit', event: 'ticker' });
          }}
        >
          ticker 클릭
        </button>

        <button
          onClick={() => {
            setSocket({ action: 'emit', event: 'ticker:stop' });
          }}
        >
          ticker 중단
        </button>

        <button
          onClick={() => {
            setSocket({ action: 'emit', event: 'leave' });
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

export default Websocket;
