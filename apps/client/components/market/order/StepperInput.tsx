'use client';

import { useRef, useState } from 'react';
import styles from './input.module.css';
import { comma } from '@/utils/formatting';
import {
  formatPrice,
  getFixedDecimalsPrice,
  getStepValue,
} from './utils/order';

interface Props {
  id: string;
  placeholder: string;
  value: number;
  setValue: (newPrice: number) => void;
  maxPrice?: number;
}

const StepperInput = ({
  id,
  placeholder,
  maxPrice,
  value,
  setValue,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [rawValue, setRawValue] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      const parsedValue = parseFloat(val);

      if (maxPrice !== undefined && parsedValue > maxPrice) {
        setRawValue(maxPrice.toString());
        setValue(maxPrice);
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
    let newValue = value;

    if (value >= 100000) {
      const step = getStepValue(value);
      newValue = Math.round(value / step) * step;
    }

    if (newValue === 0) {
      setValue(0);
      setRawValue('0');
      return;
    }

    newValue = parseFloat(formatPrice(newValue));
    if (maxPrice !== undefined && newValue > maxPrice) {
      newValue = maxPrice;
    }
    setValue(newValue);
    setRawValue(comma(newValue, newValue));
  };

  const decrementPrice = (current: number): number => {
    if (current === 0) return 0;

    /*

    if (current >= 10000) {
      // 만단위 이상: 10씩 감소
      return current - 10;
    }

*/

    const step = getStepValue(current);
    let newPrice = current - step;
    // 100000 이상부터는 step 단위로 내림 처리
    if (current >= 100000) {
      newPrice = Math.floor(newPrice / step) * step;
    } else {
      const decimals = getFixedDecimalsPrice(current);
      newPrice = parseFloat(newPrice.toFixed(decimals));
    }
    return newPrice < 0 ? 0 : newPrice;
  };

  const incrementPrice = (current: number): number => {
    // 만약 현재 가격이 0이면, 1의 범위 step을 사용
    if (current === 0) return getStepValue(1);

    /*
    
    if (current >= 10000) {
      // 만단위 이상: 10씩 증가
      return current + 10;
    }
*/

    const step = getStepValue(current);

    let newPrice = current + step;
    // 100000 이상부터는 step 단위로 올림 처리
    if (current >= 100000) {
      newPrice = Math.ceil(newPrice / step) * step;
    } else {
      const decimals = getFixedDecimalsPrice(current);
      newPrice = parseFloat(newPrice.toFixed(decimals));
    }
    return newPrice;
  };

  const handleDecrement = () => {
    if (value === 0) return;
    let newValue = decrementPrice(value);
    if (maxPrice !== undefined && newValue > maxPrice) {
      newValue = maxPrice;
    }
    setValue(newValue);
    setRawValue(newValue.toString());
  };

  const handleIncrement = () => {
    if (value === 0) return;
    let newValue = incrementPrice(value);
    if (maxPrice !== undefined && newValue > maxPrice) {
      newValue = maxPrice;
    }
    setValue(newValue);
    setRawValue(newValue.toString());
  };

  return (
    <div id={id} className={`${styles.stepperInputContainer}`}>
      <input
        inputMode="decimal"
        type="text"
        placeholder={placeholder}
        ref={inputRef}
        value={isFocus ? rawValue : comma(value, value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />

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
    </div>
  );
};

export default StepperInput;
