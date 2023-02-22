import 'styles/globals.css';
import Head from 'next/head';
import NextNProgress from "nextjs-progressbar";
import { AppProps } from 'next/app';
import { AuthContext } from 'components/context/AuthContext';
import generator from 'megalodon';
import { StateContext } from 'components/context/StateContext';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

function App({ Component, pageProps }: AppProps) {
	const [state, setState] = useState({
		replyingTo: null,
		mobileEditorOpened: false,
		notificationsOpened: false,
		path: "",
		sidebarOpened: false,
		quotingTo: null,
	});

	useEffect(() => {
		const theme = (getCookie("theme") ?? "light").toString();
		const html = document.getElementsByTagName("html")[0];

		if (theme === "light") {
			html.className = html.className.replace(" dark", "");
		} else if (theme === "dark") {
			html.className = html.className + " dark";
		}
	}, [])

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
					<Head>
						{typeof window !== "undefined" &&
							localStorage.getItem("accessToken") == null && window.location.pathname !== "/login" && (
								<meta httpEquiv="refresh" content="0;url=/login" />
							)}
						<meta name="viewport" content="width=device-width, initial-scale=1" />
					</Head>
					<NextNProgress />
					<Component {...pageProps} />
				</AuthContext.Provider>
			</StateContext.Provider>
		</>
	);
}

export default App
