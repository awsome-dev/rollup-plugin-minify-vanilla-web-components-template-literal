# rollup-plugin-minify-vanilla-web-components-template-literal

This repository was created primarily to minify TypeScript Vanilla Web Components with Unocss in the Vite environment.

This code is based on [rollup-plugin-minify-html-literals](https://github.com/asyncLiz/rollup-plugin-minify-html-literals).

Changes from the original

- Support for Vite in TypeScript environment (original had a type error in vite.config.ts)
- Support for es modules (both commonjs and es modules)
- Support for rollup 4
- Changed test code to jest-based
- Reduction of dependency libraries

-----

(for Japanese)

このレポジトリは、主にTypeScript Vite環境でのUnocssを用いたVanilla Web Components のminifyを目的として作成された。
このコードは [rollup-plugin-minify-html-literals](https://github.com/asyncLiz/rollup-plugin-minify-html-literals) をベースとしている。

オリジナルからの変更点
- TypeScript環境のViteに対応 （オリジナルは vite.config.ts でタイプエラー）
- es modulesに対応 （commonjsとes moduleの両方に対応）
- rollup 4 に対応
- テストコードをjestベースに変更
- 依存ライブラリの削減

-----

[![npm](https://img.shields.io/npm/v/rollup-plugin-minify-vanilla-web-components-template-literal.svg)](https://www.npmjs.com/package/rollup-plugin-minify-vanilla-web-components-template-literal)

Uses [minify-html-literals](https://www.npmjs.com/package/minify-html-literals) to minify HTML and CSS markup inside JavaScript template literal strings.


## Usage

```typescript
// vite.config.ts
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
import minifyHTML from 'rollup-plugin-minify-vanilla-web-components-template-literal'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      formats: ['es'],
      entry: [
        'src/sample-elements-01.ts',
        'src/sample-elements-02.ts',
        'src/sample-elements-03.ts',
      ],
      fileName: (_, entryName) => {
        return `js/${entryName}.js`;
      },
    },
  },
  plugins: [
    splitVendorChunkPlugin(),
    minifyHTML(),
    UnoCSS({
      mode: 'shadow-dom',
    }),
  ]
})

```

By default, this will minify any tagged template literal string whose tag contains "html" or "css" (case insensitive). [Additional options](https://www.npmjs.com/package/minify-html-literals#options) may be specified to control what templates should be minified.

## Options

```js
export default {
  entry: 'index.js',
  dest: 'dist/index.js',
  plugins: [
    minifyHTML({
      // minimatch of files to minify
      include: [],
      // minimatch of files not to minify
      exclude: [],
      // set to `true` to abort bundling on a minification error
      failOnError: false,
      // minify-html-literals options
      // https://www.npmjs.com/package/minify-html-literals#options
      options: null,

      // Advanced Options
      // Override minify-html-literals function
      minifyHTMLLiterals: null,
      // Override rollup-pluginutils filter from include/exclude
      filter: null
    })
  ]
};
```
