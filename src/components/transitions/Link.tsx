import { JSXInternal } from "preact/src/jsx";
import { useStore } from "utils/store";

export function Link(props: JSXInternal.HTMLAttributes<HTMLAnchorElement> & {
	sidebar?: string
}) {
	const [, setPath] = useStore.path();
	const [, setConversation] = useStore.viewingConversation();
	const [, setMobilePostViewer] = useStore.mobilePostViewer();

	return (
		<a
			{...props}
			onClick={e => {
				if (!e.ctrlKey && !e.metaKey) {
					e.preventDefault();
					
					if (props.sidebar) {
						setConversation(props.sidebar);
						setMobilePostViewer(true);
					} else {
						history.pushState(null, "", props.href as string);
						setPath(props.href as string);
					}
				}
			}}>
		</a>
	);
}
