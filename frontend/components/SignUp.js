import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
      name
      email
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    name: '',
    email: '',
    password: '',
  });
  const [signup, { data, error }] = useMutation(SIGNUP_MUTATION, {
    variables: { ...inputs },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    await signup();
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={(e) => handleSubmit(e)}>
      <h2> Create an user account </h2>
      {error && <DisplayError error={error} />}
      <fieldset>
        {data?.createUser && <p>Signed up with {data.createUser.email}</p>}
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
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
            placeholder="Your password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit"> Create Account </button>
      </fieldset>
    </Form>
  );
}

export { SIGNUP_MUTATION };
