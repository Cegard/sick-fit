import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import DisplayError from '../components/ErrorMessage';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        image {
          id
          image {
            id
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const StyledUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
`;

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);

  if (loading) return <p>Loading ...</p>;

  if (error) return <DisplayError error={error} />;

  const { allOrders } = data;

  const ItemsLabel = ({ items }) => {
    const length = items.reduce(
      (accounted, item) => accounted + item.quantity,
      0
    );

    return (
      <p>
        {length} Item{length === 1 ? '' : 's'}
      </p>
    );
  };

  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>There are {allOrders.length}</h2>
      <StyledUl>
        {allOrders &&
          allOrders.map((order) => (
            <OrderItemStyles key={order.id}>
              <Link href={`/order?id=${order.id}`}>
                <a>
                  <div className="order-meta">
                    <ItemsLabel items={order.items} />
                    <p>
                      {order.items.length} Product
                      {order.items.length === 1 ? '' : 's'}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => (
                      <img
                        key={item.id}
                        src={item.image?.image?.publicUrlTransformed}
                        alt={item.name}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          ))}
      </StyledUl>
    </div>
  );
}
