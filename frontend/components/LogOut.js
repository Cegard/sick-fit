import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import { CURRENT_USER_QUERY } from './User';

const LOGOUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export default function LogOut() {
  const [logout] = useMutation(LOGOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleLogOut() {
    await logout();
    Router.push({
      pathname: '/',
    });
  }

  return (
    <>
      <button type="button" onClick={() => handleLogOut()}>
        Log out
      </button>
    </>
  );
}
