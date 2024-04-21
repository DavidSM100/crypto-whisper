import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import zipPack from "vite-plugin-zip-pack";

let appName = "CryptoWhisper";

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    reportCompressedSize: false,
  },
  plugins: [
    createHtmlPlugin(),
    zipPack({
      outDir: "./dist",
      outFileName: appName + ".xdc",
    }),
  ],
});

