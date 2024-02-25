import esbuild from 'esbuild';
import pkg from './package.json' assert {type: 'json'};

const dev = process.argv.includes("--dev");
const minify = !dev;
const watch = process.argv.includes("--watch");

const external = Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies
})
const baseConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: minify,
    sourcemap: true,
    outdir: 'dist',
    target: "es2019",
    watch,
    external
}

// 병렬로 처리 (esm, cjs)
Promise.all([
    esbuild.build({
        ...baseConfig,
        format: 'esm',
    }),
    esbuild.build({
        ...baseConfig,
        format: 'cjs',
        outExtension: {
            ".js": ".cjs",
        }
    })
]).catch(() => {
    console.error(...data, "Build failed");
    process.exit(1);
})

