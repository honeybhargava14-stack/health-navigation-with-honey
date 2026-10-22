"use client";

import { formatResourceDate, RESOURCE_CATEGORIES, type ResourceArticle } from "@/content/resources";
import { FilterChips, ResourceCard, SearchField } from "@health/ui";
import { useMemo, useState } from "react";

const ALL_LABEL = "All";

export function ResourcesLibrary({ articles }: { articles: ResourceArticle[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_LABEL);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = category === ALL_LABEL || article.category === category;
      if (!matchesCategory) return false;
      if (!needle) return true;
      const haystack = [
        article.title,
        article.excerpt,
        article.category,
        ...article.paragraphs,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [articles, category, query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr]">
        <SearchField
          label="Search resources"
          value={query}
          onChange={setQuery}
          placeholder="Search titles and drafts"
        />
        <FilterChips
          legend="Filter by category"
          options={RESOURCE_CATEGORIES}
          value={category}
          onChange={setCategory}
          allLabel={ALL_LABEL}
        />
      </div>
      {visible.length === 0 ? (
        <p className="rounded-3xl border border-border bg-card px-5 py-10 text-center text-muted" role="status">
          No resources match that search. Try another word, or choose All to see the full library.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <ResourceCard
              key={article.slug}
              href={`/resources/${article.slug}`}
              title={article.title}
              excerpt={article.excerpt}
              category={article.category}
              dateLabel={formatResourceDate(article.publishedOn)}
              readingMinutes={article.readingMinutes}
              image={article.image}
              isDraft={article.isDraft}
            />
          ))}
        </div>
      )}
    </div>
  );
}
