import JotaiProvider from '@/components/common/provider/JotaiProvider';
import './globals.css';

import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.variable}>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  );
}
