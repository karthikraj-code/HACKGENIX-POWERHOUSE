'use client';

import { domains, type Domain } from '@/lib/domains';
import { DomainCard } from '@/components/domain-card';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Helper to check if a domain or any of its topics match the search
  const filterDomains = (domain: Domain) => {
    const q = search.toLowerCase();
    if (
      domain.name.toLowerCase().includes(q) ||
      domain.description.toLowerCase().includes(q) ||
      domain.slug.toLowerCase().includes(q) ||
      domain.roadmap.some((step: { title: string; description: string }) => step.title.toLowerCase().includes(q) || step.description.toLowerCase().includes(q)) ||
      domain.resources.some((res: { title: string }) => res.title.toLowerCase().includes(q)) ||
      domain.projectIdeas.some((idea: { title: string; description: string }) => idea.title.toLowerCase().includes(q) || idea.description.toLowerCase().includes(q))
    ) {
      return true;
    }
    return false;
  };
  const filteredDomains = search ? domains.filter(filterDomains) : domains;

  // Only show up to 8 suggestions in dropdown
  const dropdownDomains = search ? filteredDomains.slice(0, 8) : [];

  // Handle blur: delay closing so click can register
  const handleBlur = () => {
    setTimeout(() => setDropdownOpen(false), 120);
  };

  // Handle focus: open dropdown if there are matches
  const handleFocus = () => {
    if (dropdownDomains.length > 0 && search.length > 0) {
      setDropdownOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">Explore Tech Domains</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
          Discover a world of technology! Browse domains like Web Development, Machine Learning, Cloud, UI/UX, and more. Click any card to dive into roadmaps, resources, project ideas, and essential tools for each field.
        </p>
        <div className="mt-8 max-w-md mx-auto relative">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setDropdownOpen(e.target.value.length > 0 && dropdownDomains.length > 0);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search domains or topics..."
            className="w-full px-4 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            autoComplete="off"
          />
          {dropdownOpen && (
            <ul
              ref={dropdownRef}
              className="absolute left-0 right-0 z-10 bg-popover border border-muted rounded-md mt-1 shadow-lg max-h-72 overflow-auto divide-y divide-muted-foreground/10"
            >
              {dropdownDomains.map(domain => (
                <li
                  key={domain.slug}
                  className="px-4 py-2 cursor-pointer hover:bg-muted text-left"
                  onMouseDown={e => {
                    e.preventDefault();
                    setDropdownOpen(false);
                    setSearch('');
                    router.push(`/domain/${domain.slug}`);
                  }}
                >
                  <span className="font-semibold">{domain.name}</span>
                  <span className="block text-sm text-muted-foreground">{domain.description}</span>
                </li>
              ))}
              {dropdownDomains.length === 0 && (
                <li className="px-4 py-2 text-muted-foreground">No domains found.</li>
              )}
            </ul>
          )}
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDomains.length > 0 ? (
          filteredDomains.map((domain) => (
            <DomainCard key={domain.slug} domain={domain} />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground text-lg">No domains or topics found.</div>
        )}
      </div>
    </div>
  );
}
