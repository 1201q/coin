import { useEffect, useState } from 'react';
import StepperInput from './StepperInput';
import styles from './order.module.css';
import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { selectedPriceAtom } from '@/store/user';
import OrderInput from './OrderInput';
import {
  MAX_ORDER_AMOUNT,
  MAX_ORDER_PRICE,
  MAX_ORDER_SUM,
} from './constants/constants';
import React from 'react';

const OrderForm = ({
  selectedTab,
  code,
}: {
  selectedTab: string;
  code: string;
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
  };

  const selectedPrice = useAtomValue(selectedPriceAtom);

  useEffect(() => {
    console.log(selectedPrice);
    if (selectedPrice > 0) {
      handlePriceChange(selectedPrice);
    }
  }, [selectedPrice]);

  const [krw, setKrw] = useState(20000000);
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [sum, setSum] = useState(0);
  const [orderType, setOrderType] = useState<'지정가' | '시장가'>('지정가');

  useEffect(() => {
    setAmount(0);
    setSum(0);
  }, [selectedTab]);

  useEffect(() => {
    setPrice(0);
  }, [code]);

  /* 
    관계 로직  
    4-1. 가격이 수정되면, 총액 = 가격 × 수량  
        단, 만약 총액이 최대 총액(MAX_ORDER_SUM)을 초과하면, 
        총액은 MAX_ORDER_SUM으로 고정하고 수량은 MAX_ORDER_SUM ÷ 가격로 조정.
        또한, 수량이 최대 수량(MAX_ORDER_AMOUNT)을 초과하면, 수량을 클램핑합니다.
  */
  const handlePriceChange = (newPrice: number) => {
    // 최대 가격 체크
    newPrice = Math.min(newPrice, MAX_ORDER_PRICE);
    let newAmount = amount;
    let newSum = newPrice * newAmount;
    if (newSum > MAX_ORDER_SUM) {
      newSum = MAX_ORDER_SUM;
      newAmount = newPrice > 0 ? newSum / newPrice : 0;
    }
    if (newAmount > MAX_ORDER_AMOUNT) {
      newAmount = MAX_ORDER_AMOUNT;
      newSum = newPrice * newAmount;
    }
    setPrice(newPrice);
    setAmount(newAmount);
    setSum(newSum);
  };

  /* 
          4-2. 수량이 수정되면, 가격은 그대로, 총액 = 가격 × 수량.
              만약 총액이 MAX_ORDER_SUM을 초과하면, 총액은 MAX_ORDER_SUM으로, 
              수량은 MAX_ORDER_SUM ÷ 가격로 조정.
        */
  const handleAmountChange = (newAmount: number) => {
    newAmount = Math.min(newAmount, MAX_ORDER_AMOUNT);
    let newSum = price * newAmount;
    if (newSum > MAX_ORDER_SUM) {
      newSum = MAX_ORDER_SUM;
      newAmount = price > 0 ? newSum / price : 0;
    }
    setAmount(newAmount);
    setSum(newSum);
  };

  /* 
          4-3. 총액이 수정되면, 가격은 그대로, 수량 = 총액 ÷ 가격.
              단, 만약 수량이 MAX_ORDER_AMOUNT을 초과하면, 수량을 클램핑하고 총액을 재계산.
        */
  const handleSumChange = (newSum: number) => {
    newSum = Math.min(newSum, MAX_ORDER_SUM);
    let newAmount = 0;
    if (price > 0) {
      newAmount = newSum / price;
      if (newAmount > MAX_ORDER_AMOUNT) {
        newAmount = MAX_ORDER_AMOUNT;
        newSum = price * newAmount;
      }
    }
    setSum(newSum);
    setAmount(newAmount);
  };

  /* 
          4-4. 예외 케이스: 만약 어느 한 값(또는 둘)이 최대치를 초과하면, 
              가격은 그대로 두고 총액을 MAX_ORDER_SUM으로 클램핑, 
              그리고 수량 = MAX_ORDER_SUM ÷ 가격로 조정.

        */

  const handleAmountButton = (ratio: number) => {
    if (price === 0) return;
    const calcKrw = krw * ratio;
    let newAmount = calcKrw / price;
    const maxAllowed = Math.min(MAX_ORDER_AMOUNT, MAX_ORDER_SUM / price);
    newAmount = Math.min(newAmount, maxAllowed);
    const newSum = price * newAmount;
    setAmount(Number(newAmount.toFixed(8)));
    setSum(newSum);
  };

  const handleSumButton = (increment: number) => {
    let newSum = sum + increment;
    if (newSum > MAX_ORDER_SUM) {
      newSum = MAX_ORDER_SUM;
    }
    handleSumChange(newSum);
  };

  const handleRadioButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderType(event.target.id as '지정가' | '시장가');
  };

  const handleResetButton = () => {
    setPrice(0);
    setAmount(0);
    setSum(0);
  };

  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <div className={styles.optionContainer}>
        <label htmlFor="주문형태">주문형태</label>
        <div className={styles.infoContainer}>
          <input
            className={`${orderType === '지정가' && (selectedTab === '매수' ? styles.redradio : styles.blueradio)}`}
            name="주문형태"
            id="지정가"
            type="radio"
            onChange={handleRadioButton}
            checked={orderType === '지정가'}
          />
          <label htmlFor="지정가">지정가</label>
          <input
            className={`${orderType === '시장가' && (selectedTab === '매수' ? styles.redradio : styles.blueradio)}`}
            name="주문형태"
            id="시장가"
            type="radio"
            onChange={handleRadioButton}
            checked={orderType === '시장가'}
          />
          <label htmlFor="시장가">시장가</label>
        </div>
      </div>
      <div className={styles.optionContainer}>
        <label htmlFor="주문가능">주문가능</label>
        <div className={styles.infoContainer}>
          <span className={styles.numericText}>{krw.toLocaleString()}</span>
          <span>{selectedTab === '매수' ? 'KRW' : code.split('-')[1]}</span>
        </div>
      </div>

      {orderType === '지정가' && (
        <>
          {' '}
          <div className={styles.optionContainer}>
            <label htmlFor="가격">가격</label>
            <StepperInput
              id="가격"
              placeholder="가격"
              value={price}
              setValue={handlePriceChange}
              maxPrice={MAX_ORDER_PRICE}
            />
          </div>
          {price}
          <div className={styles.optionContainer}>
            <label htmlFor="수량">수량</label>
            <OrderInput
              id="수량"
              placeholder="수량"
              value={amount}
              setValue={handleAmountChange}
              inputType="quantity"
              maxValue={MAX_ORDER_AMOUNT}
            />
          </div>
          <div className={styles.optionButtonContainer}>
            <button type="button" onClick={() => handleAmountButton(0.1)}>
              10%
            </button>
            <button type="button" onClick={() => handleAmountButton(0.25)}>
              25%
            </button>
            <button type="button" onClick={() => handleAmountButton(0.5)}>
              50%
            </button>
            <button type="button" onClick={() => handleAmountButton(1)}>
              최대
            </button>
          </div>
          {amount}
          <div className={styles.divider}></div>
        </>
      )}

      <div className={styles.optionContainer}>
        <label htmlFor="총액">총액</label>
        <OrderInput
          id="총액"
          placeholder="총액"
          value={sum}
          setValue={handleSumChange}
          inputType="price"
          maxValue={MAX_ORDER_SUM}
        />
      </div>
      <div className={styles.optionButtonContainer}>
        <button type="button" onClick={() => handleSumButton(10000)}>
          +1만
        </button>
        <button type="button" onClick={() => handleSumButton(100000)}>
          +10만
        </button>
        <button type="button" onClick={() => handleSumButton(1000000)}>
          +100만
        </button>
        <button type="button" onClick={() => handleSumButton(10000000)}>
          +1000만
        </button>
      </div>
      {sum}
      <div className={styles.submitButtonContainer}>
        <motion.button
          className={styles.resetButton}
          type="reset"
          onClick={handleResetButton}
          whileHover={{ filter: 'brightness(0.95)' }}
          whileTap={{ scale: 0.97 }}
        >
          초기화
        </motion.button>
        <motion.button
          type="submit"
          className={`${styles.submitButton} ${selectedTab === '매수' ? styles.red : styles.blue}`}
          whileHover={{ filter: 'brightness(0.9)' }}
          whileTap={{ scale: 0.97 }}
        >
          주문
        </motion.button>
      </div>
    </form>
  );
};

export default React.memo(OrderForm);
