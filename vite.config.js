import { defineConfig } from "vite";
import zipPack from "vite-plugin-zip-pack";

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    assetsInlineLimit: 0,
    reportCompressedSize: false,
  },
  plugins: [
    zipPack({
      outDir: "./dist-xdc",
      outFileName: "crypto-whisper.xdc",
    }),
  ],
});

