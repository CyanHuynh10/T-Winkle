import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import scopeChatCss from './scope-css.mjs'
export default defineConfig({
  plugins: [react(), tailwindcss(), scopeChatCss()],
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  base: '/chat-assets/',
  build: {
    minify: 'esbuild',
    outDir: '../../src/main/resources/static/chat-assets',
    emptyOutDir: true,
    lib: { entry: 'src/main.tsx', formats: ['es'], fileName: () => 'chat.js', cssFileName: 'chat' }
  }
})
