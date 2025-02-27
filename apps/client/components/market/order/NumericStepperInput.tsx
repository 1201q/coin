'use client';

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import styles from './input.module.css';
import { comma, orderbook } from '@/utils/formatting';

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setRawValue(val);
      const parsedValue = parseFloat(val);
      setValue(isNaN(parsedValue) ? 0 : parsedValue);
    }
  };

  const handleFocus = () => {
    setIsFocus(true);
    setRawValue(value.toString());
  };
  const handleBlur = () => {
    setIsFocus(false);
    const formatted = comma(value, value);
    setRawValue(formatted);
  };

  return (
    <div id={id} className={`${styles.container}`}>
      <input
        inputMode="decimal"
        type="text"
        placeholder={placeholder}
        ref={inputRef}
        value={rawValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
      />
      {isDisplayButton && (
        <div className={styles.buttonContainer}>
          <button type="button" className={styles.stepperButton}>
            -
          </button>
          <button type="button" className={styles.stepperButton}>
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default NumericStepperInput;
