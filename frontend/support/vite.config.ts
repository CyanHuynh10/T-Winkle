import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import scopeChatCss from './scope-css.mjs'
export default defineConfig({
  plugins: [react(), tailwindcss(), scopeChatCss()],
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: { dedupe: ['react','react-dom'], alias: { 'react': fileURLToPath(new URL('../manager/node_modules/react',import.meta.url)), 'react-dom': fileURLToPath(new URL('../manager/node_modules/react-dom',import.meta.url)), 'lucide-react': fileURLToPath(new URL('../manager/node_modules/lucide-react',import.meta.url)), 'sonner': fileURLToPath(new URL('../manager/node_modules/sonner',import.meta.url)), '@stomp/stompjs': fileURLToPath(new URL('../manager/node_modules/@stomp/stompjs',import.meta.url)), '@': fileURLToPath(new URL('../manager/src', import.meta.url)) } },
  base: '/support-assets/',
  build: {
    minify: 'esbuild',
    outDir: '../../src/main/resources/static/support-assets',
    emptyOutDir: true,
    lib: { entry: 'src/main.tsx', formats: ['es'], fileName: () => 'support.js', cssFileName: 'support' }
  }
})

