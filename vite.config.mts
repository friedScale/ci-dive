
import {defineConfig} from "vite";

import {babel} from "@rollup/plugin-babel"
import browserlistToEsbuild from "browserslist-to-esbuild"
import react from "@vitejs/plugin-react-swc"
import preserveDirectives from "rollup-preserve-directives"
import dts from "vite-plugin-dts"

import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json"

// const tsconfigPathAliases = Object.entries(tsconfig.compilerOptions.paths || {}).flatMap(([key, value]) => {
//     const pathKey = key.replace("/*", "");

//     //[$, 'absolute/path/src/][]
//     return value.map(v => ([pathKey, resolve(tsconfig.compilerOptions.baseUrl, v.replace("/*", "").replace("*", ""))]));
// })

export default defineConfig({
   build: {
        target: browserlistToEsbuild(),
        lib: {
            entry: {
                index: 'src/index.ts',
                react: "src/react.tsx",
                next: "src/next.tsx",
                utils: "src/utils/index.ts"
            },
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            output: [
                {
                    format: 'es',
                    dir: 'dist/esm',
                },
                {
                    format: 'cjs',
                    dir: 'dist/cjs'
                }
            ],
            // external: ['react', 'next', 'react/jsx-runtime', 'next/image'],
            external: [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.devDependencies)].flatMap((dep) => [dep, new RegExp(`^${dep}/.*`)]), 
        },
        outDir: 'dist',
        sourcemap: true,
    },
    plugins: [
        tsconfigPaths(),
        preserveDirectives(),
        react(),
        babel({
            babelHelpers: 'runtime',
            plugins: [
                ['@babel/plugin-transform-runtime'],
                [
                    'babel-plugin-polyfill-corejs3', 
                    {
                            method: 'usage-pure', 
                        version: pkg.devDependencies['core-js-pure'],
                        proposals: true, 
                        shouldInjectPolyfill: (polyfillName: string) => {
                            // Exclude regenerator-runtime as it is handled by @babel/plugin-transform-runtime
                            return polyfillName !== 'exnext.json.parse' && polyfillName !== 'es.string.trime';
                        }
                    }
                ]
            ],
            extensions: ['.js', '.ts', '.tsx'],
            exclude: 'node_modules/**',
        }),
        dts({
            tsconfigPath: './tsconfig.json',
            outDir: 'dist/types',
            rollupTypes: false,
        })
    ]
});