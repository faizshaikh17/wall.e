/*
  Wallpaper README Auto-Generator
  --------------------------------
  Usage:
    1. Place this file at the repo root.
    2. Add wallpapers inside ./wallpapers/
    3. Run:  node generate-readme.js
       (or:  bun generate-readme.js)
    4. It will generate or update README.md

  💾 It also saves a backup as README.md.bak
*/

const fs = require("fs");
const path = require("path");

const WALLPAPERS_DIR = path.join(__dirname, "wallpapers");
const README_PATH = path.join(__dirname, "README.md");
const BACKUP_PATH = path.join(__dirname, "README.md.bak");

const IMG_WIDTH = 360; // preview width in px
const IMAGES_PER_ROW = 3;
const ALLOWED_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

function readTemplate() {
  const templatePath = path.join(__dirname, "README-template.md");
  if (fs.existsSync(templatePath)) return fs.readFileSync(templatePath, "utf8");

  // fallback template if none found
  return ` # Personal Favrouties

---

<!-- GALLERY_START -->

<!-- GALLERY_END -->

---

>
`;
}

function scanImages() {
  if (!fs.existsSync(WALLPAPERS_DIR)) return [];
  return fs
    .readdirSync(WALLPAPERS_DIR)
    .filter((f) => ALLOWED_EXT.includes(path.extname(f).toLowerCase()))
    .sort();
}

function makeGalleryMarkdown(images) {
  if (!images.length)
    return "\n_Empty — add images to `wallpapers/` to populate the gallery._\n";

  let md = '\n<p align="center">\n';
  images.forEach((img, idx) => {
    const imgPath = `./wallpapers/${encodeURI(img)}`;
    md += `  <img src="${imgPath}" width="${IMG_WIDTH}" style="margin:6px;border-radius:8px;object-fit:cover;" />\n`;
    if ((idx + 1) % IMAGES_PER_ROW === 0) md += "  <br/>\n";
  });
  md += "</p>\n";
  return md;
}

function writeReadme(newContent) {
  if (fs.existsSync(README_PATH)) {
    fs.copyFileSync(README_PATH, BACKUP_PATH);
    console.log("Backup saved to README.md.bak");
  }
  fs.writeFileSync(README_PATH, newContent, "utf8");
  console.log("README.md updated successfully!");
}

function main() {
  const template = readTemplate();
  const images = scanImages();
  const galleryMd = makeGalleryMarkdown(images);

  const startMarker = "<!-- GALLERY_START -->";
  const endMarker = "<!-- GALLERY_END -->";

  if (!template.includes(startMarker) || !template.includes(endMarker)) {
    console.warn(
      "⚠️ Template missing gallery markers. Appending gallery to the end."
    );
    writeReadme(template + "\n" + galleryMd);
    return;
  }

  const before = template.split(startMarker)[0];
  const after = template.split(endMarker)[1];
  const newReadme =
    before + startMarker + "\n" + galleryMd + "\n" + endMarker + after;

  writeReadme(newReadme);
}

main();
