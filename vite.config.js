import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { resolve } from "path";

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  base: "./",
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
  server: {
		port: 5188,
		host: "0.0.0.0",
  }

})
