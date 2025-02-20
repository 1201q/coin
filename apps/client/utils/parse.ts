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
