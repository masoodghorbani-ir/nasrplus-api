// Production build script using esbuild and javascript-obfuscator
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');
const JavaScriptObfuscator = require('javascript-obfuscator');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const pkgPath = path.resolve(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

/** Recursively copy directory */
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function build() {
  const startTime = Date.now();
  console.log('==> [1/5] Running TypeScript type check...');
  execSync('npm run type-check', { cwd: rootDir, stdio: 'inherit' });

  console.log('==> [2/5] Cleaning and preparing dist folder...');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  console.log('==> [3/5] Bundling source code with esbuild...');
  const bundledFile = path.join(distDir, 'server.bundled.js');
  const externalDeps = Object.keys(pkg.dependencies || {});

  await esbuild.build({
    entryPoints: [path.join(rootDir, 'src', 'server.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: bundledFile,
    external: externalDeps,
    sourcemap: false,
    minify: false,
    legalComments: 'none',
  });

  console.log('==> [4/5] Obfuscating bundled code with javascript-obfuscator...');
  const bundledCode = fs.readFileSync(bundledFile, 'utf8');

  const obfuscationResult = JavaScriptObfuscator.obfuscate(bundledCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    renameProperties: false,
    rotateStringArray: true,
    selfDefending: false,
    shuffleStringArray: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.8,
    target: 'node',
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
  });

  const finalServerJs = path.join(distDir, 'server.js');
  fs.writeFileSync(finalServerJs, obfuscationResult.getObfuscatedCode(), 'utf8');
  fs.unlinkSync(bundledFile);

  console.log('==> [5/5] Copying deployment assets and configuration files...');

  // Copy public static directory
  const publicSrc = path.join(rootDir, 'public');
  const publicDest = path.join(distDir, 'public');
  if (fs.existsSync(publicSrc)) {
    copyDirSync(publicSrc, publicDest);
  }

  // Ensure uploads directory exists
  const uploadsDest = path.join(distDir, 'uploads');
  fs.mkdirSync(uploadsDest, { recursive: true });
  fs.writeFileSync(path.join(uploadsDest, '.gitkeep'), '', 'utf8');

  // Copy web.config
  const webConfigSource = path.join(rootDir, 'web.config');
  if (fs.existsSync(webConfigSource)) {
    fs.copyFileSync(webConfigSource, path.join(distDir, 'web.config'));
  }

  // Copy ecosystem.config.js
  const ecosystemSource = path.join(rootDir, 'ecosystem.config.js');
  if (fs.existsSync(ecosystemSource)) {
    fs.copyFileSync(ecosystemSource, path.join(distDir, 'ecosystem.config.js'));
  }

  // Copy .env.example
  const envExampleSource = path.join(rootDir, '.env.example');
  if (fs.existsSync(envExampleSource)) {
    fs.copyFileSync(envExampleSource, path.join(distDir, '.env.example'));
  }

  // Copy package-lock.json
  const lockSource = path.join(rootDir, 'package-lock.json');
  if (fs.existsSync(lockSource)) {
    fs.copyFileSync(lockSource, path.join(distDir, 'package-lock.json'));
  }

  // Generate deployment package.json containing production dependencies only
  const deployPkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: 'server.js',
    scripts: {
      start: 'node server.js',
    },
    dependencies: pkg.dependencies,
  };
  fs.writeFileSync(
    path.join(distDir, 'package.json'),
    JSON.stringify(deployPkg, null, 2),
    'utf8'
  );

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const serverStat = fs.statSync(finalServerJs);
  console.log(`\n✔ Build completed successfully in ${duration}s!`);
  console.log(`✔ Generated obfuscated server: dist/server.js (${(serverStat.size / 1024).toFixed(1)} KB)`);
  console.log('✔ Deployment bundle ready in: dist/');
}

build().catch((err) => {
  console.error('Build failed with error:', err);
  process.exit(1);
});
