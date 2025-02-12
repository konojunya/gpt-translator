import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	runner: {
		startUrls: ["https://ja.wordpress.org/plugins/wpglobus/"],
	},
	manifest: {
		permissions: ["scripting", "activeTab", "<all_urls>"],
	},
	vite: () => ({
		plugins: [react(), tailwindcss()],
	}),
});
