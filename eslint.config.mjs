import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next', "next/core-web-vitals", "next/typescript"],
    rules: {
      // don't break if there's unescaped entities
      'react/no-unescaped-entities': 'off',

      // <img> is good enough, thank you
      '@next/next/no-img-element': 'off',
    },
  }),
];

export default eslintConfig;
