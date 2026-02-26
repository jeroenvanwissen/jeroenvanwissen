import type { GitHubData } from "./fetch-github-data.js";

export function generateLanguagesSvg(data: GitHubData): string {
  const width = 420;
  const barMaxWidth = 230;
  const barHeight = 22;
  const barGap = 8;
  const topPadding = 50;
  const leftPadding = 25;
  const labelWidth = 85;
  const maxLangs = 8;

  const langs = data.languages.slice(0, maxLangs);
  const height = topPadding + langs.length * (barHeight + barGap) + 30;

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
      <text x="${leftPadding}" y="${y + 15}" 
            fill="${textColor}" 
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" 
            font-size="13" font-weight="500"
            style="animation: fadeIn 0.4s ease-out ${delay}s both;">
        ${escapeXml(lang.name)}
      </text>

      <!-- Background bar -->
      <rect x="${leftPadding + labelWidth}" y="${y + 3}" 
            width="${barMaxWidth}" height="${barHeight - 4}" 
            rx="4" fill="#161b22"
            style="animation: fadeIn 0.3s ease-out ${delay}s both;" />

      <!-- Filled bar -->
      <rect x="${leftPadding + labelWidth}" y="${y + 3}" 
            width="0" height="${barHeight - 4}" 
            rx="4" fill="${lang.color}"
            style="animation: growBar 0.8s ease-out ${delay}s forwards;">
        <animate attributeName="width" from="0" to="${barWidth}" 
                 dur="0.8s" begin="${delay}s" fill="freeze" />
      </rect>

      <!-- Percentage -->
      <text x="${leftPadding + labelWidth + barMaxWidth + 12}" y="${y + 15}" 
            fill="${subtitleColor}" 
            font-family="'SFMono-Regular', Consolas, monospace" 
            font-size="12"
            style="animation: fadeIn 0.4s ease-out ${pctDelay}s both; opacity: 0;">
        ${lang.percentage.toFixed(1)}%
      </text>
    </g>`;
    })
    .join("\n");

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
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="${bg}" rx="10" stroke="${cardBorder}" stroke-width="1" />

  <!-- Title -->
  <text x="${leftPadding}" y="32" 
        fill="${titleColor}" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" 
        font-size="16" font-weight="600"
        style="animation: fadeIn 0.5s ease-out both;">
    Languages
  </text>

  ${bars}
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
