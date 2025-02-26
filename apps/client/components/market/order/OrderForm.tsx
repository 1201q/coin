import styles from './order.module.css';

const OrderForm = () => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.optionContainer}>
        <label htmlFor="제목">가격</label>
        <div id="제목" className={styles.inputContainer}>
          <input
            inputMode="numeric"
            type="text"
            pattern="[0-9|,|.]+"
            placeholder="수량"
          />
        </div>
      </div>
      <div className={styles.optionContainer}>
        <label htmlFor="제목">가격</label>
        <div id="제목" className={styles.inputContainer}>
          <input
            inputMode="numeric"
            type="text"
            pattern="[0-9|,|.]+"
            placeholder="수량"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
