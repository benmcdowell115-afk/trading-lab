import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves from /trading-lab/ sub-path; all other hosts use root
  base: process.env.GITHUB_PAGES === 'true' ? '/trading-lab/' : '/',
})
