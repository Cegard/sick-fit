import styled from 'styled-components';
import LogIn from '../components/LogIn';
import RequestReset from '../components/RequestReset';
import SignUp from '../components/SignUp';

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
`;

export default function LoginPage() {
  return (
    <StyledDiv>
      <LogIn />
      <SignUp />
      <RequestReset />
    </StyledDiv>
  );
}
