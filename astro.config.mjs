import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// HAPUS import vercel dan adapter untuk sementara
export default defineConfig({
  // HAPUS output: 'server'
  integrations: [tailwind()],
});