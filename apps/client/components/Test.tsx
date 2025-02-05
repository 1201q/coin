'use client';

import { socketService } from '@/utils/websocket';
import { useState } from 'react';

export default function Test() {
  const [value, setValue] = useState('');
  return (
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
          socketService.joinCode(value);
        }}
      >
        join
      </button>
    </div>
  );
}
