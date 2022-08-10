import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import DisplayError from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import formatMoney from '../lib/formatMoney';

const ORDER_QUERY = gql`
  query ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
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

export default function Order({ id }) {
  const { data, loading, error } = useQuery(ORDER_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <DisplayError error={error} />;

  const { order } = data;

  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {order.id}</title>
      </Head>
      <div>
        <p>
          <span>Order Id: </span>
          <span>{id}</span>
        </p>
        <p>
          <span>Charge: </span>
          <span>{order.charge}</span>
        </p>
        <p>
          <span>Total: </span>
          <span>{formatMoney(order.total)}</span>
        </p>
      </div>
      <div className="items">
        {order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.image.image.publicUrlTransformed} alt={item.name} />
            <h2>{item.name}</h2>
            <p>Quantity: {item.quantity}</p>
            <p>Each: {formatMoney(item.price)}</p>
            <p>Sub Total: {formatMoney(item.quantity * item.price)}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}
