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
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] flex flex-col antialiased font-sans">
      <Header />
      
      <main className="flex-grow container max-w-[1200px] mx-auto px-6 py-12 md:py-20 space-y-12">
        <SavingsHero 
          totalMonthlySavings={audit.totalMonthlySavings}
          totalAnnualSavings={audit.totalAnnualSavings}
          isHighSavings={audit.isHighSavings}
          isOptimal={audit.isOptimal}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ToolBreakdown recommendations={audit.recommendations} />
            <ShareBar auditId={audit.id} />
          </div>
          
          <div className="space-y-8">
            <AIsummary summary={audit.aiSummary || "No summary available."} />
            
            <div className="p-8 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] text-center space-y-4">
              <h3 className="text-[#ededed] font-semibold text-lg tracking-tight">Benchmark your stack</h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                See how your team compares to 500+ startups in our network.
              </p>
              <button 
                id="consult-trigger"
                className="w-full h-10 bg-[#ededed] text-[#000000] font-semibold rounded-md hover:bg-[#d1d1d1] transition-colors uppercase tracking-wider text-[12px]"
              >
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
