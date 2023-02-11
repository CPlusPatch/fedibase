import 'styles/globals.css';
import Head from 'next/head';
import NextNProgress from "nextjs-progressbar";
import { AppProps } from 'next/app';
import { AuthContext } from 'components/context/AuthContext';
import generator from 'megalodon';
import { getCookie } from 'cookies-next';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
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
		</>
	);
}

export default App
