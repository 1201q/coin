'use client';

import { useEffect, useRef } from 'react';
import styles from './pricechart.module.css';
import AngleDown from '@/public/angle-down.svg';
import {
  ChartMinutesOptions,
  ChartOptions,
  isChartOptionDropDownOpenAtom,
  isSelectedMinuteOptionAtom,
  minutesOptionAtom,
  priceChartOptionAtom,
  setPriceChartOptionAtom,
} from '@/store/chart';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

interface Option {
  type: ChartOptions;
  name: string;
}
const options: Option[] = [
  { type: 'days', name: '일' },
  { type: 'weeks', name: '주' },
  { type: 'months', name: '월' },
  { type: 'years', name: '년' },
];

const MINUTES_OPTIONS: ChartMinutesOptions[] = [1, 3, 5, 10, 15, 30, 60];

const PriceChartController = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedPriceChartOption = useAtomValue(priceChartOptionAtom);
  const selectedMinutesOption = useAtomValue(minutesOptionAtom);

  const setOption = useSetAtom(setPriceChartOptionAtom);
  const [isSelectedMinuteOption, setIsSelectedMinuteOption] = useAtom(
    isSelectedMinuteOptionAtom,
  );
  const [isChartOptionDropDownOpen, setIsChartOptionDropDownOpen] = useAtom(
    isChartOptionDropDownOpenAtom,
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsChartOptionDropDownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.chartHeaderContainer}>
      <div className={styles.minutesChartOption}>
        <button
          onClick={() => {
            console.log(isSelectedMinuteOption);
            if (!isSelectedMinuteOption) {
              setIsSelectedMinuteOption(true);
            } else {
              setIsChartOptionDropDownOpen(true);
            }
          }}
          className={`${styles.charOptionButton} ${isSelectedMinuteOption ? styles.selected : ''}`}
        >
          <span>{selectedMinutesOption}분</span>
          <AngleDown />
        </button>
        {isChartOptionDropDownOpen && (
          <div ref={containerRef} className={styles.minutesChartOptions}>
            {MINUTES_OPTIONS.map((option) => (
              <button
                onClick={() => {
                  setIsChartOptionDropDownOpen(false);
                  setOption({ type: 'minutes', minutes: option });
                }}
                key={option}
                className={styles.minutesChartOptionButton}
              >
                {option}분
              </button>
            ))}
          </div>
        )}
      </div>

      {options.map((option) => (
        <button
          onClick={() => {
            setOption({ type: option.type });
          }}
          key={option.type}
          className={`${styles.charOptionButton} ${selectedPriceChartOption === option.type && !isSelectedMinuteOption ? styles.selected : ''} `}
        >
          <span>{option.name}</span>
        </button>
      ))}
    </div>
  );
};

export default PriceChartController;
