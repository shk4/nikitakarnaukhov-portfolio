import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  await readFile(resolve(root, "media-source/manifest.json"), "utf8"),
);

for (const item of manifest) {
  const parts = await Promise.all(
    item.parts.map((part) => readFile(resolve(root, part))),
  );
  const bytes = Buffer.concat(parts);
  const digest = createHash("sha256").update(bytes).digest("hex");

  if (digest !== item.sha256) {
    throw new Error(`Media integrity check failed: ${item.output}`);
  }

  const output = resolve(root, item.output);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(`${output}.tmp`, bytes);
  await rename(`${output}.tmp`, output);
}

console.log("Restored original media without quality loss.");
