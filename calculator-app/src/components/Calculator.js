import React, { useState } from 'react';
import Display from './Display';
import Button from './Button';

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memoryValue, setMemoryValue] = useState(0);

  const handleNumberClick = (numStr) => {
    let currentDisplayVal = displayValue;
    if (currentDisplayVal === 'Error' || waitingForOperand) {
        currentDisplayVal = '0'; // Conceptually reset if error or if waiting for new operand
    }

    const num = String(numStr);
    if (num === '.') {
      // If error, or waiting for new number, start with "0."
      if (displayValue === 'Error' || waitingForOperand) {
        setDisplayValue('0.');
        setWaitingForOperand(false);
      } else if (!currentDisplayVal.includes('.')) { // Use currentDisplayVal that's error-cleared
        setDisplayValue(currentDisplayVal + '.');
      }
      return;
    }

    // If error, or waiting for new number, replace display
    if (displayValue === 'Error' || waitingForOperand) {
      setDisplayValue(num);
      setWaitingForOperand(false);
    } else {
      // Append to existing number
      setDisplayValue(currentDisplayVal === '0' ? num : currentDisplayVal + num);
    }
  };

  const performCalculation = (val1, val2, op) => {
    switch (op) {
      case '+': return val1 + val2;
      case '-': return val1 - val2;
      case '*': return val1 * val2;
      case '/': return val2 === 0 ? 'Error' : val1 / val2;
      default: return val2;
    }
  };

  const handleOperatorClick = (op) => {
    if (displayValue === 'Error') return;
    const inputValue = parseFloat(displayValue);

    if (operator && !waitingForOperand && prevValue !== null) {
      const result = performCalculation(prevValue, inputValue, operator);
      if (result === 'Error') {
        setDisplayValue('Error');
        setPrevValue(null); setOperator(null); setWaitingForOperand(true);
        return;
      }
      setDisplayValue(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(inputValue);
    }
    setWaitingForOperand(true);
    setOperator(op);
  };

  const handleEqualClick = () => {
    if (displayValue === 'Error' || prevValue === null || !operator) {
      return;
    }
    const inputValue = parseFloat(displayValue);
    const result = performCalculation(prevValue, inputValue, operator);

    if (result === 'Error') {
      setDisplayValue('Error');
      setPrevValue(null); setOperator(null); setWaitingForOperand(true);
    } else {
      setDisplayValue(String(result));
      setPrevValue(result);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleClearClick = () => {
    setDisplayValue('0');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };

  const handleMemoryClear = () => {
    setMemoryValue(0);
  };

  const handleMemoryRecall = () => {
    setDisplayValue(String(memoryValue));
    setWaitingForOperand(true);
  };

  const handleMemoryAdd = () => {
    if (displayValue === 'Error') return;
    setMemoryValue(memoryValue + parseFloat(displayValue));
    setWaitingForOperand(true);
  };

  const handleMemorySubtract = () => {
    if (displayValue === 'Error') return;
    setMemoryValue(memoryValue - parseFloat(displayValue));
    setWaitingForOperand(true);
  };

  const handleSquareRoot = () => {
    if (displayValue === 'Error') return;
    const currentValue = parseFloat(displayValue);
    if (currentValue < 0) {
      setDisplayValue('Error');
      setPrevValue(null); setOperator(null); setWaitingForOperand(true);
    } else {
      setDisplayValue(String(Math.sqrt(currentValue)));
      setWaitingForOperand(true);
    }
  };

  const handlePercentage = () => {
    if (displayValue === 'Error') return;
    const currentValue = parseFloat(displayValue);
    if (prevValue !== null && operator) {
        // Calculate percentage with respect to prevValue if in a chain operation
        // Example: 100 + 10% should be 100 + (10/100 * 100) = 110
        // Or 100 * 10% should be 100 * (10/100) = 10
        // The current prompt implies '%' might be more like a unary operation on displayValue,
        // or it might be context-dependent.
        // For typical calculator behavior, `A op B %` means `A op (A * B/100)` or `A op (B/100)`
        // Let's assume B% means B/100 of A if A is present.
        // If A is 100 and op is +, and current display is 10, then 100 + 10% means 100 + (10/100 * 100) = 110
        // The new displayValue should be the result of the operation.
        const percentageOfPrevValue = performCalculation(prevValue, currentValue / 100, '*');
        setDisplayValue(String(percentageOfPrevValue));

    } else {
        // If no operator/prevValue, it's like a unary operation: 50% -> 0.5
        setDisplayValue(String(currentValue / 100));
    }
    setWaitingForOperand(true);
  };

  return (
    <div className="calculator">
      <Display value={displayValue} />
      <div className="keypad" style={{gridTemplateColumns: 'repeat(5, 1fr)'}}>
        {/* Row 1 */}
        <Button value="MC" onClick={handleMemoryClear} />
        <Button value="MR" onClick={handleMemoryRecall} />
        <Button value="M+" onClick={handleMemoryAdd} />
        <Button value="M-" onClick={handleMemorySubtract} />
        <Button value="C" onClick={handleClearClick} />
        {/* Row 2 */}
        <Button value="(" onClick={() => { alert("Parentheses not implemented yet"); }} />
        <Button value=")" onClick={() => { alert("Parentheses not implemented yet"); }} />
        <Button value="%" onClick={handlePercentage} />
        <Button value="√" onClick={handleSquareRoot} />
        <Button value="/" onClick={handleOperatorClick} />
        {/* Row 3 */}
        <Button value="7" onClick={handleNumberClick} />
        <Button value="8" onClick={handleNumberClick} />
        <Button value="9" onClick={handleNumberClick} />
        <Button value="*" onClick={handleOperatorClick} />
        <Button value=" " style={{visibility: 'hidden'}}/> {/* Dummy for layout */}
        {/* Row 4 */}
        <Button value="4" onClick={handleNumberClick} />
        <Button value="5" onClick={handleNumberClick} />
        <Button value="6" onClick={handleNumberClick} />
        <Button value="-" onClick={handleOperatorClick} />
        <Button value=" " style={{visibility: 'hidden'}}/> {/* Dummy for layout */}
        {/* Row 5 */}
        <Button value="1" onClick={handleNumberClick} />
        <Button value="2" onClick={handleNumberClick} />
        <Button value="3" onClick={handleNumberClick} />
        <Button value="+" onClick={handleOperatorClick} />
        <Button value=" " style={{visibility: 'hidden'}}/> {/* Dummy for layout */}
        {/* Row 6 */}
        <Button value="0" onClick={handleNumberClick} style={{gridColumn: 'span 2'}}/>
        <Button value="." onClick={handleNumberClick} />
        <Button value="=" onClick={handleEqualClick} />
        <Button value=" " style={{visibility: 'hidden'}}/> {/* Dummy for layout */}
      </div>
    </div>
  );
};

export default Calculator;
