import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
    },
    rules: {
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off", // if using React 17+
    },
  },
  {
  ignores: ["dist/**", "node_modules/**"],
}
];