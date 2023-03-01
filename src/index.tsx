/*
* Copyright (C) 2023 CPlusPatch
* 
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU General
* Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
* option) any later version.

* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
* implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
* for more details.

* You should have received a copy of the GNU General Public License along with this program.  If not, see 
* <http://www.gnu.org/licenses/>.
*/
import LoginForm from "./components/login/LoginForm";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "./components/context/AuthContext";
import { Conversation } from "./components/feed/Conversation";
import { HomeFeed } from "./components/feed/HomeFeed";
import { LocalFeed } from "./components/feed/LocalFeed";
import { UserFeed } from "./components/feed/UserFeed";
import MainLayout from "./components/layout/MainLayout";
import Nav from "./components/sidebar/Nav";
import { StatusType } from "./components/posts/Status";
import { useStore } from "utils/store";

export default function Index() {
	const client = useContext(AuthContext);

	const [state, setState] = useStore();

	const [component, setComponent] = useState(<></>);
	const [loginMode, setLoginMode] = useState<boolean>(false);

	const handlePopState = (e: PopStateEvent) => {
		setState(prev => ({
			...prev,
			path: (e.target as Window).location.pathname,
		}));
	};

	useEffect(() => {
		console.log(state.path);
		if (window) {
			if (localStorage.getItem("theme") === "dark") {
				document.getElementsByTagName("html")[0].className += " dark";
			}

			let paths;
			if (state.path) {
				paths = state.path.split("/");
			} else {
				paths = window.location.pathname.split("/");
			}

			if (!localStorage.getItem("accessToken") || !localStorage.getItem("instanceType")) {
				setLoginMode(true);
			}

			switch (paths[1]) {
			case "posts":
				setComponent(<Conversation id={paths[2]} mode={StatusType.Post} />);
				break;
			case "local":
				setComponent(<LocalFeed />);
				break;
			case "":
				setComponent(<HomeFeed />);
				break;
			case "users":
				client?.getAccount(paths[2].replace("@", "")).then(res => {
					setComponent(<UserFeed account={res.data} />);
				});
				break;
			case "login":
				setLoginMode(true);
			}

			window.addEventListener("popstate", handlePopState);

			return () => window.removeEventListener("popstate", handlePopState);
		}
	}, [client, state.path]);

	return (
		<>
			{!loginMode && (
				<div className="relative duration-200 font-inter bg-dark flex overflow-hidden">
					<Nav />

					<MainLayout>{component}</MainLayout>
				</div>
			)}
			{loginMode && (
				<LoginForm code={new URLSearchParams(document.location.search).get("code") ?? ""} />
			)}
		</>
	);
}
