const {build}=require('esbuild');
build({entryPoints:[__dirname+'/src/index.tsx'],outfile:__dirname+'/simulador.js',bundle:true,minify:true,format:'iife',target:['es2020'],jsx:'automatic',loader:{'.css':'text'},define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'}).catch(()=>process.exit(1));
