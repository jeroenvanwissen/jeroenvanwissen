interface BlueskyPost {
  text: string;
  createdAt: string;
  uri: string;
  author: {
    handle: string;
    displayName: string;
  };
}

async function fetchLatestBlueskyPost(): Promise<BlueskyPost | null> {
  try {
    const handle = "jeroenvanwissen.nl";
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=1`,
    );

    if (!response.ok) {
      console.warn(`  Failed to fetch Bluesky feed: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.feed || data.feed.length === 0) {
      console.warn("  No posts found in Bluesky feed");
      return null;
    }

    const post = data.feed[0].post;

    return {
      text: post.record.text || "",
      createdAt: post.record.createdAt || "",
      uri: post.uri || "",
      author: {
        handle: post.author.handle || handle,
        displayName: post.author.displayName || handle,
      },
    };
  } catch (err) {
    console.warn(`  Failed to fetch Bluesky feed: ${err}`);
    return null;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

function getPostUrl(uri: string, handle: string): string {
  // Extract post ID from AT URI (at://did:plc:.../app.bsky.feed.post/...)
  const match = uri.match(/app\.bsky\.feed\.post\/([^/]+)/);
  if (match) {
    return `https://bsky.app/profile/${handle}/post/${match[1]}`;
  }
  return `https://bsky.app/profile/${handle}`;
}

export async function generateBlueskyPostSvg(): Promise<string> {
  const post = await fetchLatestBlueskyPost();

  if (!post) {
    return generateEmptySvg();
  }

  const text = truncateText(post.text, 100);
  const date = formatDate(post.createdAt);
  const postUrl = getPostUrl(post.uri, post.author.handle);

  const bgColor = "#0d1117";
  const borderColor = "#1e1e2e";
  const primaryColor = "#0085ff"; // Bluesky blue
  const textColor = "#c9d1d9";
  const mutedColor = "#8b949e";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="200" viewBox="0 0 420 200">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
      
      .container {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      }
      
      .post-text {
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
  
  <a href="${escapeXml(postUrl)}" target="_top">
    <g class="container">
      <!-- Bluesky Icon -->
      <g class="icon" transform="translate(25, 25)">
        <svg width="20" height="20" viewBox="0 0 568 501" fill="${primaryColor}">
          <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.812 284.655 372.431 284 372.431C283.345 372.431 282.831 375.812 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z"/>
        </svg>
      </g>
      
      <!-- Label -->
      <text class="label" x="55" y="38">Latest Bluesky Post</text>
      
      <!-- Post Text (wrapped) -->
      ${wrapText(text, 25, 70, 370, 13, textColor)
        .map(
          (line, i) =>
            `<text class="post-text" x="25" y="${70 + i * 20}">${escapeXml(line)}</text>`,
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
  
  <text class="message" x="210" y="105" text-anchor="middle">No Bluesky posts available</text>
</svg>`;
}

function wrapText(
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  color: string,
): string[] {
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

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
