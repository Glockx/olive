Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./build",
  minify: true,
  format: "esm",
  external: ["canvas"],
  target: "node",
});
