import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [vue(), dts()],
  build: {
    minify: true,
    outDir: 'build',
    lib: {
      entry: 'src/components/index.ts',

      name: 'Vue3DragResizePlus',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'umd' ? 'umd.' : ''}js`
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      input: 'src/components/index.ts',
      output: {assetFileNames: 'index.css', globals: {vue: 'Vue'}}
    }
  }
});
