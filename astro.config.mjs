import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";
import pdf from "./src/pdf";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), pdf()],
});
