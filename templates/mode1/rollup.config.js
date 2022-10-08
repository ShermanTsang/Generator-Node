import path from 'path';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import rollupTypescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { terser } from 'rollup-plugin-terser'; // 读取 package.json 配置
import pkg from './package.json'; // 当前运行环境，可通过 cross-env 命令行设置

const env = process.env.NODE_ENV; // umd 模式的编译结果文件输出的全局变量名称

const config = {
    input: path.resolve(__dirname, './src/index.ts'),
    output: [
        // commonjs
        {
            // package.json 配置的 main 属性
            file: pkg.main,
            format: 'cjs'
        },
        // es module
        {
            // package.json 配置的 module 属性
            file: pkg.module,
            format: 'es'
        },
        // umd
        {
            // umd 导出文件的全局变量
            name: pkg.name, // package.json 配置的 umd 属性
            file: pkg.umd,
            format: 'umd'
        }
    ],
    plugins: [
        // nodePolyfills(),
        nodeResolve({
            exportConditions: ['node'],
            preferBuiltins: false
        }), // 解析第三方依赖
        commonjs(), // 识别 commonjs 模式第三方依赖
        rollupTypescript(), // rollup 编译 typescript
        babel({
            babelHelpers: 'runtime', // 编译库使用
            exclude: 'node_modules/**', // 只转换源代码，不转换外部依赖
            extensions: [...DEFAULT_EXTENSIONS, '.ts'] // babel 默认不支持 ts 需要手动添加
        }),
        json()
    ],
    external: [''] //告诉rollup不要将此lodash打包，而作为外部依赖
};
// 若打包正式环境，压缩代码
if (env === 'production') {
    config.plugins.push(
        terser({
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            }
        })
    );
}

export default config;
