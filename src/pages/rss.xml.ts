import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // Posts locales — excluir drafts
  const localPosts = await getCollection('blog', ({ data }) => !data.draft);

  // Posts de Dev.to — fetch en build time, fallback silencioso
  let devtoPosts: any[] = [];
  try {
    const res = await fetch('https://dev.to/api/articles?username=altaskur&per_page=30');
    if (res.ok) devtoPosts = await res.json();
  } catch {
    console.warn('[RSS] Dev.to fetch failed — solo posts locales en el feed');
  }

  const localItems = localPosts.map(post => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.publishDate,
    link: `/blog/${post.id.replace(/\.(md|mdx)$/, '')}/`,
  }));

  const devtoItems = devtoPosts.map((post: any) => ({
    title: post.title,
    description: post.description || '',
    pubDate: new Date(post.published_at),
    link: post.url,
  }));

  const items = [...localItems, ...devtoItems]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'altaskur — blog',
    description: 'Frontend engineer. Angular, accesibilidad, tooling, homelab e IA local.',
    site: context.site!,
    items,
    customData: `<language>es-ES</language>`,
  });
}
