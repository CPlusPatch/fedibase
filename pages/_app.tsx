import 'styles/globals.css';
import Head from 'next/head';
import NextNProgress from "nextjs-progressbar";
import { AppProps } from 'next/app';
import { AuthContext } from 'components/context/AuthContext';
import generator from 'megalodon';
import { getCookie } from 'cookies-next';
import { StateContext } from 'components/context/StateContext';
import { useState } from 'react';

function App({ Component, pageProps }: AppProps) {
	const [state, setState] = useState<{
		replyingTo: null | Entity.Status;
	} | null>({
		replyingTo: null,
	});
	return (
		<>
			<StateContext.Provider value={[state, setState] as any}>
				<AuthContext.Provider
					value={
						(getCookie("accessToken") ?? "").toString() !== "" &&
						(getCookie("instanceType") ?? "").toString() !== ""
							? generator(
									(getCookie("instanceType") ?? "").toString() as any,
									(getCookie("instanceUrl") ?? "").toString(),
									(getCookie("accessToken") ?? "").toString(),
							  )
							: null
					}>
					<Head>
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
