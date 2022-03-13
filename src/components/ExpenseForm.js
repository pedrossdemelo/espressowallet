import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpenseThunk } from '../store/actions';
import getRates from '../services/getRates';

const methodInputs = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];

const tagInputs = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];

export default function ExpenseForm() {
  const dispatch = useDispatch();
  const [currencies, setCurrencies] = useState([]);
  const lastId = useRef(0);
  const updating = useSelector((state) => state.wallet.updating);
  const expenses = useSelector((state) => state.wallet.expenses);

  const [formState, setFormState] = useState({
    method: 'Dinheiro',
    tag: 'Alimentação',
    value: '0',
    currency: 'USD',
    description: '',
  });
  const { method, tag, value, currency, description } = formState;

  useEffect(() => {
    const expenseToEdit = updating === null
      ? null
      : {
        ...expenses.find((expense) => expense.id === updating),
        exchangeRate: undefined,
      };
    if (expenseToEdit) setFormState(expenseToEdit);
  }, [updating, expenses]);

  useEffect(() => {
    (async () => {
      const { data, error } = await getRates();
      if (error) return;
      setCurrencies(Object.keys(data));
    })();
  }, []);

  function handleChange(e) {
    const { name, value: valuePair } = e.target;
    const key = name.split('-')[0];
    setFormState({
      ...formState,
      [key]: valuePair,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const id = updating ?? lastId.current;
    if (updating) lastId.current -= 1;
    dispatch(addExpenseThunk({ ...formState, id }));
    lastId.current += 1;
    setFormState({ ...formState, value: '0' });
  }

  return (
    <form onSubmit={ handleSubmit }>
      <input
        name="value-input"
        type="number"
        placeholder="Valor"
        data-testid="value-input"
        onChange={ handleChange }
        value={ value }
      />
      <input
        type="text"
        name="description-input"
        placeholder="Descrição"
        data-testid="description-input"
        onChange={ handleChange }
        value={ description }
      />
      <label htmlFor="currency-input">
        Moeda:
        <select
          id="currency-input"
          name="currency-input"
          data-testid="currency-input"
          onChange={ handleChange }
          value={ currency }
        >
          {currencies.map((c) => (
            <option data-testid={ c } value={ c } key={ c }>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="method-input">
        Método de pagamento:
        <select
          id="method-input"
          name="method-input"
          data-testid="method-input"
          onChange={ handleChange }
          value={ method }
        >
          {methodInputs.map((m) => (
            <option data-testid={ m } value={ m } key={ m }>
              {m}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="tag-input">
        Categoria:
        <select
          onChange={ handleChange }
          id="tag-input"
          name="tag-input"
          data-testid="tag-input"
          value={ tag }
        >
          {tagInputs.map((t) => (
            <option data-testid={ t } value={ t } key={ t }>
              {t}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">
        {updating === null ? 'Adicionar ' : 'Editar '}
        despesa
      </button>
    </form>
  );
}
