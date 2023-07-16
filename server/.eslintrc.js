module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: ["prettier", "plugin:prettier/recommended"],
  semi: ["warn", "never", { beforeStatementContinuationChars: "always" }],
  // Prettier
  "prettier/prettier": [
    "error",
    {
      trailingComma: "all",
      semi: false,
      singleQuote: true,
      printWidth: 120,
      arrowParens: "avoid",
    },
  ],
};
