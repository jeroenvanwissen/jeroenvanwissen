const FEED_URL = "https://jeroenvanwissen.github.io/feed.xml";
const SITE_URL = "https://jeroenvanwissen.github.io";

interface Post {
  title: string;
  date: string;
  url: string;
  summary: string;
}

interface SocialLink {
  alt: string;
  url: string;
  label?: string;
  logo?: string;
  logoColor?: string;
  color: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    alt: "Bluesky",
    url: "https://bsky.app/profile/jeroenvanwissen.nl",
    label: "Bluesky",
    logo: "bluesky",
    logoColor: "white",
    color: "0085ff",
  },
  {
    alt: "Mastodon",
    url: "https://mastodon.social/@jeroenvanwissen",
    label: "Mastodon",
    logo: "mastodon",
    logoColor: "white",
    color: "6364ff",
  },
  {
    alt: "X",
    url: "https://twitter.com/jvwissen",
    logo: "x",
    logoColor: "white",
    color: "000000",
  },
  {
    alt: "LinkedIn",
    url: "https://www.linkedin.com/in/jeroenvanwissen/",
    label: "LinkedIn",
    logo: "linkedin",
    logoColor: "white",
    color: "0a66c2",
  },
  {
    alt: "Jeroen van Wissen",
    url: "https://jeroenvanwissen.nl",
    label: "jeroenvanwissen.nl",
    logoColor: "white",
    color: "ff2bb9",
  },
  {
    alt: "31F-Fotografie",
    url: "https://31f-fotografie.nl",
    label: "31f--fotografie.nl",
    logoColor: "white",
    color: "333",
  },
];

function buildBadgeUrl(link: SocialLink): string {
  const parts: string[] = [];
  parts.push(`style=for-the-badge`);
  if (link.logo) parts.push(`logo=${link.logo}`);
  if (link.logoColor) parts.push(`logoColor=${link.logoColor}`);
  const label = link.label ?? "";
  return `https://img.shields.io/badge/${label}-${link.color}?${parts.join("&")}`;
}

async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      console.warn(`  Failed to fetch feed: ${response.status}`);
      return [];
    }

    const xml = await response.text();

    // Parse Atom feed entries with simple regex (no XML parser dependency needed)
    const entries: Post[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match: RegExpExecArray | null;

    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];

      const title = entry.match(/<title type="html">(.*?)<\/title>/)?.[1] ?? "";
      const link = entry.match(/<link href="(.*?)" rel="alternate"/)?.[1] ?? "";
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? "";
      const summary =
        entry.match(
          /<summary type="html"><!\[CDATA\[(.*?)\]\]><\/summary>/,
        )?.[1] ?? "";

      if (title && link) {
        entries.push({
          title: decodeHtmlEntities(title),
          url: link,
          date: published,
          summary: decodeHtmlEntities(summary),
        });
      }
    }

    // Already sorted newest-first in feed, but ensure it
    entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return entries;
  } catch (err) {
    console.warn(`  Failed to fetch feed: ${err}`);
    return [];
  }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&hellip;/g, "\u2026");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, " ");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export async function generateReadme(): Promise<string> {
  const posts = await fetchPosts();
  console.log(`  Found ${posts.length} posts from ${FEED_URL}`);

  const postsSection =
    posts.length > 0
      ? `## Recent [Nano Posts](https://github.com/jeroenvanwissen/nanopost)

${posts
  .slice(0, 5)
  .map((post) => `- \`${formatDate(post.date)}\` [${post.title}](${post.url})`)
  .join("\n")}

${posts.length > 5 ? `\n[View all posts...](${SITE_URL})\n` : ""}`
      : "";

  const socialSection = SOCIAL_LINKS.map((link) => {
    const badgeUrl = buildBadgeUrl(link);
    return `<a href="${link.url}"><img src="${badgeUrl}" alt="${link.alt}" /></a>`;
  }).join("\n  ");

  return `<p align="center">
  <img src="generated/header.svg" alt="Jeroen van Wissen" width="840" />
</p>

<br />

<p align="center">
  <em>
    Full-stack JavaScript/TypeScript developer from the Netherlands with 27+ years in tech.<br />
    Building with React, Vue, Node.js and NestJS.<br />
    Brewing beer, shooting photos, and figuring out life along the way.
  </em>
</p>

<br />

<p align="center">
  <img src="generated/latest-post.svg" alt="Latest Blog Post" width="840" />
</p>

<br />

<p align="center">
  <img src="generated/languages.svg" alt="Top Languages" width="420" />
  <img src="generated/stats.svg" alt="GitHub Stats" width="420" />
</p>

<br />

${postsSection}
${postsSection ? "\n<br />\n\n" : ""}---

<p align="center">
  ${socialSection}
</p>

<p align="center">
  <sub>This profile is generated with ❤️ by a <a href=".github/workflows/generate-readme.yml">GitHub Action</a></sub>
</p>
`;
}
