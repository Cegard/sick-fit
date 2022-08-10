import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';
import LogOut from './LogOut';
import { useCart } from '../lib/cartState';
import CartCount from './CartCount';

export default function Nav() {
  const user = useUser();
  const { openCart } = useCart();

  return (
    <NavStyles>
      <Link href="/products"> Products </Link>
      {user && (
        <>
          <Link href="/orders"> Orders </Link>
          <Link href="/sell"> Sell </Link>
          <Link href="/account"> Account </Link>
          <LogOut />
          <button type="button" onClick={openCart}>
            My Cart
            <CartCount
              count={user.cart.reduce(
                (accounted, currItem) => accounted + currItem.quantity,
                0
              )}
            />
          </button>
        </>
      )}
      {!user && <Link href="/login"> Log in </Link>}
    </NavStyles>
  );
}
