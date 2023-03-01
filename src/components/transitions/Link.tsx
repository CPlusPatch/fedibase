import { JSXInternal } from "preact/src/jsx";
import { useStore } from "utils/store";

export function Link(props: JSXInternal.HTMLAttributes<HTMLAnchorElement>) {
	const [, setState] = useStore();

	return (
		<a
			{...props}
			onClick={e => {
				if (!e.ctrlKey && !e.metaKey) {
					e.preventDefault();
					history.pushState(null, "", props.href as string);
					setState(s => ({
						...s,
						path: props.href as string,
					}));
				}
			}}>
		</a>
	);
}
