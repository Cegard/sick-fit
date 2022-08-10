import Head from 'next/head';
import Link from 'next/dist/client/link';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function Pagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  const pageNumber = parseInt(page);

  if (loading) return <p>Loading...</p>;

  if (error) return <DisplayError />;

  const { count } = data._allProductsMeta;
  const pagesCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles data-testid="pagination">
      <Head>
        <title>
          Sick Fits - Page {page} of {pagesCount}
        </title>
      </Head>
      <Link href={`/products/${pageNumber - 1}`}>
        <a aria-disabled={pageNumber <= 1}>{'<--'} Prev</a>
      </Link>
      <p>
        Page {page} of <span data-testid="pageCount">{pagesCount}</span>
      </p>
      <p>{count} items in total</p>
      <Link href={`/products/${pageNumber + 1}`}>
        <a aria-disabled={pageNumber >= pagesCount}>Next {'-->'}</a>
      </Link>
    </PaginationStyles>
  );
}
