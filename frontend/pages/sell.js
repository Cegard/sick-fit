import CreateProduct from '../components/CreateProduct';
import PleaseLogIn from '../components/PleaseLogIn';

export default function SellPage() {
  return (
    <PleaseLogIn>
      <CreateProduct />
    </PleaseLogIn>
  );
}
