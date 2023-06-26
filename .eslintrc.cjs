/**
 * @type {import('@typescript-eslint/experimental-utils').TSESLint.Linter.Config}
 */
const config = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'turbo',
    'prettier'
  ],
  globals: {
    es2020: true
  },
  plugins: ['import'],
  rules: {
    /**
     * 'max-lines' .. error
     *
     * 各ファイルは 150 行を上限とする. このカウントにコメントや空行は含めない.
     */
    'max-lines': [
      'error',
      {
        max: 150,
        skipComments: true,
        skipBlankLines: true
      }
    ],

    /**
     * 'max-lines-per-function' .. error
     *
     * function は 50 行を上限とする. このカウントにコメントや空行は含めない.
     */
    'max-lines-per-function': [
      'error',
      {
        skipBlankLines: true,
        skipComments: true
      }
    ],

    /**
     * 'max-statements' .. warning
     *
     * function 内で定義する statement (e.g. `var` `let` `const`) は 10 個を超える場合は警告とする.
     * 単純に冗長な手続きを書かざるを得ない場合などがあり、このルールは厳密に守ることが出来ない.
     * 言い換えれば、このケースで警告が出ている場合は、 "複雑なコード" であることを意識すること.
     *
     * e.g.
     * ```ts
     * function foo() {
     *   var foo1 = 1;
     *   var foo2 = 2;
     *   var foo3 = 3;
     *   var foo4 = 4;
     *   var foo5 = 5;
     *   var foo6 = 6;
     *   var foo7 = 7;
     *   var foo8 = 8;
     *   var foo9 = 9;
     *   var foo10 = 10;
     *
     *   var foo11 = 11; // Too many.
     * }
     * ```
     */
    'max-statements': ['warn', { max: 20 }],

    /**
     * 'no-else-return' .. error
     * else ブロック及び、 else-if ブロックにおける return を禁止する.
     * 具体的には、以下の書き方が正となる
     *
     * e.g.
     * ```ts
     * function hoge() {
     *   if (conditionA) {
     *     return 1
     *   }
     *   if (conditionB) {
     *     return 2
     *   }
     *
     *   return 3
     * }
     * ```
     */
    'no-else-return': ['error', { allowElseIf: false }],

    /**
     * 'max-depth' .. error (max 4 -> 3)
     *
     * 入れ子のレベルを最大 3 段階に制限する.
     * 深ければ深いほど可読性が悪化するため.
     *
     * e.g.
     * ```ts
     * function hoge() {
     *   if (true) {
     *     // Nested 1 deep
     *     if (true) {
     *       // Nested 2 deep
     *       if (true) {
     *         // Nested 3 deep
     *         if (true) {
     *           // Nested 4 deep (ERROR!)
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     */
    'max-depth': [
      'error',
      {
        max: 3
      }
    ],

    /**
     * '@typescript-eslint/array-type' .. array-simple モード
     * TSでArrayを記載する際に、 シンプルな型なら Hoge[] を強制、複雑な型なら Array<...> を強制する
     */
    '@typescript-eslint/array-type': [
      'warn',
      {
        default: 'array-simple'
      }
    ],

    /**
     * '@typescript-eslint/explicit-module-boundary-types' .. warn
     * すべての関数には、引数と返り値の型をつくりましょう。
     * (returnしないなら省略可能)
     */
    '@typescript-eslint/explicit-module-boundary-types': 'warn',

    /**
     * '@typescript-eslint/no-unused-vars' .. error
     * 未使用の変数はすべて消しましょう。
     * ただし、 "_" から始まる変数名については "明示的に未使用である宣言として扱い" このルールを無効とする
     */
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }
    ],

    /**
     * '@typescript-eslint/no-namespace' .. 無効化
     * TS の構文で namespace を使っても良い
     *
     * [背景]
     * 使えたほうが便利なケースがある
     */
    '@typescript-eslint/no-namespace': 'off',

    /**
     * '@typescript-eslint/no-non-null-assertion' .. 無効化
     * 非nullアサーション構文の利用を禁止しない
     *
     * [背景]
     * これを守り切るには高めのTS力が試されるため
     */
    '@typescript-eslint/no-non-null-assertion': 'off',

    /**
     * '@typescript-eslint/ban-types' .. 基本は error, ただし `{}` のみ許可
     * 非推奨の型の利用を禁止する (e.g. `string` ではなく `String`, Function, Object など)
     *
     * [背景]
     * typescript 4.8 のリリース内容に合わせての対応
     * → https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/
     *
     * `{}` とは、 null, undefined とは異なる任意の型であることを示す.
     * 4.8 バージョンアップによって利便性が向上したため、利用を全面的に許可する
     */
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          '{}': false
        },
        extendDefaults: true
      }
    ],

    /**
     * 'import/extensions' .. 一部の拡張子のみ、 import 文での拡張子の記載を強制する
     *
     * [背景]
     * Nuxt Server Side Process にて、 js ファイルは拡張子がないと参照できないため.
     */
    'import/extensions': [
      'error',
      {
        js: 'always',
        mjs: 'always',
        cjs: 'always',
        json: 'always',
        css: 'always',
        sass: 'always',
        scss: 'always',
        vue: 'always'
      }
    ]
  }
}

module.exports = config
