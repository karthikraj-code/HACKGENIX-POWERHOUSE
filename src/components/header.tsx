'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CodeXml, Route, Sparkles, Book, Languages, Database, Wrench, Menu, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/career-paths', label: 'Career Paths', icon: Route },
  { href: '/project-generator', label: 'Project Generator', icon: Sparkles },
  { href: '/summarizer', label: 'AI Summarizer', icon: Book },
  { href: '/flashcardandmindmaps', label: 'Flashcards & Mindmaps', icon: Brain },
  { href: '/languages', label: 'Languages', icon: Languages },
  { href: '/databases', label: 'Databases', icon: Database },
  { href: '/tools', label: 'Tools', icon: Wrench },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <CodeXml className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline">TechNav</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button asChild variant="ghost">
            <Link href="/career-paths" className="flex items-center gap-2"><Route/> Career Paths</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/project-generator" className="flex items-center gap-2"><Sparkles/> Project Generator</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/summarizer" className="flex items-center gap-2"><Book/> AI Summarizer</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/flashcardandmindmaps" className="flex items-center gap-2"><Brain/> Flashcards & Mindmaps</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/languages">Programming Languages</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/databases">Databases</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/tools">Tools Explorer</Link>
          </Button>
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg p-3 text-lg font-medium text-muted-foreground transition-all hover:text-primary",
                          pathname === link.href && "bg-muted text-primary"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
