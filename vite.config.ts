import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Placeholder for figma:asset when running outside Figma (local dev)
const FIGMA_ASSET_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const FIGMA_ASSET_VIRTUAL_PREFIX = '\0figma-asset:'

export default defineConfig({
  plugins: [
    {
      name: 'figma-asset-resolver',
      enforce: 'pre',
      resolveId(id) {
        if (id.startsWith('figma:asset/')) {
          return FIGMA_ASSET_VIRTUAL_PREFIX + id
        }
        return null
      },
      load(id) {
        if (id.startsWith(FIGMA_ASSET_VIRTUAL_PREFIX)) {
          return `export default ${JSON.stringify(FIGMA_ASSET_PLACEHOLDER)}`
        }
        return null
      },
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
