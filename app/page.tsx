import { Button } from "@/components/ui/button";
import { JobCombobox } from "@/app/components/CareerSearchForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Äripaev Palgaturu Analüüs
        </h1>
        <p className="text-lg mb-8">
          Leia oma ametile sobiv palk
        </p>
        <JobCombobox />
      </main>
    </div>
  );
}
