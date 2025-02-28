'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './input.module.css';
import { comma, orderbook } from '@/utils/formatting';
import { useAtom, useAtomValue } from 'jotai';
import { selectedPriceAtom } from '@/store/user';

interface Props {
  id: string;
  placeholder: string;
  isDisplayButton?: boolean;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}

const NumericStepperInput = ({
  id,
  placeholder,
  isDisplayButton = true,
  value,
  setValue,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [rawValue, setRawValue] = useState(value.toString());
  const selectedPrice = useAtomValue(selectedPriceAtom);

  const getMaxDecimals = (num: number) => {
    if (num >= 1000) return 0;
    else if (num >= 100) return 1;
    else if (num >= 10) return 2;
    else if (num >= 1) return 3;
    else if (num >= 0.1) return 4;
    else if (num >= 0.01) return 5;
    else if (num >= 0.001) return 6;
    else if (num >= 0.0001) return 7;
    else return 8;
  };

  const getStepValue = (num: number) => {
    if (num < 0.001) return 0.0000001;
    if (num < 0.01) return 0.000001;
    if (num < 0.1) return 0.00001;
    if (num < 1) return 0.0001;
    if (num < 10) return 0.001;
    if (num < 100) return 0.01;
    if (num < 1000) return 0.1;
    if (num < 10000) return 1;
    if (num < 100000) return 10;
    if (num < 500000) return 50;
    if (num < 1000000) return 100;
    if (num < 2000000) return 500;
    return 1000;
  };

  const getRoundDecimals = (num: number) => {
    return num >= 10 ? 3 : getMaxDecimals(num);
  };

  const roundValue = (val: number) => {
    if (val >= 10000) {
      const step = getStepValue(val);
      return Math.round(val / step) * step;
    } else {
      const decimals = getRoundDecimals(val);
      return parseFloat(val.toFixed(decimals));
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      const parts = val.split('.');
      const parsedValue = parseFloat(val);

      const maxDecimals = getMaxDecimals(
        isNaN(parsedValue) ? value : parsedValue,
      );
      if (parts[1] && parts[1].length > maxDecimals) {
        return;
      }
      setRawValue(val);
      setValue(isNaN(parsedValue) ? 0 : parsedValue);
    }
  };

  const handleFocus = () => {
    setIsFocus(true);
    setRawValue(value.toString());
  };

  const handleBlur = () => {
    setIsFocus(false);

    const roundedValue = roundValue(value);
    setValue(roundedValue);
    setRawValue(comma(roundedValue, roundedValue));
  };

  const calculateDecrementStep = (current: number): number => {
    let factor = 1;
    let extraDecimal = 0;

    if (current === 2000000) {
      factor = 1 / 2;
    } else if (current === 1000000) {
      factor = 1 / 5;
    } else if (current === 500000) {
      factor = 1 / 2;
    } else if (current === 100000) {
      factor = 1 / 5;
    } else if (current === 10000) {
      factor = 1 / 10;
    } else if (
      (current <= 1000 && Number.isInteger(current)) ||
      current === 0.1 ||
      current === 0.01 ||
      current === 0.001
    ) {
      factor = 1 / 10;
      extraDecimal = 1;
    }
    const step = getStepValue(current) * factor;
    const decimals = getRoundDecimals(current) + extraDecimal;
    return parseFloat((current - step).toFixed(decimals));
  };

  const handleDecrement = () => {
    const newValue = calculateDecrementStep(value);
    setValue(newValue);
    setRawValue(newValue.toString());
  };

  const handleIncrement = () => {
    const decimals = getRoundDecimals(value);
    const newValue = parseFloat(
      (value + getStepValue(value)).toFixed(decimals),
    );

    setValue(newValue);
    setRawValue(newValue.toString());
  };

  useEffect(() => {
    setValue(selectedPrice);
  }, [selectedPrice]);

  return (
    <div id={id} className={`${styles.container}`}>
      <input
        inputMode="decimal"
        type="text"
        placeholder={placeholder}
        ref={inputRef}
        value={isFocus ? rawValue : comma(value, value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
      />
      {isDisplayButton && (
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.stepperButton}
            onClick={handleDecrement}
          >
            -
          </button>
          <button
            type="button"
            className={styles.stepperButton}
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default NumericStepperInput;
