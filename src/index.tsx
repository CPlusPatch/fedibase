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
import LoginForm from "components/login/LoginForm";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "./components/context/AuthContext";
import { Conversation } from "./components/feed/Conversation";
import { HomeFeed } from "./components/feed/HomeFeed";
import { LocalFeed } from "./components/feed/LocalFeed";
import { UserFeed } from "./components/feed/UserFeed";
import MainLayout from "./components/layout/MainLayout";
import Nav from "./components/sidebar/Nav";
import Cookies from "js-cookie";
import { StatusType } from "components/posts/Status";
import { useTraceUpdate } from "utils/useTraceUpdate";
import { useDispatch, useSelector } from "react-redux";
import { setPath, StateType } from "utils/stateSlice";

export default function Index(props) {
	const client = useContext(AuthContext);

	const state2 = useSelector(state => (state as any).state as StateType);
	const dispatch = useDispatch();

	const [component, setComponent] = useState(<></>);
	const [loginMode, setLoginMode] = useState<boolean>(false);

	const handlePopState = (e: PopStateEvent) => {
				dispatch(setPath((e.target as Window).location.pathname));
			}

	useEffect(() => {
		if (window) {
			if (Cookies.get("theme") === "dark") {
				document.getElementsByTagName("html")[0].className += " dark";
			}

			const paths = state2.path.split("/");

			if (
				(!localStorage.getItem("accessToken") || !localStorage.getItem("instanceType"))
			) {
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

			window.addEventListener("popstate", handlePopState)

			return () => window.removeEventListener("popstate", handlePopState);
		}
	}, [client, state2.path]);

	return (
		<>
			{!loginMode && (
				<div className="relative duration-200 bg-dark font-inter">
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