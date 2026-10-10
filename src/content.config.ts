import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    summary: z.string(),
    image: z.string()
  })
});

export const collections = { blog };
