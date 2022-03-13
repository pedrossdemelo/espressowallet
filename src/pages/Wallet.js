import React from 'react';
import { ExpenseForm, WalletHeader } from '../components';
import ExpenseTable from '../components/ExpenseTable';

function Wallet() {
  return (
    <>
      <WalletHeader />
      <main>
        <ExpenseForm />
        <ExpenseTable />
      </main>
    </>
  );
}

export default Wallet;
