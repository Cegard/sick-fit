import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset';
import { fakeUser } from '../lib/testUtils';

const fakeMe = fakeUser();

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: {
        email: fakeMe.email,
      },
    },
    result: {
      data: {
        sendUserPasswordResetLink: null,
      },
    },
  },
];

describe('<RequestRest/>', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('Calls the mutation when submited', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    const emailInput = screen.getByPlaceholderText('email@example.com');
    const submitButton = screen.getByText('Request Reset');

    userEvent.type(emailInput, fakeMe.email);
    userEvent.click(submitButton);

    const success = await screen.findByText(
      'Check the link sent to your email'
    );

    expect(success).toBeInTheDocument();
  });
});
