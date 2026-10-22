import { formatResourceDate, getResource, resources } from "@/content/resources";
import { AUTHOR_NAME } from "@/lib/site";
import { buttonClass, EditorialSection, ImageFrame } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export function generateStaticParams() {
  return resources.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getResource(slug);
  if (!article) return { title: "Resource" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-center text-sm text-muted">Loading this draft...</p>}>
      <ResourceArticle params={params} />
    </Suspense>
  );
}

async function ResourceArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getResource(slug);
  if (!article) notFound();

  return (
    <main className="pb-16">
      <EditorialSection className="pt-16">
        <article className="mx-auto max-w-3xl">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            {article.category}
            {article.isDraft ? " · Sample draft" : ""}
          </p>
          <h1 className="font-serif mt-4 text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-muted">
            {AUTHOR_NAME} · {formatResourceDate(article.publishedOn)} · {article.readingMinutes} min
            read
          </p>
          <ImageFrame
            src={article.image.src}
            alt={article.image.alt}
            className="mt-8 aspect-[16/10]"
            sizes="(min-width: 768px) 48rem, 100vw"
            priority
          />
          <div className="mt-10 flex flex-col gap-5 text-lg leading-8 text-muted">
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-10 text-sm leading-6 text-muted">
            This article is a sample draft. It is not medical advice and it does not diagnose or
            treat any condition.
          </p>
          <div className="mt-8">
            <Link href="/resources" className={buttonClass("secondary", "", false)}>
              Back to resources
            </Link>
          </div>
        </article>
      </EditorialSection>
    </main>
  );
}
