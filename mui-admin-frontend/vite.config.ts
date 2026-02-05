import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',  // 모든 네트워크 인터페이스에서 접근 가능
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  // 빌드 시 외부 CDN 사용 안 함 (온프레미스 대응)
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,  // 단일 번들로 생성
      },
    },
  },
})
