'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CodeXml, Route, Sparkles, Book, Languages, Database, Wrench, Menu, User, LogOut, LayoutDashboard, Brain, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Session } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const navLinks = [
  { href: '/career-paths', label: 'Career Paths', icon: Route },
  { href: '/project-generator', label: 'Project Generator', icon: Sparkles },
  { href: '/summarizer', label: 'AI Summarizer', icon: Book },
  { href: '/flashcardandmindmaps', label: 'Flashcards & Mindmaps', icon: Brain },
  { href: '/quizzes', label: 'Quizzes', icon: HelpCircle },
  { href: '/languages', label: 'Languages', icon: Languages },
  { href: '/databases', label: 'Databases', icon: Database },
  { href: '/tools', label: 'Tools', icon: Wrench },
];

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      
      // Call the dedicated sign-out route
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Sign out request failed');
      }
      
      // Clear any local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Force a hard redirect to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out failed:', error);
      // Fallback: clear storage and force redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
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
            <Link href="/quizzes" className="flex items-center gap-2"><HelpCircle/> Quizzes</Link>
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
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                      {session.user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {session.user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2" disabled={isSigningOut}>
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? 'Signing out...' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            null
          )}
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
              <div className="mt-8">
                <nav className="flex flex-col gap-4">
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
                {session ? (
                  <>
                    <div className="flex items-center gap-3 p-3 border-b">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                          {session.user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm text-muted-foreground">
                        {session.user.email}
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className={cn(
                          "flex items-center gap-3 rounded-lg p-3 text-lg font-medium text-muted-foreground transition-all hover:text-primary",
                          pathname === "/profile" && "bg-muted text-primary"
                        )}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" onClick={handleSignOut} className="text-red-600 hover:text-red-600" disabled={isSigningOut}>
                        <LogOut className="h-5 w-5 mr-2" />
                        {isSigningOut ? 'Signing out...' : 'Sign Out'}
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Button asChild variant="ghost">
                      <Link href="/auth">Sign In</Link>
                    </Button>
                  </SheetClose>
                )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}