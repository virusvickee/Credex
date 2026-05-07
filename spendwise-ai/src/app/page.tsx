import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SpendForm } from "@/components/form/SpendForm";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b bg-zinc-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
                Credex SpendWise AI
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Find wasted AI subscriptions before the next renewal.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">
                Enter your AI tools, seats, and usage. SpendWise AI calculates overspend, flags consolidation opportunities, and creates a shareable audit.
              </p>
            </div>
            <SpendForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
