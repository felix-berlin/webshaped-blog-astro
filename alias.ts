import path, { dirname } from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  "@components": `${path.resolve(__dirname, "./src/components/")}/`,
  "@stores": `${path.resolve(__dirname, "./src/stores/")}/`,
  "@i18n": path.resolve(__dirname, "./src/utils/i18n/"),
  "@layouts": path.resolve(__dirname, "./src/layouts/"),
  "@lib": path.resolve(__dirname, "./src/lib/"),
  "@utils": path.resolve(__dirname, "./src/utils/"),
  "@ts_types": path.resolve(__dirname, "./src/types/"),
  "@features": path.resolve(__dirname, "./src/features/"),
  "@services": path.resolve(__dirname, "./src/services/"),
  "@sass-butler/": `${path.resolve(
    __dirname,
    "node_modules/@felix_berlin/sass-butler/",
  )}/`,
  "@styles/": `${path.resolve(__dirname, "src/styles/")}/`,
  "@types/": `${path.resolve(__dirname, "src/types/")}/`,
  "@assets/": `${path.resolve(__dirname, "src/assets/")}/`,
};
