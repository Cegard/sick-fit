import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeUser } from '../lib/testUtils';
import { CartStateProvider } from '../lib/cartState';

const notLoggedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];

const loggedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];

const loggedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: { authenticatedItem: fakeUser({ cart: [fakeCartItem()] }) },
    },
  },
];

describe('<Nav />', () => {
  it('Renders a minimal nav when logged out', () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider mocks={notLoggedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    expect(container).toHaveTextContent('Log in');
    expect(container).toMatchSnapshot();
    const link = screen.getByText('Log in');
    expect(link).toHaveAttribute('href', '/login');
    const products = screen.getByText('Products');
    expect(products).toBeInTheDocument();
    expect(products).toHaveAttribute('href', '/products');
  });

  it('Renders a full nav when logged in', async () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider mocks={loggedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    await screen.findByText('Account');
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('Log out');
  });

  it('Renders the amount of items in the cart', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={loggedInMocksWithCartItems}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    await screen.findByText('Account');
    expect(screen.getByText(3)).toBeInTheDocument();
  });
});
