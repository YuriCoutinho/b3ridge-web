export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 72 = ponto em que o GitHub trunca o título do commit na UI
    'header-max-length': [2, 'always', 72],
  },
};
