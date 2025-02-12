import { Logo } from "@/entrypoints/content/Logo.tsx";
import { useEffect } from "react";

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

		try {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const translator = await (self as any).ai.translator.create({
				sourceLanguage: "en",
				targetLanguage: "ja",
			});

			const text = await translator.translate(selectedText);
			setTranslatedText(text);
		} catch (e) {
			console.error(e);
			setTranslatedText((e as Error).message);
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
