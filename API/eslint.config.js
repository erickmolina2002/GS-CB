// ESLint com regras de seguranca (eslint-plugin-security).
// npm run lint:security  ->  falha o build se encontrar algo.
const security = require('eslint-plugin-security');

module.exports = [
  { ignores: ['node_modules/**', 'security/**', 'data/**'] },
  {
    files: ['**/*.js'],
    plugins: { security },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
    rules: { ...security.configs.recommended.rules },
  },
];
