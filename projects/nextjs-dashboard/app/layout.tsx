import '@/app/ui/global.css'
import {inter} from '@/app/ui/fonts'
import { Metadata } from 'next'

export const metadata: Metadata = {
    //title: 'Invoices | Acme Dashboard',
    title: {
        template: '%s | Acme Dashboard',
        default: 'Acme Dahboard',
    },
    description: 'The official Next.js Learn Dashboard built with App Router.',
    metadataBase: new URL('https://next-earn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}
      </body>
    </html>
  );
}
