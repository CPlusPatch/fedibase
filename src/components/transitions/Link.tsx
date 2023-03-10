import { getSetting } from "components/settings/Settings";
import { memo } from "preact/compat";
import { JSXInternal } from "preact/src/jsx";
import { modifyStore } from "utils/functions";
import { useBackupStore } from "utils/useBackupStore";

export const Link = memo(
	(
		props: JSXInternal.HTMLAttributes<HTMLAnchorElement> & {
			sidebar?: string;
		}
	) => {
		const { setStore } = useBackupStore();

		return (
			<a
				{...props}
				onClick={e => {
					if (!e.ctrlKey && !e.metaKey) {
						e.preventDefault();

						if (
							props.sidebar &&
							getSetting("sidebarLoad") === "on"
						) {
							modifyStore(setStore, {
								mobilePostViewer: true,
								viewingConversation: props.sidebar,
							});
						} else {
							history.pushState(null, "", props.href as string);
							modifyStore(setStore, {
								path: props.href as string,
							});
						}
					}
				}}></a>
		);
	}
);
