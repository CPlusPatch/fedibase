import 'styles/globals.css';
import Head from 'next/head';
import NextNProgress from "nextjs-progressbar";
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { AuthContext } from 'components/context/AuthContext';
import generator from 'megalodon';
import { getFromLocalStorage } from 'utils/functions';

function App({ Component, pageProps }: AppProps) {
	const [accessToken, setAccessToken] = useState<string>("");

	useEffect(() => {
		setAccessToken(getFromLocalStorage("accessToken", ""));
	}, []);

	return (
		<>
			<AuthContext.Provider value={accessToken !== "" ? generator("pleroma", getFromLocalStorage("instanceUrl", ""), accessToken) : null}>
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
				</Head>
				<NextNProgress />
				<Component {...pageProps} />
			</AuthContext.Provider>
		</>
	);
}

export default App
