exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
  './Client/**/*.js',
  './Server/**/*.js',
  './e2e/**/*.js'
  ],
  baseUrl: 'https://localhost:8080'
};
