import { defineConfig, resolveConfig } from 'vite'
import path, { resolve } from 'node:path'

export default defineConfig(async () => {

  return {

    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'src/index.ts'),  // Main entry file
          // You can add more files here if you want separate builds for other JS files
          // additional: path.resolve(__dirname, 'src/another-entry.js')
        },
        preserveEntrySignatures: 'exports-only',
        output: [
          {
            format: 'es',
            dir: 'lib',
            entryFileNames: '[name].js',
            exports: 'named',
            chunkFileNames: (chunkInfo) => {
                let regex = /([^/]+)\.(\w+)$/;
                let name = '[name].js';;
                if (chunkInfo.isEntry) {
                  return name;
                }
                
                if(regex.test(chunkInfo.name)){
                  console.log(name)
                  name = chunkInfo.name.replace(regex,(mathch, name, ext)=>{
                        return name.replace(/\.\w/, '')+'.js';
                    });
                }
                return name;
              },
            assetFileNames: 'assets/[name].[ext]',
            preserveModules:true,
            preserveModulesRoot: resolve(__dirname,'src'),
            esModule: true,
            freeze:false,
            minifyInternalExports:false,
            
          },
        ],
      }
    }
  }
})