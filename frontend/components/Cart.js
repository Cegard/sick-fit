import styled from 'styled-components';
import { useUser } from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import formatMoney from '../lib/formatMoney';
import { useCart } from '../lib/cartState';
import CloseButton from './styles/CloseButton';
import RemoveFromCart from './RemoveFromCart';
import Checkout from './Checkout';

const StyledLi = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lighGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`;

function CartItem({ cartItem }) {
  const { product } = cartItem;

  if (!product) return <></>;

  return (
    <StyledLi>
      <img
        width="100"
        src={product.image.image.publicUrlTransformed}
        alt={product.name}
      />
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * cartItem.quantity)}-
          <em>
            {cartItem.quantity} &times; {formatMoney(product.price)} each
          </em>{' '}
        </p>
      </div>
      <RemoveFromCart productId={cartItem.id} />
    </StyledLi>
  );
}

export default function Cart() {
  const user = useUser();
  const { cartOpen, closeCart } = useCart();

  if (!user || !user?.cart) return <></>;

  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{user.name}'s cart</Supreme>
        <CloseButton onClick={closeCart}>X</CloseButton>
      </header>
      <ul>
        {user.cart.map((item) => (
          <CartItem key={item.id} cartItem={item} />
        ))}
      </ul>
      <footer>
        <div>
          {formatMoney(
            user.cart.reduce((accounted, currItem) => {
              if (!currItem?.product) return accounted;

              return accounted + currItem.product.price * currItem.quantity;
            }, 0)
          )}
        </div>
        <div>
          <Checkout />
        </div>
      </footer>
    </CartStyles>
  );
}
