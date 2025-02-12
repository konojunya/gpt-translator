import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style.css";

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: "ui",

	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: "gpt-translator",
			position: "inline",
			anchor: "body",
			append: "after",
			onMount: (container) => {
				console.log("container", container);
				const wrapper = document.createElement("div");
				container.append(wrapper);

				const root = createRoot(wrapper);

				console.log("root", root);
				root.render(<App />);

				return { root, wrapper };
			},
			onRemove: (elements) => {
				elements?.root.unmount();
				elements?.wrapper.remove();
			},
		});

		ui.mount();
	},
});
