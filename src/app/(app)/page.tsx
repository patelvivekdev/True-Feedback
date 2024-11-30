import MessageCarousel from '@/components/CarouselContent';

export default async function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Main content */}
      <main className="flex flex-grow flex-col items-center justify-center bg-gray-800 px-4 py-12 text-white md:px-24">
        <section className="mb-8 text-center md:mb-12">
          <h1 className="text-3xl font-bold md:text-5xl">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 text-base md:mt-4 md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
        <MessageCarousel />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-center text-white md:p-6">
        © {year} True Feedback | Made with NextJs | AuthJs
      </footer>
    </>
  );
}
