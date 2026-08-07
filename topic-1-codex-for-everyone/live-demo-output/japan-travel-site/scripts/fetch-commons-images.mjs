import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const places = [
  ["fuji", "Mount Fuji Lake Kawaguchi Japan"],
  ["kyoto", "Fushimi Inari Kyoto Japan"],
  ["miyajima", "Itsukushima Shrine Miyajima Japan"],
  ["shirakawago", "Shirakawa-go winter Japan"],
  ["tokyo", "Tokyo skyline Sensoji Japan"],
  ["nara", "Nara Park deer Japan"],
  ["koyasan", "Koyasan temple Japan"],
  ["kanazawa", "Kenrokuen Kanazawa Japan"],
  ["nikko", "Nikko Toshogu Japan"],
  ["takachiho", "Takachiho Gorge Japan"],
  ["yakushima", "Yakushima forest Japan"],
  ["kerama", "Kerama Islands Okinawa Japan"],
  ["shimanami", "Shimanami Kaido Japan cycling"],
  ["kamikochi", "Kamikochi Japan Alps"],
  ["himeji", "Himeji Castle Japan cherry blossoms"],
  ["naoshima", "Naoshima art island Japan"],
  ["biei", "Biei Hokkaido flower fields Japan"],
  ["ouchijuku", "Ouchi-juku winter Japan"],
  ["matsushima", "Matsushima Bay Japan"],
  ["beppu", "Beppu hot springs Japan steam"],
];

const outDir = new URL("../public/places/", import.meta.url);
await fs.mkdir(outDir, { recursive: true });

const attributions = [];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (const [id, search] of places) {
  const outputPath = path.join(new URL(outDir).pathname, `${id}.webp`);
  const alreadyDownloaded = await fs.access(outputPath).then(() => true).catch(() => false);
  if (alreadyDownloaded) {
    attributions.push({ id, title: search, creator: "Wikimedia Commons contributor", license: "See source", licenseUrl: "", source: `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(search)}` });
    process.stdout.write(`Kept existing ${id}\n`);
    continue;
  }
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${search}`,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: "1800",
    format: "json",
    origin: "*",
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error(`Commons search failed for ${id}: ${response.status}`);
  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {})
    .filter((page) => page.imageinfo?.[0]?.thumburl)
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  let selected;
  let info;
  let imageResponse;
  for (const candidate of pages) {
      const candidateInfo = candidate.imageinfo[0];
      let response = await fetch(candidateInfo.thumburl, {
        headers: { "User-Agent": "KokoroJapanTravelSite/1.0 (website asset sourcing)" },
      });
      if (response.status === 429) {
        await pause(2400);
        response = await fetch(candidateInfo.thumburl, {
          headers: { "User-Agent": "KokoroJapanTravelSite/1.0 (website asset sourcing)" },
        });
      }
      if (response.ok) {
        selected = candidate;
        info = candidateInfo;
        imageResponse = response;
        break;
    }
  }
  if (!selected || !info || !imageResponse) {
    throw new Error(`No downloadable Commons image found for ${id}`);
  }
  if (imageResponse) {
    const bytes = Buffer.from(await imageResponse.arrayBuffer());
    await sharp(bytes)
      .resize(1400, 980, { fit: "cover", position: "attention" })
      .webp({ quality: 86 })
      .toFile(outputPath);
  }

  const metadata = info.extmetadata ?? {};
  attributions.push({
    id,
    title: selected.title,
    creator: metadata.Artist?.value ?? "Wikimedia Commons contributor",
    license: metadata.LicenseShortName?.value ?? metadata.UsageTerms?.value ?? "See source",
    licenseUrl: metadata.LicenseUrl?.value ?? "",
    source: info.descriptionurl,
  });
  process.stdout.write(`Downloaded ${id}: ${selected.title}\n`);
  await pause(700);
}

await fs.writeFile(
  new URL("../public/places/attributions.json", import.meta.url),
  JSON.stringify(attributions, null, 2),
);
