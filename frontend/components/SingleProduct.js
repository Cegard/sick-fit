import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import Head from 'next/head';
import DisplayError from './ErrorMessage';

const StyledDiv = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`;

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      image {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;
export default function SingleProduct({ id }) {
  const { data, err, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;

  if (err) return <DisplayError error={err} />;

  const product = data.Product;

  return (
    <StyledDiv data-testid="singleProducct">
      <Head>
        <title>Sick Fits | {product.name} </title>{' '}
      </Head>
      <img
        src={product.image.image.publicUrlTransformed}
        alt={product.image.altText}
      />
      <div className="details">
        <h2> {product.name} </h2>
        <p>{product.description}</p>
      </div>
    </StyledDiv>
  );
}
