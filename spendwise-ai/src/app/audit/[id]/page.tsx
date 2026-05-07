import { AuditResults } from "@/components/results/AuditResults";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { LegacyAuditResult } from "@/types";

type PageProps = {
  params: { id: string };
};

export default async function AuditPage({ params }: PageProps) {
  const supabase = getSupabaseAdmin();
  let audit: LegacyAuditResult | null = null;

  if (supabase) {
    const { data } = await supabase.from("audits").select("payload").eq("id", params.id).single();
    audit = data?.payload as LegacyAuditResult | null;
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <AuditResults audit={audit} auditId={params.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
