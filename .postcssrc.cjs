module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-preset-env")({
      features: {
        "cascade-layers": false,
      },
    }),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
