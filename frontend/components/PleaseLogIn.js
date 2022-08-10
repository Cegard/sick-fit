import { useUser } from './User';
import LogIn from './LogIn';

export default function PleaseLogIn({ children }) {
  const me = useUser();

  if (!me) return <LogIn />;

  return children;
}
