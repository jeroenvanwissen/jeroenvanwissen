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

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  // Approximate character width (adjust based on font)
  const charWidth = fontSize * 0.5;
  const maxChars = Math.floor(maxWidth / charWidth);

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxChars) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Limit to 5 lines to fit in the card
  return lines.slice(0, 5);
}

export async function generateLatestPostSvg(): Promise<string> {
  const post = await fetchLatestPost();

  if (!post) {
    return generateEmptySvg();
  }

  const title = truncateText(post.title, 45);
  const description = truncateText(post.description, 100);
  const date = formatDate(post.pubDate);

  const bgColor = "#0d1117";
  const borderColor = "#1e1e2e";
  const primaryColor = "#ff2bb9";
  const textColor = "#c9d1d9";
  const mutedColor = "#8b949e";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="200" viewBox="0 0 420 200">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
      
      .container {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      }
      
      .title {
        font-size: 15px;
        font-weight: 700;
        fill: ${primaryColor};
        animation: fadeIn 0.8s ease-in;
      }
      
      .description {
        font-size: 13px;
        font-weight: 400;
        fill: ${textColor};
        line-height: 1.4;
        animation: fadeIn 0.8s ease-in 0.2s;
        animation-fill-mode: both;
      }
      
      .date {
        font-size: 11px;
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
    </style>
  </defs>
  
  <rect width="420" height="200" fill="${bgColor}" rx="10" stroke="${borderColor}" stroke-width="1"/>
  
  <a href="${escapeXml(post.link)}" target="_top">
    <g class="container">
      <!-- Icon - Logo -->
      <g class="icon" transform="translate(21, 21)">
        <svg viewBox="0 0 80 80" width="26" height="26" fill="none">
          <defs>
            <linearGradient id="paint0_linear_latest" x1="59.4768" y1="18.88" x2="45.0753" y2="73.8957" gradientUnits="userSpaceOnUse">
              <stop offset="0.185" stop-color="${primaryColor}" stop-opacity="0"/>
              <stop offset="1" stop-color="${primaryColor}"/>
            </linearGradient>
            <linearGradient id="paint1_linear_latest" x1="59.4768" y1="18.88" x2="45.0753" y2="73.8957" gradientUnits="userSpaceOnUse">
              <stop offset="0.185" stop-color="${primaryColor}" stop-opacity="0"/>
              <stop offset="1" stop-color="${primaryColor}"/>
            </linearGradient>
          </defs>
          <path d="M18.4326 18.88C16.1285 18.88 14.5795 21.2417 15.4976 23.355L31.0782 59.2206C31.586 60.3895 32.7389 61.1456 34.0132 61.1456H38.9844C41.2896 61.1456 42.8386 58.7819 41.9184 56.6683L26.3046 20.8027C25.7963 19.6351 24.6441 18.88 23.3706 18.88H18.4326Z" fill="url(#paint0_linear_latest)" fill-opacity="0.5"/>
          <path d="M41.4405 18.88C39.1364 18.88 37.5874 21.2417 38.5055 23.355L54.0861 59.2206C54.5939 60.3895 55.7468 61.1456 57.0211 61.1456H61.9923C64.2975 61.1456 65.8465 58.7819 64.9263 56.6683L49.3125 20.8027C48.8042 19.6351 47.652 18.88 46.3785 18.88H41.4405Z" fill="url(#paint1_linear_latest)" fill-opacity="0.5"/>
          <path d="M68.6909 18.88C70.676 18.88 72.1822 20.6688 71.8441 22.625L65.6455 58.4906C65.3804 60.0249 64.0493 61.1456 62.4923 61.1456H57.0375C55.0512 61.1456 53.5447 59.3548 53.8847 57.3978L60.1165 21.5322C60.3828 19.9992 61.7133 18.88 63.2692 18.88H68.6909Z" fill="${primaryColor}"/>
          <path d="M45.6509 18.88C47.636 18.88 49.1422 20.6688 48.8041 22.625L42.6055 58.4906C42.3404 60.0249 41.0093 61.1456 39.4523 61.1456H33.9975C32.0112 61.1456 30.5047 59.3548 30.8447 57.3978L37.0765 21.5322C37.3428 19.9992 38.6733 18.88 40.2292 18.88H45.6509Z" fill="${primaryColor}"/>
          <path d="M14.0378 21.5322C14.3041 19.9992 15.6346 18.88 17.1905 18.88H22.619C24.6041 18.88 26.1103 20.6688 25.7722 22.625L24.7214 28.705C24.4563 30.2393 23.1252 31.36 21.5682 31.36H16.1341C14.1478 31.36 12.6413 29.5692 12.9813 27.6122L14.0378 21.5322Z" fill="${primaryColor}"/>
          <path d="M13.2429 41.6C11.6869 41.6 10.3565 42.7192 10.0901 44.2522L9.08485 50.0378C8.74481 51.9948 10.2513 53.7856 12.2376 53.7856H12.6327C13.4598 53.7856 14.0874 54.531 13.9465 55.3461C13.2468 57.8913 11.7785 59.3685 9.73427 60.438C8.6381 61.0114 8.02922 62.2722 8.45828 63.4325L9.01319 64.9332C9.44224 66.0935 10.7382 66.7012 11.8551 66.1694C15.2196 64.5672 18.5129 61.9037 19.8591 56.7713L19.892 56.6457L20.8377 51.1747C20.8405 51.16 20.8431 51.1453 20.8456 51.1306L21.8456 45.345C22.1836 43.3888 20.6775 41.6 18.6923 41.6H13.2429Z" fill="${primaryColor}"/>
        </svg>
      </g>
      
      <!-- Label -->
      <text class="label" x="55" y="38">Latest Blog Post</text>
      
      <!-- Title -->
      <text class="title" x="25" y="65">${escapeXml(title)}</text>
      
      <!-- Description (wrapped) -->
      ${wrapText(description, 370, 13)
        .map(
          (line, i) =>
            `<text class="description" x="25" y="${85 + i * 20}">${escapeXml(line)}</text>`,
        )
        .join("\n      ")}
      
      <!-- Date -->
      <text class="date" x="25" y="175">${date}</text>
    </g>
  </a>
</svg>`;
}

function generateEmptySvg(): string {
  const bgColor = "#0d1117";
  const borderColor = "#1e1e2e";
  const mutedColor = "#8b949e";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="200" viewBox="0 0 420 200">
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
  
  <rect width="420" height="200" fill="${bgColor}" rx="10" stroke="${borderColor}" stroke-width="1"/>
  
  <text class="message" x="210" y="105" text-anchor="middle">No blog posts available</text>
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
