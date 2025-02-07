import { defineConfig, resolveConfig } from 'vite'
import path, { resolve } from 'node:path'

export default defineConfig(async () => {

    return {

        build:{
          rollupOptions: {
            input: {
              main: path.resolve(__dirname, 'src/index.ts'),  // Main entry file
              // You can add more files here if you want separate builds for other JS files
              // additional: path.resolve(__dirname, 'src/another-entry.js')
            },
            // Customize the output options if needed
            output: {
              // Define the directory to store the output
              dir: 'dist',
              format: 'es',  // ES module output
              entryFileNames: '[name].[hash].js',  // Dynamic file names
            },
        }
    }
  })