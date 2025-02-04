import JotaiProvider from '@/components/common/provider/JotaiProvider';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  );
}
