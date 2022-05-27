const base = require("@skeleton/config/tailwind-preset");
module.exports = {
  ...base,

  content: [...base.content, "../../packages/ui/**/*.{js,ts,jsx,tsx}"],
};
