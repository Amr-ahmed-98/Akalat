import { AppLayout } from "@/src/layouts/app-layout";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <AppLayout locale={locale}>
      <div className="flex items-center justify-center px-4 py-24">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Welcome to Akalat 🍽️
        </h1>
      </div>
    </AppLayout>
  );
}
