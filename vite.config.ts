import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
const resolve = path.resolve

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: '_p', replacement: resolve(__dirname, './packages') }
    ]
  },
  build: {
    outDir: "dist", //输出文件名称
    lib: {
      entry: resolve(__dirname, "packages/ImageCropper/index.ts"), //指定组件编译入口文件,
      name: 'image-cropper',
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js',
      formats: ['cjs', 'es']
    }, //库编译模式配置
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    }, // rollup打包配置
  }
})
