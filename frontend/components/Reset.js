import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });
  const [resetPassword, { data, error }] = useMutation(RESET_MUTATION, {
    variables: { ...inputs },
  });
  const existingError = error || data?.redeemUserPasswordResetToken;

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await resetPassword();
    console.log('waiting');
    console.log({ data, res });
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={(e) => handleSubmit(e)}>
      <h2> Reset Your Password </h2>
      {existingError && <DisplayError error={existingError} />}
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && <p>Password Updated</p>}
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
        <button type="submit"> Request Reset </button>
      </fieldset>
    </Form>
  );
}
