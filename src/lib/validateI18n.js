import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootPath = process.cwd();

const enUSFilePath = path.join(rootPath, "src/content/i18n/", "en-US.json");
const deDEFilePath = path.join(rootPath, "src/content/i18n/", "de-DE.json");

const enUSFile = readFileSync(enUSFilePath, "utf-8");
const deDEFile = readFileSync(deDEFilePath, "utf-8");

const enUSKeys = Object.keys(JSON.parse(enUSFile));
const deDEKeys = Object.keys(JSON.parse(deDEFile));

const missingKeysInDE = enUSKeys.filter((key) => !deDEKeys.includes(key));
const missingKeysInEN = deDEKeys.filter((key) => !enUSKeys.includes(key));

if (missingKeysInDE.length > 0) {
  console.log(
    `The following keys are missing in de-DE.json: ${missingKeysInDE.join(
      ", ",
    )}`,
  );
}

if (missingKeysInEN.length > 0) {
  console.log(
    `The following keys are missing in en-US.json: ${missingKeysInEN.join(
      ", ",
    )}`,
  );
} else {
  console.log("All keys are present in both files.");
}
