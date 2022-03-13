import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from '../store/actions';

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    email: '',
    password: '',
  });
  const { email, password } = state;

  function handleChange(e) {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(login(email));
    history.push('/carteira');
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+\w{2,4}$/g;
  const minPasswordLength = 6;

  return (
    <div>
      <form onSubmit={ handleSubmit }>
        <input
          name="email"
          data-testid="email-input"
          type="email"
          placeholder="Email"
          value={ email }
          onChange={ handleChange }
        />

        <input
          name="password"
          data-testid="password-input"
          type="password"
          placeholder="Password"
          value={ password }
          onChange={ handleChange }
        />

        <button
          disabled={ !emailRegex.test(email) || password.length < minPasswordLength }
          type="submit"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
