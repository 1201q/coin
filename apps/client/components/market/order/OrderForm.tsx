import { useState } from 'react';
import NumericStepperInput from './NumericStepperInput';
import styles from './order.module.css';

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

  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <div className={styles.optionContainer}>
        <label htmlFor="주문가능">주문가능</label>
        <div className={styles.infoContainer}>
          <span className={styles.numericText}>0</span>
          <span>{selectedTab === '매수' ? 'KRW' : code.split('-')[1]}</span>
        </div>
      </div>
      <div className={styles.optionContainer}>
        <label htmlFor="가격">가격</label>
        <NumericStepperInput
          id="가격"
          placeholder="가격"
          value={price}
          setValue={setPrice}
        />
      </div>
      <div className={styles.optionContainer}>
        <label htmlFor="수량">수량</label>
        <NumericStepperInput
          id="수량"
          placeholder="수량"
          value={amount}
          setValue={setAmount}
        />
      </div>
      <div className={styles.optionButtonContainer}>
        <button type="button">10%</button>
        <button type="button">25%</button>
        <button type="button">50%</button>
        <button type="button">최대</button>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.optionContainer}>
        <label htmlFor="총액">총액</label>
        <NumericStepperInput
          id="총액"
          placeholder="총액"
          isDisplayButton={false}
          value={price}
          setValue={setPrice}
        />
      </div>
      <div className={styles.optionButtonContainer}>
        <button type="button">+1만</button>
        <button type="button">+10만</button>
        <button type="button">+100만</button>
        <button type="button">+1000만</button>
      </div>
      <div className={styles.submitButtonContainer}>
        <button type="reset" className={styles.resetButton}>
          초기화
        </button>
        <button
          type="submit"
          className={`${styles.submitButton} ${selectedTab === '매수' ? styles.red : styles.blue}`}
        >
          주문
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
