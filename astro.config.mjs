import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://shunji-iu.github.io",
  base: process.env.GITHUB_ACTIONS ? "/iu-aero-tech-site-prototype" : "/",
  build: {
    format: "file"
  }
});
