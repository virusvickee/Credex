import React from 'react';
import { Header } from '@/components/layout/Header';
import { SpendForm } from '@/components/form/SpendForm';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: "SpendWise AI — Free AI Spend Audit for Startups",
  description: "Find out if you're overpaying for Cursor, Claude, ChatGPT, and other AI tools. Get a free audit in 60 seconds.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] flex flex-col antialiased">
      <Header />
      <main className="flex-grow">
        <SpendForm />
      </main>
      <Footer />
    </div>
  );
}
