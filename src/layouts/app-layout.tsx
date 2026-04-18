import Navbar from "@/src/widgets/navbar/Navbar";
import Footer from "@/src/widgets/footer/Footer";

type AppLayoutProps = {
  children: React.ReactNode;
  locale: string;
};

export function AppLayout({ children, locale }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
