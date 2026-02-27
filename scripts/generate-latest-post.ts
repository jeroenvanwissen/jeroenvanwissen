interface BlogPost {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

async function fetchLatestPost(): Promise<BlogPost | null> {
  try {
    const response = await fetch("https://jeroenvanwissen.nl/feed.xml");
    if (!response.ok) {
      console.warn(`  Failed to fetch blog feed: ${response.status}`);
      return null;
    }

    const xml = await response.text();

    // Parse RSS feed to get the first item
    const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
    if (!itemMatch) {
      console.warn("  No items found in feed");
      return null;
    }

    const item = itemMatch[1];

    const title = item.match(/<title>(.*?)<\/title>/)?.[1] ?? "Untitled Post";
    const link = item.match(/<link>(.*?)<\/link>/)?.[1] ?? "";
    const description =
      item.match(/<description>(.*?)<\/description>/)?.[1] ?? "";
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";

    return {
      title: decodeHtmlEntities(title),
      link,
      description: decodeHtmlEntities(description),
      pubDate,
    };
  } catch (err) {
    console.warn(`  Failed to fetch blog feed: ${err}`);
    return null;
  }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&hellip;/g, "…");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

export async function generateLatestPostSvg(): Promise<string> {
  const post = await fetchLatestPost();

  if (!post) {
    return generateEmptySvg();
  }

  const title = truncateText(post.title, 60);
  const description = truncateText(post.description, 80);
  const date = formatDate(post.pubDate);

  const bgColor = "#0d1117";
  const borderColor = "#30363d";
  const primaryColor = "#ff2bb9";
  const textColor = "#c9d1d9";
  const mutedColor = "#8b949e";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="120" viewBox="0 0 840 120">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
      
      .container {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      }
      
      .title {
        font-size: 18px;
        font-weight: 700;
        fill: ${primaryColor};
        animation: fadeIn 0.8s ease-in;
      }
      
      .description {
        font-size: 14px;
        font-weight: 400;
        fill: ${textColor};
        animation: fadeIn 0.8s ease-in 0.2s;
        animation-fill-mode: both;
      }
      
      .date {
        font-size: 12px;
        font-weight: 400;
        fill: ${mutedColor};
        animation: fadeIn 0.8s ease-in 0.4s;
        animation-fill-mode: both;
      }
      
      .label {
        font-size: 12px;
        font-weight: 600;
        fill: ${primaryColor};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        animation: slideInLeft 0.6s ease-out;
      }
      
      .icon {
        fill: ${primaryColor};
        animation: pulse 2s ease-in-out infinite;
      }
      
      .border {
        fill: none;
        stroke: ${borderColor};
        stroke-width: 1;
        rx: 6;
        animation: drawBorder 1s ease-out;
      }
      
      .clickable-area {
        cursor: pointer;
        transition: opacity 0.2s ease;
      }
      
      .clickable-area:hover .title {
        fill: ${textColor};
      }
      
      .clickable-area:hover .border {
        stroke: ${primaryColor};
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.6;
        }
      }
      
      @keyframes drawBorder {
        from {
          stroke-dasharray: 1740;
          stroke-dashoffset: 1740;
        }
        to {
          stroke-dasharray: 1740;
          stroke-dashoffset: 0;
        }
      }
    </style>
  </defs>
  
  <rect width="840" height="120" fill="${bgColor}" rx="6"/>
  
  <a href="${escapeXml(post.link)}" target="_top" class="clickable-area">
    <rect class="border" width="838" height="118" x="1" y="1"/>
    
    <g class="container">
      <!-- Icon -->
      <g class="icon">
        <circle cx="30" cy="30" r="6"/>
        <path d="M 30 40 L 30 70 M 20 60 L 30 70 L 40 60" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      
      <!-- Label -->
      <text class="label" x="50" y="28">Latest Blog Post</text>
      
      <!-- Title -->
      <text class="title" x="50" y="55">${escapeXml(title)}</text>
      
      <!-- Description -->
      <text class="description" x="50" y="75">${escapeXml(description)}</text>
      
      <!-- Date -->
      <text class="date" x="50" y="95">${date}</text>
    </g>
  </a>
</svg>`;
}

function generateEmptySvg(): string {
  const bgColor = "#0d1117";
  const borderColor = "#30363d";
  const mutedColor = "#8b949e";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="120" viewBox="0 0 840 120">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;display=swap');
      
      .message {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: 400;
        fill: ${mutedColor};
      }
    </style>
  </defs>
  
  <rect width="840" height="120" fill="${bgColor}" rx="6"/>
  <rect width="838" height="118" x="1" y="1" fill="none" stroke="${borderColor}" stroke-width="1" rx="6"/>
  
  <text class="message" x="420" y="65" text-anchor="middle">No blog posts available</text>
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
