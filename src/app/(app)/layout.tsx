import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
    </div>
  );
}
