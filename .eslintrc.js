module.exports = {
  env: {
    browser: true, // Permite o uso de variáveis globais do navegador
    es2021: true, // Permite o uso de recursos ES2021
    node: true, // Permite o uso de variáveis globais do Node.js
  },
  extends: [
    "eslint:recommended", // Habilita as regras recomendadas do ESLint
    "plugin:@typescript-eslint/recommended", // Regras recomendadas para TypeScript
  ],
  parser: "@typescript-eslint/parser", // Define o parser para TypeScript
  parserOptions: {
    ecmaVersion: 12, // Permite o uso de recursos ECMAScript 2021
    sourceType: "module", // Permite o uso de imports
  },
  plugins: [
    "@typescript-eslint", // Adiciona o plugin do ESLint para TypeScript
  ],
  rules: {
    // Suas regras personalizadas aqui
    semi: ["error", "always"], // Exige ponto e vírgula
    quotes: ["error", "single"], // Exige o uso de aspas simples
    "no-console": "warn", // Emite um aviso para uso de console
    // Adicione outras regras conforme necessário
    "require-await": "error",
    "no-unused-vars": [
      "warn",
      { vars: "all", args: "after-used", ignoreRestSiblings: true },
    ],
  },
};
