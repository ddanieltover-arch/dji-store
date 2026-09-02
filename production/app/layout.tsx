export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#F8F9FB', color: '#1D1D1F' }}>
        {children}
      </body>
    </html>
  );
}
