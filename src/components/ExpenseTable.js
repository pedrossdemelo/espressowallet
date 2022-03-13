import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { deleteExpense, editExpense } from '../store/actions';

const tableHeaderItems = [
  'Descrição',
  'Tag',
  'Método de pagamento',
  'Valor',
  'Moeda',
  'Câmbio utilizado',
  'Valor convertido',
  'Moeda de conversão',
  'Editar/Excluir',
];

export default function ExpenseTable() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.wallet.expenses);

  return (
    <table>
      <thead>
        <tr>
          {tableHeaderItems.map((item) => (
            <th key={ item }>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => {
          const currency = expense.exchangeRates[expense.currency];
          const realValue = Number(expense.value) * Number(currency.ask);
          return (
            <tr key={ expense.id }>
              <td>{expense.description}</td>
              <td>{expense.tag}</td>
              <td>{expense.method}</td>
              <td>{Number(expense.value).toFixed(2)}</td>
              <td>{currency.name}</td>
              <td>{Number(currency.ask).toFixed(2)}</td>
              <td>{realValue.toFixed(2)}</td>
              <td>Real</td>
              <td>
                <button
                  type="button"
                  data-testid="edit-btn"
                  onClick={ () => dispatch(editExpense(expense.id)) }
                >
                  Editar
                </button>
                <button
                  type="button"
                  data-testid="delete-btn"
                  onClick={ () => dispatch(deleteExpense(expense.id)) }
                >
                  Deletar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
