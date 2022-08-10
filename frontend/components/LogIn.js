import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function LogIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });
  const [login, { data, loading }] = useMutation(LOGIN_MUTATION, {
    variables: { ...inputs },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await login();
    console.log({ data, res });
    resetForm();

    if (
      res.data.authenticateUserWithPassword.__typename ===
      'UserAuthenticationWithPasswordSuccess'
    ) {
      Router.push({
        pathname: `/products`,
      });
    }
  }

  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data.authenticateUserWithPassword
      : null;

  return (
    <Form method="POST" onSubmit={(e) => handleSubmit(e)}>
      <h2> Log In! </h2>
      <DisplayError error={error} />
      <fieldset>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="your password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit"> Log In </button>
      </fieldset>
    </Form>
  );
}
