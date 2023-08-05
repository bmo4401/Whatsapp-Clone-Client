import { ReduxProvider } from '@/providers/redux-provider';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { Rubik } from 'next/font/google';

const font = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: "What's App",
   description: "What's App",
   icons: [
      {
         url: '/app/icon.png',
      },
   ],
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body className={font.className}>
            <ReduxProvider>{children}</ReduxProvider>
         </body>
      </html>
   );
}
