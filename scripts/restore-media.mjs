import { readFileSync, writeFileSync, renameSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const items = JSON.parse(readFileSync(resolve(root, "media-source/manifest.json"), "utf8"));
for (const item of items) {
 const bytes = Buffer.concat(item.parts.map(part => readFileSync(resolve(root, part))));
 if (createHash("sha256").update(bytes).digest("hex") !== item.sha256) throw new Error("Media integrity check failed: " + item.output);
 const output = resolve(root, item.output);
 mkdirSync(dirname(output), {recursive:true});
 writeFileSync(output + ".tmp", bytes);
 renameSync(output + ".tmp", output);
}
console.log("Restored original media without quality loss.");
