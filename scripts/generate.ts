import fs from "node:fs";
import path from "node:path";
import { fetchGitHubData } from "./fetch-github-data.js";
import { generateHeaderSvg } from "./generate-header.js";
import { generateLanguagesSvg } from "./generate-languages.js";
import { generateStatsSvg } from "./generate-stats.js";
import { generateReadme } from "./generate-readme.js";

const USERNAME = "jeroenvanwissen";
const GENERATED_DIR = path.resolve(process.cwd(), "generated");

async function main() {
  console.log("Fetching GitHub data...");
  const data = await fetchGitHubData(USERNAME);
  console.log(
    `  Found ${data.languages.length} languages across ${data.user.publicRepos} repos`,
  );
  console.log(
    `  Total stars: ${data.totalStars}, Followers: ${data.user.followers}`,
  );

  // Ensure output directory exists
  fs.mkdirSync(GENERATED_DIR, { recursive: true });

  // Generate header SVG
  console.log("Generating header SVG...");
  const headerSvg = generateHeaderSvg(data.user.name, [
    "Software Engineer",
    "Full Stack - JavaScript - TypeScript",
  ]);
  fs.writeFileSync(path.join(GENERATED_DIR, "header.svg"), headerSvg);

  // Generate languages SVG
  console.log("Generating languages SVG...");
  const languagesSvg = generateLanguagesSvg(data);
  fs.writeFileSync(path.join(GENERATED_DIR, "languages.svg"), languagesSvg);

  // Generate stats SVG
  console.log("Generating stats SVG...");
  const statsSvg = generateStatsSvg(data);
  fs.writeFileSync(path.join(GENERATED_DIR, "stats.svg"), statsSvg);

  // Generate README (social badges are now shields.io URLs, no SVG generation needed)
  console.log("Generating README.md...");
  const readme = generateReadme();
  fs.writeFileSync(path.resolve(process.cwd(), "README.md"), readme);

  console.log("Done! All files generated successfully.");
}

main().catch((err) => {
  console.error("Generation failed:", err);
  process.exit(1);
});
