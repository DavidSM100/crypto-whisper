import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import zipPack from "vite-plugin-zip-pack";

let appName = "CryptoWhisper";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      // dev specific config
      plugins: [
        createHtmlPlugin({
          minify: false,
          inject: {
            tags: [
              {
                injectTo: "head-prepend",
                tag: "script",
                attrs: {
                  src: "./node_modules/eruda/eruda.js",
                },
              },
              {
                injectTo: "head-prepend",
                tag: "script",
                attrs: {
                  src: "./dev/start-eruda.js",
                },
              },
            ],
          },
        }),
      ],
    };
  } else {
    // command === 'build'
    return {
      // build specific config
      build: {
        assetsInlineLimit: 0,
        reportCompressedSize: false,
      },
      plugins: [
        createHtmlPlugin({
          minify: false,
          inject: {
            tags: [
              {
                injectTo: "head-prepend",
                tag: "script",
                attrs: {
                  src: "eruda.js",
                },
              },
              {
                injectTo: "head-prepend",
                tag: "script",
                attrs: {
                  src: "start-eruda.js",
                },
              },
            ],
          },
        }),
        zipPack({
          outDir: "./dev",
          outFileName: appName + "-dev" + ".xdc",
        }),
      ],
    };
  }
});
