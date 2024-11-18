import React, { useState, useEffect } from 'react';
import styles from './Counter.module.css';

function Counter({ value, onChange }) {
  const [count, setCount] = useState(value);

  useEffect(() => {
    setCount(value);
  }, [value]);

  const increment = () => {
    if (count < 5) {
      const newCount = count + 1;
      setCount(newCount);
      onChange(newCount); // Notifica al padre el nuevo valor
    }
  };

  const decrement = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      onChange(newCount); // Notifica al padre el nuevo valor
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={decrement}>-</button>
      <span className={styles.counter}>{count}</span>
      <button className={styles.button} onClick={increment}>+</button>
    </div>
  );
}

export default Counter;
