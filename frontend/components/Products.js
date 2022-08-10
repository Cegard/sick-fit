import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Product from './Product';
import { perPage } from '../config';

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($first: Int, $skip: Int = 0) {
    allProducts(first: $first, skip: $skip) {
      id
      name
      price
      description
      image {
        id
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const StyledProductsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function ProductPage({ page }) {
  const pageNumber = parseInt(page);
  const { data, err, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      skip: pageNumber * perPage - perPage,
      first: perPage,
    },
  });

  if (loading) return <p>Loading...</p>;

  if (err) return <p>Error: {err.message}</p>;

  return (
    <StyledProductsList>
      {data &&
        data.allProducts.map((product) => (
          <Product key={product.name} product={product} />
        ))}
    </StyledProductsList>
  );
}
