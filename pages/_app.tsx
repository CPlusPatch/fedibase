import 'styles/globals.css';
import Head from 'next/head';
import NextNProgress from "nextjs-progressbar";
import { useState } from 'react';
import { AppProps } from 'next/app';
import { AuthContext } from 'components/context/AuthContext';
import generator from 'megalodon';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<AuthContext.Provider value={generator("pleroma", process.env.NEXT_PUBLIC_INSTANCE_URL, process.env.NEXT_PUBLIC_ACCESS_TOKEN)}>
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
