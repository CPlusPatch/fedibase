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

export function App() {
	const [state, setState]: any = useContext(StateContext) ?? useState({
    replyingTo: null,
    mobileEditorOpened: false,
    notificationsOpened: false,
    path: "/",
    sidebarOpened: false,
    quotingTo: null,
});
	const client: MegalodonInterface = useContext(AuthContext);

	const [component, setComponent] = useState(<></>);
	const [loginMode, setLoginMode] = useState<boolean>(false);

	useEffect(() => {
		if (window) {
			const paths = window.location.pathname.split("/");

			if ((!localStorage.getItem("accessToken") || !localStorage.getItem("instanceType")) && paths[1] !== "login") {
				window.location.pathname = "/login";
			}

			switch (paths[1]) {
				case "posts":
					setComponent(<Conversation id={paths[2]} />);
					break;
				case "local":
					setComponent(<LocalFeed />);
					break;
				case "":
					setComponent(<HomeFeed />);
					break;
				case "users":
					client.getAccount(paths[2].replace("@", "")).then((res) => {
						setComponent(<UserFeed account={res.data} />);
					});
					break;
				case "login":
					setLoginMode(true);
			}
		}
	}, [client, state.path]);

	return (
		<>
			{!loginMode && (
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
						<div className="relative duration-200 bg-dark font-inter">
							<Nav />

							<MainLayout>{component}</MainLayout>
						</div>
					</AuthContext.Provider>
				</StateContext.Provider>
			)}
			{loginMode && (
				<LoginForm code={new URLSearchParams(document.location.search).get("code") ?? ""} />
			)}
		</>
	);
}
