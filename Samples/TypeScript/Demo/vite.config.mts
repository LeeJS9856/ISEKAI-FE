import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig((env: ConfigEnv): UserConfig => {
  let common: UserConfig = {
    plugins: [react()],
    server: {
      port: 5173, // Vite 6 default is 5173, user log showed 5173
    },
    root: './',
    base: '/',
    publicDir: './public',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@framework': path.resolve(__dirname, '../../../Framework/src'),
      }
    },
    build: {
      target: 'modules',
      assetsDir: 'assets',
      outDir: './dist',
      sourcemap: env.mode === 'development',
    },
  };
  return common;
});
