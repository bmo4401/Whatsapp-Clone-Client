import Main from './components/Main';
import { cookies } from 'next/headers';
const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY';
export default function Home() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('ACCESS_TOKEN_KEY');
  return (
    <>
      <Main />
    </>
  );
}
