import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const destinations = [
  ["tokyo", "Tokyo", "en"],
  ["nara", "Nara Park", "en"],
  ["koyasan", "Mount Kōya", "en"],
  ["kanazawa", "Kenroku-en", "en"],
  ["nikko", "Nikkō", "en"],
  ["takachiho", "高千穂峡", "ja"],
  ["yakushima", "Yakushima", "en"],
  ["kerama", "Kerama Islands", "en"],
  ["kamikochi", "Kamikōchi", "en"],
  ["himeji", "Himeji Castle", "en"],
  ["naoshima", "Naoshima", "en"],
  ["biei", "Biei, Hokkaido", "en"],
  ["ouchijuku", "Ōuchi-juku", "en"],
  ["matsushima", "Matsushima", "en"],
  ["beppu", "Beppu", "en"],
];

const shimanamiUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Shimanami_Kaido_5.jpg/1920px-Shimanami_Kaido_5.jpg";
const outputDir = path.resolve("public/places");
await fs.mkdir(outputDir, { recursive: true });

async function fetchPageImages(language, titles) {
  const api = new URL(`https://${language}.wikipedia.org/w/api.php`);
  api.searchParams.set("action", "query");
  api.searchParams.set("prop", "pageimages");
  api.searchParams.set("pithumbsize", "1600");
  api.searchParams.set("format", "json");
  api.searchParams.set("titles", titles.join("|"));
  const response = await fetch(api, { headers: { "user-agent": "KokoroJapanSite/1.0 (sunveda.tech)" } });
  if (!response.ok) throw new Error(`Wikipedia API error: ${response.status}`);
  const data = await response.json();
  return new Map(Object.values(data.query.pages).map((page) => [page.title, page.thumbnail?.source]));
}

const enImages = await fetchPageImages("en", destinations.filter(([, , lang]) => lang === "en").map(([, title]) => title));
const jaImages = await fetchPageImages("ja", destinations.filter(([, , lang]) => lang === "ja").map(([, title]) => title));
const sources = [];

async function saveImage(id, source, article) {
  const output = path.join(outputDir, `${id}.webp`);
  const exists = await fs.access(output).then(() => true).catch(() => false);
  if (exists) {
    sources.push(`- ${id}: ${article}`);
    console.log(`Kept ${id}.webp`);
    return;
  }
  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(source, { headers: { "user-agent": "KokoroJapanSite/1.0 (sunveda.tech)" } });
    if (response.ok) break;
    if (response.status !== 429 || attempt === 4) throw new Error(`Image download failed for ${id}: ${response.status}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 5000));
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await sharp(buffer).resize(1400, 980, { fit: "cover", position: "attention" }).webp({ quality: 84 }).toFile(output);
  sources.push(`- ${id}: ${article}`);
  console.log(`Saved ${id}.webp`);
  await new Promise((resolve) => setTimeout(resolve, 2500));
}

for (const [id, title, lang] of destinations) {
  const source = (lang === "ja" ? jaImages : enImages).get(title);
  if (!source) throw new Error(`No page image found for ${title}`);
  await saveImage(id, source, `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`);
}

await saveImage("shimanami", shimanamiUrl, "https://commons.wikimedia.org/wiki/File:Shimanami_Kaido_5.jpg");
await fs.writeFile(path.join(outputDir, "ATTRIBUTION.md"), `# Destination image sources\n\nImages are sourced from Wikimedia Commons through the linked Wikipedia pages. See each source page for its author and license.\n\n${sources.join("\n")}\n`);
