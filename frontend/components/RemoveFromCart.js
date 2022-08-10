import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($productId: ID!) {
    deleteCartItem(id: $productId) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

const StyledButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

export default function RemoveFromCart({ productId }) {
  const [removeItem, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { productId },
    update,
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id: productId,
    //   },
    // },
  });
  return (
    <StyledButton
      disabled={loading}
      type="button"
      onClick={removeItem}
      title="Remove this item from shopping cart"
    >
      X
    </StyledButton>
  );
}
