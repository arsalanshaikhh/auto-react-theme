const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build ESM version
esbuild.build({
  entryPoints: [path.join(__dirname, 'src', 'index.ts')],
  bundle: true,
  outfile: path.join(distDir, 'index.mjs'),
  format: 'esm',
  target: 'es2019',
  platform: 'browser',
  sourcemap: true,
  minify: true,
  external: ['react', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).then(() => {
  console.log('ESM build completed successfully');
}).catch((error) => {
  console.error('ESM build failed:', error);
  process.exit(1);
});

// Build CJS version
esbuild.build({
  entryPoints: [path.join(__dirname, 'src', 'index.ts')],
  bundle: true,
  outfile: path.join(distDir, 'index.js'),
  format: 'cjs',
  target: 'es2019',
  platform: 'browser',
  sourcemap: true,
  minify: true,
  external: ['react', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).then(() => {
  console.log('CJS build completed successfully');
}).catch((error) => {
  console.error('CJS build failed:', error);
  process.exit(1);
});
