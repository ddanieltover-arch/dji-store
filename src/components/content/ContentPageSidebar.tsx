import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ContentNavGroup, ContentNavSection } from '../../data/storeContentNavigation';
import { hrefFromStoreLink } from '../../lib/routing';

interface ContentPageSidebarProps {
  section: ContentNavSection;
  activeSlug: string;
  onNavigate: (slug: string) => void;
}

function groupContainsSlug(group: ContentNavGroup, slug: string): boolean {
  return group.items.some((item) => item.slug === slug);
}

export const ContentPageSidebar: React.FC<ContentPageSidebarProps> = ({
  section,
  activeSlug,
  onNavigate
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of section.groups) {
      initial[group.id] = groupContainsSlug(group, activeSlug) || group.items.length > 1;
    }
    return initial;
  });

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      for (const group of section.groups) {
        if (groupContainsSlug(group, activeSlug)) {
          next[group.id] = true;
        }
      }
      return next;
    });
  }, [activeSlug, section.groups]);

  const toggleGroup = (groupId: string) => {
    setExpanded((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleNavigate = (slug: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(slug);
  };

  return (
    <nav aria-label={section.title} className="w-full">
      <div className="bg-[#F5F5F7] rounded-none lg:min-h-[520px]">
        {section.groups.map((group) => {
          const isMulti = group.items.length > 1;
          const isOpen = expanded[group.id] ?? isMulti;
          const isSingleActive = !isMulti && group.items[0]?.slug === activeSlug;

          if (!isMulti) {
            const item = group.items[0];
            if (!item) return null;
            return (
              <a
                key={group.id}
                href={hrefFromStoreLink({ kind: 'content', slug: item.slug })}
                onClick={(event) => handleNavigate(item.slug, event)}
                className={`relative block w-full text-left px-5 py-3.5 text-sm transition-colors border-b border-gray-200/80 cursor-pointer ${
                  isSingleActive
                    ? 'bg-[#EBEBED] text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-[#EBEBED]/60 hover:text-gray-900'
                }`}
              >
                {group.label}
                {isSingleActive && (
                  <span className="absolute right-0 top-2 bottom-2 w-[3px] bg-gray-800 rounded-l" />
                )}
              </a>
            );
          }

          return (
            <div key={group.id} className="border-b border-gray-200/80">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-gray-800 hover:bg-[#EBEBED]/50 transition-colors"
              >
                <span className="font-normal">{group.label}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                )}
              </button>

              {isOpen && (
                <ul className="pb-1">
                  {group.items.map((item) => {
                    const isActive = item.slug === activeSlug;
                    return (
                      <li key={item.slug}>
                        <a
                          href={hrefFromStoreLink({ kind: 'content', slug: item.slug })}
                          onClick={(event) => handleNavigate(item.slug, event)}
                          className={`relative block w-full text-left pl-5 pr-4 py-2.5 text-sm transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#EBEBED] text-gray-900 font-medium'
                              : 'text-gray-600 hover:bg-[#EBEBED]/60 hover:text-gray-900'
                          }`}
                        >
                          {item.label ?? item.slug}
                          {isActive && (
                            <span className="absolute right-0 top-1.5 bottom-1.5 w-[3px] bg-gray-800 rounded-l" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
