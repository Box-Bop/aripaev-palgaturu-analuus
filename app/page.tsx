import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Äripaev Palgaruru Analüüs
        </h1>
        <p className="text-lg mb-8">
          subtext
        </p>
        <Button size="lg">
          Get Started
        </Button>
      </main>
    </div>
  );
}
