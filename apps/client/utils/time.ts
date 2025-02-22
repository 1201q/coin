import { PriceChartOption } from '@/store/chart';
import dayjs from 'dayjs';
import { Time } from 'lightweight-charts';

export const parseTime = (time: Time): number => {
  if (typeof time === 'string') {
    return new Date(time).getTime();
  } else if (typeof time === 'object') {
    return new Date(time.year, time.month - 1, time.day).getTime();
  } else {
    return time;
  }
};

export const getNextCandleTime = (time: Time, options: PriceChartOption) => {
  const parsedTime = parseTime(time);
  const currentTime = dayjs.unix(parsedTime).add(9, 'hour');

  if (options.type === 'minutes' && options.minutes) {
    return currentTime.add(options.minutes, 'minutes').set('second', 0);
  } else if (options.type === 'days') {
    return currentTime.add(1, 'day').set('second', 0);
  } else if (options.type === 'weeks') {
    return currentTime.add(1, 'weeks').set('second', 0);
  } else if (options.type === 'months') {
    return currentTime.add(1, 'months').set('second', 0);
  } else {
    return currentTime.add(1, 'years').set('second', 0);
  }
};
