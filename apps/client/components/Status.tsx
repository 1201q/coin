'use client';

import {
  joinedRoomAtom,
  selectedCoinAtom,
  tickerDataAtom,
  tickerSocketStatusAtom,
} from '@/store/atom';

import { socketService } from '@/utils/websocket';
import { useAtom, useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Status = () => {
  const pathname = usePathname();
  const ticker = useAtomValue(tickerSocketStatusAtom, { delay: 0 });
  const room = useAtomValue(joinedRoomAtom, { delay: 0 });
  const [value, setValue] = useState('');

  const [coin, setCoin] = useAtom(selectedCoinAtom);

  const tickerData = useAtomValue(tickerDataAtom, { delay: 0 });

  useEffect(() => {
    setCoin(pathname.split('/')[2]);
  }, []);

  // useEffect(() => {
  //   console.log(tickerData);
  // }, [tickerData]);

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
            socketService.subscirbeTicker();
          }}
        >
          ticker 클릭
        </button>

        <button
          onClick={() => {
            socketService.unsubscirbeTicker();
          }}
        >
          ticker 중단
        </button>
        <button
          onClick={() => {
            socketService.joinRoom(value);
          }}
        >
          join
        </button>

        <button
          onClick={() => {
            socketService.leaveRoom();
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
