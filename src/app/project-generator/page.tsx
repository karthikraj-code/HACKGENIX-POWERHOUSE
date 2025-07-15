
import { ProjectIdeaForm } from "@/components/project-idea-form";

export default function ProjectGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">AI Project Idea Generator</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
          Stuck on what to build? Tell our AI about your skills and interests, and get a custom project idea to build your portfolio.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <ProjectIdeaForm />
      </div>
    </div>
  );
}
