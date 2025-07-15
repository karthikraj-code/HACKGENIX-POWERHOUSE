
import { AiSummarizerForm } from "@/components/ai-summarizer-form";

export default function SummarizerPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">AI Resource Summarizer</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
          Paste any article, blog post, or documentation content below to get a concise summary from our AI.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <AiSummarizerForm />
      </div>
    </div>
  );
}
