import LoginForm from "components/login/LoginForm";
import generator, { MegalodonInterface } from "megalodon";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "./components/context/AuthContext";
import { StateContext } from "./components/context/StateContext";
import { Conversation } from "./components/feed/Conversation";
import { HomeFeed } from "./components/feed/HomeFeed";
import { LocalFeed } from "./components/feed/LocalFeed";
import { UserFeed } from "./components/feed/UserFeed";
import MainLayout from "./components/layout/MainLayout";
import Nav from "./components/sidebar/Nav";
import Cookies from "js-cookie";
import { Index } from "index";

export function App() {
	const [state, setState]: any =
		useContext(StateContext) ??
		useState({
			replyingTo: null,
			mobileEditorOpened: false,
			notificationsOpened: false,
			path: "/",
			sidebarOpened: false,
			quotingTo: null,
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
