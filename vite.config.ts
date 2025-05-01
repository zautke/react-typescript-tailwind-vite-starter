import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import Terminal from "vite-plugin-terminal";
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist/types', // output directory for .d.ts files
      tsconfigPath: './tsconfig.json',
    }),
    react(),
    svgr(),
    nodePolyfills(),
    Terminal({
      console: 'terminal',
      output: ['terminal', 'console']
    })
  ],
})
