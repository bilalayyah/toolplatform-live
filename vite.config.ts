import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {generateRobotsTxt, generateSitemapXml} from './src/lib/seoFiles';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'generate-seo-files',
        configureServer(server) {
          server.middlewares.use('/robots.txt', (_req, res) => {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(generateRobotsTxt());
          });
          server.middlewares.use('/sitemap.xml', (_req, res) => {
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.end(generateSitemapXml());
          });
        },
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          if (fs.existsSync(distDir)) {
            fs.writeFileSync(path.join(distDir, 'robots.txt'), generateRobotsTxt(), 'utf-8');
            fs.writeFileSync(path.join(distDir, 'sitemap.xml'), generateSitemapXml(), 'utf-8');
          }
        },
      },
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
