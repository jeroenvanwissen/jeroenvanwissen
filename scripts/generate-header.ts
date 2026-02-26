// Brand colors
const ACCENT = "#ff2bb9"; // Hot pink from logo
const BG = "#0d1117"; // Dark background
const TEXT = "#ffffff"; // White text
const SUBTITLE = "#b0b0b0"; // Light gray subtitle

// Inline SVG logo paths (from brand SVG source)
const LOGO_SVG_INNER = `
    <defs>
      <linearGradient id="paint0_linear_368_788" x1="59.4768" y1="18.88" x2="45.0753" y2="73.8957" gradientUnits="userSpaceOnUse">
        <stop offset="0.185" stop-color="#FF2BB9" stop-opacity="0"/>
        <stop offset="1" stop-color="#FF2BB9"/>
      </linearGradient>
      <linearGradient id="paint1_linear_368_788" x1="59.4768" y1="18.88" x2="45.0753" y2="73.8957" gradientUnits="userSpaceOnUse">
        <stop offset="0.185" stop-color="#FF2BB9" stop-opacity="0"/>
        <stop offset="1" stop-color="#FF2BB9"/>
      </linearGradient>
    </defs>
    <path d="M18.4326 18.88C16.1285 18.88 14.5795 21.2417 15.4976 23.355L31.0782 59.2206C31.586 60.3895 32.7389 61.1456 34.0132 61.1456H38.9844C41.2896 61.1456 42.8386 58.7819 41.9184 56.6683L26.3046 20.8027C25.7963 19.6351 24.6441 18.88 23.3706 18.88H18.4326Z" fill="url(#paint0_linear_368_788)" fill-opacity="0.5"/>
    <path d="M41.4405 18.88C39.1364 18.88 37.5874 21.2417 38.5055 23.355L54.0861 59.2206C54.5939 60.3895 55.7468 61.1456 57.0211 61.1456H61.9923C64.2975 61.1456 65.8465 58.7819 64.9263 56.6683L49.3125 20.8027C48.8042 19.6351 47.652 18.88 46.3785 18.88H41.4405Z" fill="url(#paint1_linear_368_788)" fill-opacity="0.5"/>
    <path d="M68.6909 18.88C70.676 18.88 72.1822 20.6688 71.8441 22.625L65.6455 58.4906C65.3804 60.0249 64.0493 61.1456 62.4923 61.1456H57.0375C55.0512 61.1456 53.5447 59.3548 53.8847 57.3978L60.1165 21.5322C60.3828 19.9992 61.7133 18.88 63.2692 18.88H68.6909Z" fill="#FF2BB9"/>
    <path d="M45.6509 18.88C47.636 18.88 49.1422 20.6688 48.8041 22.625L42.6055 58.4906C42.3404 60.0249 41.0093 61.1456 39.4523 61.1456H33.9975C32.0112 61.1456 30.5047 59.3548 30.8447 57.3978L37.0765 21.5322C37.3428 19.9992 38.6733 18.88 40.2292 18.88H45.6509Z" fill="#FF2BB9"/>
    <path d="M14.0378 21.5322C14.3041 19.9992 15.6346 18.88 17.1905 18.88H22.619C24.6041 18.88 26.1103 20.6688 25.7722 22.625L24.7214 28.705C24.4563 30.2393 23.1252 31.36 21.5682 31.36H16.1341C14.1478 31.36 12.6413 29.5692 12.9813 27.6122L14.0378 21.5322Z" fill="#FF2BB9"/>
    <path d="M13.2429 41.6C11.6869 41.6 10.3565 42.7192 10.0901 44.2522L9.08485 50.0378C8.74481 51.9948 10.2513 53.7856 12.2376 53.7856H12.6327C13.4598 53.7856 14.0874 54.531 13.9465 55.3461C13.2468 57.8913 11.7785 59.3685 9.73427 60.438C8.6381 61.0114 8.02922 62.2722 8.45828 63.4325L9.01319 64.9332C9.44224 66.0935 10.7382 66.7012 11.8551 66.1694C15.2196 64.5672 18.5129 61.9037 19.8591 56.7713L19.892 56.6457L20.8377 51.1747C20.8405 51.16 20.8431 51.1453 20.8456 51.1306L21.8456 45.345C22.1836 43.3888 20.6775 41.6 18.6923 41.6H13.2429Z" fill="#FF2BB9"/>`;

export function generateHeaderSvg(name: string, titles: string[]): string {
  const width = 840;
  const height = 150;

  const logoSize = 80; // 56x56 with original viewBox

  const logoX = 40;
  const logoY = 24;
  const nameX = 130;
  const nameY = 60;

  // The logo viewBox is 0 0 80 80, but actual drawn content spans y 18.88..66.17
  // Visual center of logo content in viewBox coords: (18.88 + 66.17) / 2 = 42.5
  // At 56px rendered size, scale = 56/80 = 0.7
  // Visual center offset from top of logo element: 42.5 * 0.7 = 29.75

  // Place the logo so its visual center sits at the same vertical center as the text
  // const logoVisualCenterOffset = 42.5 * (logoSize / 80); // ~29.75
  // const logoY = Math.round(nameY - logoVisualCenterOffset);

  // Build the subtitle line
  const titleText = titles.join("  |  ");
  const titleLen = titleText.length;

  // Subtitle sits below the row
  const subtitleY = Math.round(nameY + logoSize / 2 + 20);

  // Name as lowercase for the branded style
  const brandName = name.toLowerCase().replace(/\s+/g, "");

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,800&amp;display=swap');

      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes logoReveal {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      .logo-group {
        animation: logoReveal 0.6s ease-out both;
      }
      .name {
        font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        font-size: 58px;
        line-height: 70px;
        font-weight: 800;
        font-style: italic;
        fill: ${TEXT};
        animation: fadeInDown 0.8s ease-out 0.15s both;
      }
      .title-container {
        animation: fadeInUp 0.8s ease-out 0.5s both;
      }
      .title {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 14px;
        fill: ${SUBTITLE};
      }
      .cursor {
        animation: blink 1s step-end infinite;
        fill: ${ACCENT};
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${BG}" rx="10" />

  <!-- Logo (inline SVG, aligned to row center) -->
  <!-- Outer g: positioning. Inner g: CSS animation (CSS transform overrides SVG transform, so they must be separate) -->
  <g transform="translate(${logoX}, ${logoY})">
    <g class="logo-group">
      <svg viewBox="0 0 80 80" width="${logoSize}" height="${logoSize}" fill="none">
        ${LOGO_SVG_INNER}
      </svg>
    </g>
  </g>

  <!-- Name: Roboto italic 800, lowercase, 48px, vertically centered with logo -->
  <text class="name" x="${nameX}" y="${nameY}" dominant-baseline="central">${escapeXml(brandName)}</text>

  <!-- Subtitle -->
  <g class="title-container">
    <text class="title" x="${logoX}" y="${subtitleY}">$ ${escapeXml(titleText)}</text>
    <text class="title cursor" x="${logoX + 14 + titleLen * 8.4}" y="${subtitleY}">_</text>
  </g>
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
