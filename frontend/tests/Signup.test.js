import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Signup, { SIGNUP_MUTATION } from '../components/SignUp';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const password = 'pass123';

const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password,
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'id1',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
];

describe('<Signup />', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('Calls the mutation properly', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <Signup />
      </MockedProvider>
    );

    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('email@example.com');
    const passwordInput = screen.getByPlaceholderText('Your password');
    const submitButton = screen.getByText('Create Account');

    await userEvent.type(nameInput, me.name);
    await userEvent.type(emailInput, me.email);
    await userEvent.type(passwordInput, password);

    await userEvent.click(submitButton);
    await screen.findByText(`Signed up with ${me.email}`);
  });
});
