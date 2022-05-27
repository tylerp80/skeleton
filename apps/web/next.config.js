const withTM = require("next-transpile-modules")([
  "@skeleton/lib",
  "@skeleton/prisma",
  "@skeleton/api",
  "@skeleton/ui",
]);

module.exports = withTM({
  reactStrictMode: true,
});
