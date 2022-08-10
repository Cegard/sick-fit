import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import wait from 'waait';
import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from '../components/CreateProduct';
import { fakeItem } from '../lib/testUtils';
import { ALL_PRODUCTS_QUERY } from '../components/Products';

const fakedItem = fakeItem();
jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('<CreateProduct/>', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('Handles the updating', async () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    const productNameInput = screen.getByPlaceholderText(/Name/);
    const productPriceInput = screen.getByPlaceholderText('0');
    const productDescriptionInput = screen.getByPlaceholderText('');

    await userEvent.type(productNameInput, fakedItem.name);
    await userEvent.type(productPriceInput, fakedItem.price.toString());
    await userEvent.type(productDescriptionInput, fakedItem.description);

    const populatedProductName = screen.getByDisplayValue(fakedItem.name);
    const populatedProductPrice = screen.getByDisplayValue(fakedItem.price);
    const populatedProductDescription = screen.getByDisplayValue(
      fakedItem.description
    );

    expect(populatedProductName).toBeInTheDocument();
    expect(populatedProductPrice).toBeInTheDocument();
    expect(populatedProductDescription).toBeInTheDocument();
  });

  it('Creates the items when the form is submitted', async () => {
    const mocks = [
      {
        request: {
          query: CREATE_PRODUCT_MUTATION,
          variables: {
            name: fakedItem.name,
            description: fakedItem.description,
            price: fakedItem.price,
            image: '',
          },
        },
        result: {
          data: {
            createProduct: { ...fakedItem, id: 'abc123', __typename: 'Item' },
          },
        },
      },
      {
        request: {
          query: ALL_PRODUCTS_QUERY,
          variables: { skip: 0, first: 2 },
        },
        result: { data: { allProducts: [fakedItem] } },
      },
    ];

    const { container } = render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );

    const productNameInput = screen.getByPlaceholderText(/Name/);
    const productPriceInput = screen.getByPlaceholderText('0');
    const productDescriptionInput = screen.getByPlaceholderText('');
    const submitButton = screen.getByText('+ Add Product');

    await userEvent.type(productNameInput, fakedItem.name);
    await userEvent.type(productPriceInput, fakedItem.price.toString());
    await userEvent.type(productDescriptionInput, fakedItem.description);
    await userEvent.click(submitButton);

    await waitFor(() => wait(0));

    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({ pathname: '/product/abc123' });
  });
});
