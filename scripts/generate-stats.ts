import type { GitHubData } from "./fetch-github-data.js";

export function generateStatsSvg(data: GitHubData): string {
  const width = 420;
  const height = 200;
  const bg = "#0d1117";
  const cardBorder = "#1e1e2e";
  const textColor = "#ffffff";
  const subtitleColor = "#b0b0b0";
  const accentColor = "#ff2bb9";
  const titleColor = "#ff2bb9";

  const yearsSince =
    new Date().getFullYear() - new Date(data.user.createdAt).getFullYear();

  // Left column: GitHub stats
  const leftStats = [
    {
      label: "Public Repos",
      value: data.user.publicRepos,
      icon: "M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9z",
    },
    {
      label: "Followers",
      value: data.user.followers,
      icon: "M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z",
    },
    {
      label: "Total Stars",
      value: data.totalStars,
      icon: "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z",
    },
  ];

  // Right column: Commit stats
  const rightStats = [
    {
      label: "This Year",
      value: data.commits.thisYear,
      icon: "M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0z",
    },
    {
      label: "Total Commits",
      value: data.commits.totalCommits,
      icon: "M1.5 3.25c0-.966.784-1.75 1.75-1.75h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 016.75 8.5h-3.5A1.75 1.75 0 011.5 6.75v-3.5zM3.25 3a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 00.25-.25v-3.5a.25.25 0 00-.25-.25h-3.5z",
    },
    {
      label: "This Month",
      value: data.commits.thisMonth,
      icon: "M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z",
    },
  ];

  const colWidth = (width - 50) / 2;
  const rowHeight = 50;
  const leftX = 25;
  const rightX = 25 + colWidth;
  const startY = 54;
  const valueFontSize = 18;

  // Generate left column stats
  const leftElements = leftStats
    .map((stat, i) => {
      const y = startY + i * rowHeight;
      const delay = Math.round((0.3 + i * 0.15) * 100) / 100;

      return `
    <g style="animation: fadeInUp 0.5s ease-out ${delay}s both; opacity: 0;">
      <!-- Icon -->
      <g transform="translate(${leftX}, ${y})" fill="${accentColor}" opacity="0.8">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="${stat.icon}" />
        </svg>
      </g>

      <!-- Value -->
      <text x="${leftX + 24}" y="${y + 12}" 
            fill="${textColor}" 
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
            font-size="${valueFontSize}" font-weight="700">
        ${stat.value}
      </text>

      <!-- Label -->
      <text x="${leftX + 24}" y="${y + 29}" 
            fill="${subtitleColor}" 
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
            font-size="12">
        ${stat.label}
      </text>
    </g>`;
    })
    .join("\n");

  // Generate right column stats
  const rightElements = rightStats
    .map((stat, i) => {
      const y = startY + i * rowHeight;
      const delay = Math.round((0.3 + i * 0.15) * 100) / 100;

      return `
    <g style="animation: fadeInUp 0.5s ease-out ${delay}s both; opacity: 0;">
      <!-- Icon -->
      <g transform="translate(${rightX}, ${y})" fill="${accentColor}" opacity="0.8">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="${stat.icon}" />
        </svg>
      </g>

      <!-- Value -->
      <text x="${rightX + 24}" y="${y + 12}" 
            fill="${textColor}" 
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
            font-size="${valueFontSize}" font-weight="700">
        ${stat.value}
      </text>

      <!-- Label -->
      <text x="${rightX + 24}" y="${y + 29}" 
            fill="${subtitleColor}" 
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
            font-size="12">
        ${stat.label}
      </text>
    </g>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="${bg}" rx="10" stroke="${cardBorder}" stroke-width="1" />

  <!-- Left Section Header -->
  <text x="${leftX}" y="32" 
        fill="${titleColor}" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" 
        font-size="14" font-weight="600"
        style="animation: fadeInUp 0.5s ease-out both;">
    GitHub Stats
  </text>

  <!-- Right Section Header -->
  <text x="${rightX}" y="32" 
        fill="${titleColor}" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" 
        font-size="14" font-weight="600"
        style="animation: fadeInUp 0.5s ease-out 0.1s both; opacity: 0;">
    Commits
  </text>

  ${leftElements}
  ${rightElements}
</svg>`;
}
