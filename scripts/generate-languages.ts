import type { GitHubData } from "./fetch-github-data.js";

export function generateLanguagesSvg(data: GitHubData): string {
  const width = 420;
  const height = 200;
  const barMaxWidth = 240;
  const barHeight = 16;
  const barGap = 4;
  const topPadding = 50;
  const leftPadding = 25;
  const labelWidth = 75;
  const maxLangs = 10; // Show top 10 languages total
  const visibleLangs = 7; // Number of languages visible at once (7 visible means 5 will scroll in)

  const langs = data.languages.slice(0, maxLangs);

  const bg = "#0d1117";
  const cardBorder = "#1e1e2e";
  const textColor = "#ffffff";
  const subtitleColor = "#b0b0b0";
  const titleColor = "#ff2bb9";

  const bars = langs
    .map((lang, i) => {
      const barWidth =
        Math.round(
          (lang.percentage / langs[0].percentage) * barMaxWidth * 100,
        ) / 100;
      const y = topPadding + i * (barHeight + barGap);
      const delay = Math.round((0.3 + i * 0.1) * 100) / 100;
      const pctDelay = Math.round((delay + 0.4) * 100) / 100;

      return `
    <!-- ${lang.name} -->
    <g>
      <text x="${leftPadding}" y="${y + 11}" 
            fill="${textColor}" 
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" 
            font-size="11" font-weight="500"
            style="animation: fadeIn 0.4s ease-out ${delay}s both;">
        ${escapeXml(lang.name)}
      </text>

      <!-- Background bar -->
      <rect x="${leftPadding + labelWidth}" y="${y + 2}" 
            width="${barMaxWidth}" height="${barHeight - 4}" 
            rx="3" fill="#161b22"
            style="animation: fadeIn 0.3s ease-out ${delay}s both;" />

      <!-- Filled bar -->
      <rect x="${leftPadding + labelWidth}" y="${y + 2}" 
            width="0" height="${barHeight - 4}" 
            rx="3" fill="${lang.color}"
            style="animation: growBar 0.8s ease-out ${delay}s forwards;">
        <animate attributeName="width" from="0" to="${barWidth}" 
                 dur="0.8s" begin="${delay}s" fill="freeze" />
      </rect>

      <!-- Percentage -->
      <text x="${leftPadding + labelWidth + barMaxWidth + 8}" y="${y + 11}" 
            fill="${subtitleColor}" 
            font-family="'SFMono-Regular', Consolas, monospace" 
            font-size="10"
            style="animation: fadeIn 0.4s ease-out ${pctDelay}s both; opacity: 0;">
        ${lang.percentage.toFixed(1)}%
      </text>
    </g>`;
    })
    .join("\n");

  // Calculate scroll parameters
  const scrollDistance = (maxLangs - visibleLangs) * (barHeight + barGap);
  const scrollDuration = 8; // seconds for scroll down
  const pauseDuration = 2; // seconds at top and bottom
  const totalCycle = scrollDuration * 2 + pauseDuration * 2; // full animation cycle

  // Calculate visible area height - needs to fit ALL languages when scrolling
  // We show visibleLangs at a time, but the clip needs to contain all maxLangs
  const visibleHeight = maxLangs * (barHeight + barGap) + 10;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes growBar {
        from { width: 0; }
      }
      @keyframes scrollLanguages {
        0% { transform: translateY(0); }
        ${((pauseDuration / totalCycle) * 100).toFixed(1)}% { transform: translateY(0); }
        ${(((pauseDuration + scrollDuration) / totalCycle) * 100).toFixed(1)}% { transform: translateY(-${scrollDistance}px); }
        ${(((pauseDuration * 2 + scrollDuration) / totalCycle) * 100).toFixed(1)}% { transform: translateY(-${scrollDistance}px); }
        100% { transform: translateY(0); }
      }
    </style>
    <clipPath id="language-clip">
      <rect x="0" y="${topPadding}" width="${width}" height="${visibleHeight}" />
    </clipPath>
    <clipPath id="card-clip">
      <rect x="0" y="5" width="${width}" height="${height}" rx="10" />
    </clipPath>
    <linearGradient id="title-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg}" stop-opacity="1"/>
      <stop offset="70%" stop-color="${bg}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="${bg}" rx="10" stroke="${cardBorder}" stroke-width="1" />

  <g clip-path="url(#card-clip)">
    <!-- Scrollable content -->
    <g clip-path="url(#language-clip)" style="animation: scrollLanguages ${totalCycle}s ease-in-out infinite;">
      ${bars}
    </g>

    <!-- Title area with gradient background -->
    <rect x="1" y="1" width="${width - 2}" height="${topPadding}" fill="url(#title-gradient)" />
  </g>
  
  <!-- Title (on top of everything) -->
  <text x="${leftPadding}" y="32" 
        fill="${titleColor}" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" 
        font-size="16" font-weight="600"
        style="animation: fadeIn 0.5s ease-out both;">
    Languages
  </text>
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
