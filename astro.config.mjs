import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";
import pdf from "./src/pdf";

// https://astro.build/config
export default defineConfig({
  base: "./",
  integrations: [tailwind(), icon(), pdf()],
});
