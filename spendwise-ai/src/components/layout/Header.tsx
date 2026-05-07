import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-zinc-950">
          SpendWise AI
        </Link>
        <span className="text-sm text-zinc-500">by Credex</span>
      </div>
    </header>
  );
}
