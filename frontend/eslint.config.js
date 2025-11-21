// eslint.config.js
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": ts,
    },
    rules: {
      ...vue.configs["flat/recommended"].rules,
      "vue/comment-directive": "off",
    },
  },

  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": ts,
    },
  },
];
