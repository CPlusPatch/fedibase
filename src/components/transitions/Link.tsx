import { JSXInternal } from "preact/src/jsx";
import { useStore } from "utils/store";

export function Link(props: JSXInternal.HTMLAttributes<HTMLAnchorElement>) {
	const [state, setState] = useStore();

	return (
		<a
			{...props}
			onClick={e => {
				if (!e.ctrlKey && !e.metaKey) {
					e.preventDefault();
					setState(s => ({
						...s,
						path: props.href as string,
					}));
				}
			}}></a>
	);
}
