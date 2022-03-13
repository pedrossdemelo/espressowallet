import React from 'react';
import { useSelector } from 'react-redux';

export default function WalletHeader() {
  const email = useSelector((state) => state.user.email) || 'Email unknown';
  const expenses = useSelector((state) => state.wallet.expenses);
  const isFetching = useSelector((state) => state.wallet.isFetching);

  const calculateRate = (expense) => {
    const { currency, value, exchangeRates } = expense;
    const {
      [currency]: { ask: rate },
    } = exchangeRates;
    return value * rate;
  };

  const totalExpenses = expenses
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  return (
    <header>
      <h4 data-testid="email-field">{email}</h4>
      <h4 data-testid="total-field">
        {totalExpenses}
        {isFetching ? ' 🔄' : ''}
      </h4>
      <h4 data-testid="header-currency-field">BRL</h4>
    </header>
  );
}
