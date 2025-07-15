
import { CareerAdvisor } from '@/components/career-advisor';

export default function CareerPathsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">AI Career Advisor</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
          Unsure where to start? Answer a few questions and let our AI recommend the perfect tech career path for you, complete with a skill analysis and personalized roadmap.
        </p>
      </header>
      <div className="max-w-5xl mx-auto">
        <CareerAdvisor />
      </div>
    </div>
  );
}
