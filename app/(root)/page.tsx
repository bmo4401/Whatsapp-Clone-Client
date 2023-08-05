import Main from './components/Main';
import { cookies } from 'next/headers';

export default function Home() {
   const cookieStore = cookies();
   const theme = cookieStore.get('REFRESH_TOKEN_KEY');
   return (
      <>
         <Main />
      </>
   );
}
