import generator from "megalodon";
import { useContext, useState } from "preact/hooks";
import { AuthContext } from "./components/context/AuthContext";
import { StateContext } from "./components/context/StateContext";
import { Index } from "index";

export function App() {
	const [state, setState]: any =
		useState({
			replyingTo: null,
			mobileEditorOpened: false,
			notificationsOpened: false,
			path: "/",
			sidebarOpened: false,
			quotingTo: null,
			viewingConversation: ""
		});

	return (
		<>
			<StateContext.Provider value={[state, setState]}>
				<AuthContext.Provider
					value={
						typeof window !== "undefined" &&
						localStorage.getItem("accessToken") &&
						localStorage.getItem("instanceType")
							? generator(
									localStorage.getItem("instanceType") as any,
									localStorage.getItem("instanceUrl"),
									localStorage.getItem("accessToken"),
							  )
							: null
					}>
					<Index />
				</AuthContext.Provider>
			</StateContext.Provider>
		</>
	);
}
