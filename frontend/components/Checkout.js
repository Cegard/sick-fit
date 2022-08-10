import { useMutation } from '@apollo/client';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../lib/cartState';
import DisplayError from './ErrorMessage';
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { loading: loadingCheckout, error: errorDuringCheckout }] =
    useMutation(CREATE_ORDER_MUTATION, {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    nProgress.start();
    const { error: errorDuringPayment, paymentMethod } =
      await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

    if (errorDuringPayment) {
      setError(errorDuringPayment);
      setLoading(false);
      nProgress.done();
      return;
    }

    const order = await checkout({ variables: { token: paymentMethod.id } });

    setLoading(false);
    nProgress.done();
    closeCart();
    router.push({
      pathname: '/orders',
      query: { id: order.data.checkout.id },
    });
  }

  return (
    <CheckoutFormStyles onSubmit={(e) => handleSubmit(e)}>
      {error && <DisplayError error={error} />}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}
