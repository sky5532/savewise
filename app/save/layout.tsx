import { SaveProvider } from "./SaveContext";

export default function SaveLayout({ children }: { children: React.ReactNode }) {
  return (
    <SaveProvider>
      <main className="mx-auto min-h-screen max-w-[480px] px-6 py-8">
        {children}
      </main>
    </SaveProvider>
  );
}