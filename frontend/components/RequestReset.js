import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });
  const [sendRequestReset, { data, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: { ...inputs },
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    await sendRequestReset();
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={(e) => handleSubmit(e)}>
      <h2> Forgot Your Password </h2>
      {error && <DisplayError error={error} />}
      <fieldset>
        {data?.sendUserPasswordResetLink === null && (
          <p>Check the link sent to your email</p>
        )}
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
        <button type="submit"> Request Reset </button>
      </fieldset>
    </Form>
  );
}

export { REQUEST_RESET_MUTATION };
