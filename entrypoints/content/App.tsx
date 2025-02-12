import { Logo } from "@/entrypoints/content/Logo.tsx";
import OpenAI from "openai";
import { useEffect } from "react";

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

export const App: React.FC = () => {
	const [translatedText, setTranslatedText] = useState("");
	const [selectedText, setSelectedText] = useState("");
	const [triggerPosition, setTriggerPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [show, showTranslatedArea] = useState(false);

	const handleTranslate = async () => {
		showTranslatedArea(true);
		const completion = await openai.chat.completions.create({
			messages: [
				{ role: "system", content: "次のテキストを日本語に訳してください" },
				{ role: "user", content: selectedText },
			],
			model: "gpt-3.5-turbo",
			stream: true,
		});

		for await (const chunk of completion) {
			const translatedText = chunk.choices.at(0)?.delta.content || "";
			if (translatedText) {
				setTranslatedText(translatedText);
			}
		}
	};

	useEffect(() => {
		document.addEventListener("mouseup", (event) => {
			const text = window.getSelection()?.toString().trim();
			setSelectedText(text || "");
			showTranslatedArea(false);

			if ((text?.length || 0) > 0) {
				setTriggerPosition({ x: event.pageX, y: event.pageY });
			} else {
				setTriggerPosition(null);
			}
		});
	}, [setTriggerPosition, setSelectedText, showTranslatedArea]);

	if (!triggerPosition) return null;

	console.log(
		JSON.stringify(
			{ show, translatedText, triggerPosition, selectedText },
			null,
			2,
		),
	);

	return (
		<div
			className="absolute"
			style={{
				top: triggerPosition.y,
				left: triggerPosition.x,
			}}
		>
			{show ? (
				<div className="w-fit p-4 bg-white rounded-lg text-black translated-area">
					{translatedText || "翻訳中..."}
				</div>
			) : (
				<button
					type="button"
					className="size-8 rounded-full bg-white flex justify-center items-center cursor-pointer translated-area"
					onClick={handleTranslate}
				>
					<Logo />
				</button>
			)}
		</div>
	);
};
