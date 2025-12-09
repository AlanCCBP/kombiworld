import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.extends("plugin:prettier/recommended"),
  {
    plugins: {
      prettier: prettierPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "prettier/prettier": "warn",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      ".turbo/**",
      ".vercel/**",
      "out/**",
      "build/**",
      "coverage/**",
      "public/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
