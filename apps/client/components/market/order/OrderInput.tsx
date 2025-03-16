'use client';

import { useRef, useState } from 'react';
import styles from './input.module.css';
import { comma, orderformAmount } from '@/utils/formatting';

interface Props {
  id: string;
  placeholder: string;
  value: number;
  setValue: (newValue: number) => void;
  inputType?: 'price' | 'quantity';
  maxValue?: number;
}

const OrderInput = ({
  id,
  placeholder,
  value,
  setValue,
  inputType,
  maxValue,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [rawValue, setRawValue] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      if (inputType === 'price') {
        if (val.includes('.')) {
          return;
        }
        if (val !== '' && parseInt(val, 10) < 1) {
          return;
        }
      }

      const maxDecimals = inputType === 'quantity' ? 8 : 0;
      const parts = val.split('.');
      if (parts[1] && parts[1].length > maxDecimals) {
        return;
      }

      const parsedValue =
        inputType === 'price' ? parseInt(val, 10) : parseFloat(val);

      if (maxValue !== undefined && parsedValue > maxValue) {
        setRawValue(maxValue.toString());
        setValue(maxValue);
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

    let roundedValue = value;

    if (inputType === 'price') {
      roundedValue = value < 1 ? 0 : value;
    } else {
      roundedValue = Number(value.toFixed(8));
    }

    if (maxValue !== undefined && roundedValue > maxValue) {
      roundedValue = maxValue;
    }

    setValue(roundedValue);
    setRawValue(comma(roundedValue, roundedValue));
  };

  const formatting = (value: number) => {
    if (inputType === 'price') {
      return Number(value.toFixed()).toLocaleString();
    } else {
      return orderformAmount(value);
    }
  };

  return (
    <div id={id} className={`${styles.container}`}>
      <input
        inputMode={inputType === 'price' ? 'numeric' : 'decimal'}
        type="text"
        placeholder={placeholder}
        ref={inputRef}
        value={isFocus ? rawValue : formatting(value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  );
};

export default OrderInput;
