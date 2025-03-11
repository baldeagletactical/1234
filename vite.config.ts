import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import siteConfig from './src/config.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: [
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-slot',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ]
        }
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.WIX_SITE_ID': JSON.stringify(process.env.WIX_SITE_ID),
    'process.env.WIX_API_KEY': JSON.stringify(process.env.WIX_API_KEY)
  }
}));
