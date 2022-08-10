import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const MUTATION_DELETE_PRODUCT = gql`
  mutation MUTATION_DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(MUTATION_DELETE_PRODUCT, {
    variables: {
      id,
    },
    update,
  });

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Are you sure?')) {
          deleteProduct().catch((err) => alert(err.message));
        }
      }}
    >
      {children}
    </button>
  );
}
