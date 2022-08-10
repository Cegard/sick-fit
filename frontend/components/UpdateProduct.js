import { gql, useMutation, useQuery } from '@apollo/client';
import { SINGLE_ITEM_QUERY } from './SingleProduct';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';
import Form from './styles/Form';

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      name
      description
      price
    }
  }
`;

export default function UpdateProduct({ productId }) {
  const { data, error, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id: productId },
  });

  const { inputs, handleChange, clearForm, resetForm } = useForm(
    data?.Product || {
      name: '',
      price: '',
    }
  );

  const [updateProduct, updateResult] = useMutation(UPDATE_PRODUCT_MUTATION, {
    variables: {
      id: productId,
      ...inputs,
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <DisplayError error={error} />;

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await updateProduct();
        console.log(result);
        // const res = await createProduct();
        // clearForm();
        // Router.push({
        //   pathname: `/product/${res.data.createProduct.id}`,
        // });
      }}
    >
      <DisplayError error={updateResult.error} />
      <fieldset
        disabled={updateResult.loading}
        aria-busy={updateResult.loading}
      >
        <label htmlFor="image">
          Image
          <input type="file" id="image" name="image" onChange={handleChange} />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            required
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder={0}
            required
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            required
            value={inputs.description}
            placeholder=""
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}
