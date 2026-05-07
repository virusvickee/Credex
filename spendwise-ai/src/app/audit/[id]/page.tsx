import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SavingsHero } from '@/components/results/SavingsHero';
import { ToolBreakdown } from '@/components/results/ToolBreakdown';
import { AIsummary } from '@/components/results/AIsummary';
import { ShareBar } from '@/components/results/ShareBar';
import { AuditResult } from '@/types';

async function getAuditData(id: string): Promise<AuditResult | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/audit/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const audit = await getAuditData(params.id);
  if (!audit) return { title: 'Audit Not Found' };

  const savings = audit.totalMonthlySavings;
  const topRec = audit.recommendations.find(r => r.recommendedAction !== 'keep')?.reasoning || "Optimize your AI stack";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: `Your AI Spend Audit — $${savings}/mo in savings`,
    description: (audit.aiSummary || "Your AI tool spend audit results").slice(0, 150) + '...',
    openGraph: {
      title: `I found $${savings}/mo in AI tool savings`,
      description: topRec,
      images: [`${baseUrl}/api/og?savings=${savings}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `I found $${savings}/mo in AI tool savings`,
      description: topRec,
    }
  };
}

export default async function AuditPage({ params }: { params: { id: string } }) {
  const audit = await getAuditData(params.id);

  if (!audit) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-12 md:py-20 space-y-12">
        <SavingsHero 
          totalMonthlySavings={audit.totalMonthlySavings}
          totalAnnualSavings={audit.totalAnnualSavings}
          isHighSavings={audit.isHighSavings}
          isOptimal={audit.isOptimal}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ToolBreakdown recommendations={audit.recommendations} />
            <ShareBar auditId={audit.id} totalMonthlySavings={audit.totalMonthlySavings} />
          </div>
          
          <div className="space-y-8">
            <AIsummary summary={audit.aiSummary || "No summary available."} />
            
            <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
              <h3 className="text-white font-bold text-lg">Benchmark your stack</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                See how your team compares to 500+ startups in our network.
              </p>
              <button className="w-full h-12 bg-white text-slate-950 font-black rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs">
                View Benchmarks
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
