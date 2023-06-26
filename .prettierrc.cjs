/**
 * @type {import('prettier').Config}
 */
const config = {
  semi: false,
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'none',
  htmlWhitespaceSensitivity: 'ignore',
  bracketSameLine: true,
  singleAttributePerLine: true,
  overrides: [
    {
      files: '*.ts',
      options: {
        printWidth: 100
      }
    }
  ]
}
module.exports = config