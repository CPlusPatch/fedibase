import 'styles/globals.css';
import Head from 'next/head';
import NextNProgress from "nextjs-progressbar";
import { useState } from 'react';
import { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
				<Head>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1"
					/>
				</Head>
				<NextNProgress />
				<Component {...pageProps} />
		</>
	);
}

export default App
